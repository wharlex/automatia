import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Read access control file
    const accessFilePath = path.join(process.cwd(), 'data', 'access.json')
    
    if (!fs.existsSync(accessFilePath)) {
      return NextResponse.json({ 
        hasAccess: false, 
        isAdmin: false,
        message: 'Access control file not found' 
      })
    }

    const accessData = JSON.parse(fs.readFileSync(accessFilePath, 'utf8'))
    
    const hasChatbotAccess = accessData.chatbot_access.includes(email)
    const isAdmin = accessData.admin_users.includes(email)

    return NextResponse.json({
      hasAccess: hasChatbotAccess,
      isAdmin: isAdmin,
      message: hasChatbotAccess ? 'Access granted' : 'Access denied'
    })

  } catch (error) {
    console.error('Error checking access:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      hasAccess: false,
      isAdmin: false
    }, { status: 500 })
  }
}




