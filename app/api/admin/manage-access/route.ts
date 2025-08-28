import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { adminEmail, action, userEmail } = await request.json()
    
    if (!adminEmail || !action || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Read access control file
    const accessFilePath = path.join(process.cwd(), 'data', 'access.json')
    
    if (!fs.existsSync(accessFilePath)) {
      return NextResponse.json({ error: 'Access control file not found' }, { status: 404 })
    }

    const accessData = JSON.parse(fs.readFileSync(accessFilePath, 'utf8'))
    
    // Verify admin permissions
    if (!accessData.admin_users.includes(adminEmail)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    // Perform action
    switch (action) {
      case 'grant':
        if (!accessData.chatbot_access.includes(userEmail)) {
          accessData.chatbot_access.push(userEmail)
        }
        break
        
      case 'revoke':
        accessData.chatbot_access = accessData.chatbot_access.filter((email: string) => email !== userEmail)
        break
        
      case 'add_admin':
        if (!accessData.admin_users.includes(userEmail)) {
          accessData.admin_users.push(userEmail)
        }
        break
        
      case 'remove_admin':
        accessData.admin_users = accessData.admin_users.filter((email: string) => email !== userEmail)
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update timestamp
    accessData.last_updated = new Date().toISOString()

    // Write back to file
    fs.writeFileSync(accessFilePath, JSON.stringify(accessData, null, 2))

    return NextResponse.json({
      success: true,
      message: `Action '${action}' completed successfully for ${userEmail}`,
      updatedAccess: accessData
    })

  } catch (error) {
    console.error('Error managing access:', error)
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminEmail = searchParams.get('adminEmail')
    
    if (!adminEmail) {
      return NextResponse.json({ error: 'Admin email required' }, { status: 400 })
    }

    // Read access control file
    const accessFilePath = path.join(process.cwd(), 'data', 'access.json')
    
    if (!fs.existsSync(accessFilePath)) {
      return NextResponse.json({ error: 'Access control file not found' }, { status: 404 })
    }

    const accessData = JSON.parse(fs.readFileSync(accessFilePath, 'utf8'))
    
    // Verify admin permissions
    if (!accessData.admin_users.includes(adminEmail)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      accessData
    })

  } catch (error) {
    console.error('Error reading access data:', error)
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}




