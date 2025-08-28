import { NextRequest } from "next/server"
import { adminAuth } from "./firebaseAdmin"

export async function requireUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token de autorización requerido')
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    if (!decodedToken.uid) {
      throw new Error('Token inválido')
    }

    // Obtener claims del usuario
    const userRecord = await adminAuth.getUser(decodedToken.uid)
    
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      workspaceId: userRecord.customClaims?.workspaceId || 'default',
      features: userRecord.customClaims?.features || {},
      role: userRecord.customClaims?.role || 'user'
    }
  } catch (error) {
    console.error('[Auth] Error verificando token:', error)
    throw new Error('No autorizado')
  }
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req)
  
  if (user.role !== 'admin') {
    throw new Error('Acceso denegado: se requieren permisos de administrador')
  }
  
  return user
}
