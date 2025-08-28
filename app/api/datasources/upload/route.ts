import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { parse } from "csv-parse/sync"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const formData = await req.formData()
    
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const type = formData.get("type") as string

    if (!file || !name || !type) {
      return NextResponse.json({ 
        error: "Archivo, nombre y tipo son requeridos" 
      }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipo de archivo no soportado" 
      }, { status: 400 })
    }

    // Crear directorio de uploads si no existe
    const uploadDir = join(process.cwd(), "uploads", user.workspaceId || "default")
    await mkdir(uploadDir, { recursive: true })

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}_${file.name}`
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    // Procesar archivo según su tipo
    let parsedData: any = null
    let parsedSchema: any = null
    let rowsCount = 0
    let status = "READY"

    try {
      if (file.type === 'text/csv') {
        const csvText = buffer.toString('utf-8')
        parsedData = parse(csvText, { columns: true })
        parsedSchema = Object.keys(parsedData[0] || {}).map(key => ({
          name: key,
          type: 'string'
        }))
        rowsCount = parsedData.length
      }
      
      else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        parsedData = XLSX.utils.sheet_to_json(worksheet)
        parsedSchema = Object.keys(parsedData[0] || {}).map(key => ({
          name: key,
          type: 'string'
        }))
        rowsCount = parsedData.length
      }
      
      else if (file.type === 'application/json') {
        parsedData = JSON.parse(buffer.toString('utf-8'))
        if (Array.isArray(parsedData)) {
          parsedSchema = Object.keys(parsedData[0] || {}).map(key => ({
            name: key,
            type: 'string'
          }))
          rowsCount = parsedData.length
        } else {
          parsedSchema = Object.keys(parsedData).map(key => ({
            name: key,
            type: 'string'
          }))
          rowsCount = 1
        }
      }
      
      else if (file.type === 'application/pdf') {
        // PDF processing temporarily disabled
        status = "PENDING"
        parsedData = null
        parsedSchema = null
        rowsCount = 0
      }

    } catch (parseError) {
      status = "ERROR"
      console.error("Error parsing file:", parseError)
    }

    // Crear datasource en Firestore
    const datasourceId = `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const datasource = {
      id: datasourceId,
      name,
      type: type.toUpperCase(),
      uri: filePath,
      mime: file.type,
      status,
      parsedSchema,
      rowsCount,
      vectorized: false,
      userId: user.uid,
      workspaceId: user.workspaceId || 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('datasources')
      .doc(datasourceId)
      .set(datasource)

    // Si es un archivo tabular, guardar los datos normalizados
    if (status === "READY" && parsedData && Array.isArray(parsedData)) {
      const batch = adminDb.batch()
      
      parsedData.forEach((row, index) => {
        const rowRef = adminDb
          .collection('workspaces')
          .doc(user.workspaceId || 'default')
          .collection('datasources')
          .doc(datasourceId)
          .collection('rows')
          .doc(`row_${index}`)
        
        batch.set(rowRef, {
          id: `row_${index}`,
          datasourceId,
          rowNumber: index,
          data: row,
          createdAt: new Date()
        })
      })
      
      await batch.commit()
    }

    // Si es PDF, encolar para indexación RAG (temporalmente deshabilitado)
    if (file.type === 'application/pdf') {
      console.log(`PDF ${fileName} - procesamiento temporalmente deshabilitado`)
    }

    return NextResponse.json({
      success: true,
      message: "Archivo subido y procesado exitosamente",
      datasource: {
        id: datasourceId,
        name,
        type,
        status,
        rowsCount,
        parsedSchema
      }
    })

  } catch (error) {
    console.error("[Datasource Upload] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    
    const datasourcesSnapshot = await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('datasources')
      .orderBy('createdAt', 'desc')
      .get()

    const datasources = datasourcesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        status: data.status,
        rowsCount: data.rowsCount,
        vectorized: data.vectorized,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      }
    })

    return NextResponse.json({ datasources })

  } catch (error) {
    console.error("[Datasources Get] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
