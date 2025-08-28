import { NextRequest, NextResponse } from 'next/server'
import { encryptSecret } from '@/lib/crypto'
import fs from 'fs'
import path from 'path'

const WHATSAPP_CONFIG_FILE = path.join(process.cwd(), 'data', 'whatsapp-config.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(WHATSAPP_CONFIG_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load WhatsApp configuration
function loadWhatsAppConfig() {
  try {
    if (fs.existsSync(WHATSAPP_CONFIG_FILE)) {
      const data = fs.readFileSync(WHATSAPP_CONFIG_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading WhatsApp config:', error)
  }
  
  // Return default config
  return {
    phoneNumberId: '',
    wabaId: '',
    accessTokenEnc: '',
    verifyTokenEnc: '',
    appId: '',
    appSecretEnc: '',
    graphVersion: 'v21.0',
    mode: 'sandbox',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Save WhatsApp configuration
function saveWhatsAppConfig(config: any) {
  try {
    ensureDataDirectory()
    const dataToSave = {
      ...config,
      updatedAt: new Date().toISOString()
    }
    fs.writeFileSync(WHATSAPP_CONFIG_FILE, JSON.stringify(dataToSave, null, 2))
    return true
  } catch (error) {
    console.error('Error saving WhatsApp config:', error)
    return false
  }
}

export async function GET() {
  try {
    const config = loadWhatsAppConfig()
    
    // Return config without sensitive data
    const safeConfig = {
      phoneNumberId: config.phoneNumberId,
      wabaId: config.wabaId,
      verifyToken: config.verifyTokenEnc ? '••••••••••' : '',
      appId: config.appId,
      appSecret: config.appSecretEnc ? '••••••••••' : '',
      graphVersion: config.graphVersion,
      mode: config.mode,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    }
    
    return NextResponse.json(safeConfig)
  } catch (error) {
    console.error('Error in GET /api/config/whatsapp:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.phoneNumberId || !body.wabaId || !body.accessToken || !body.verifyToken) {
      return NextResponse.json(
        { error: 'Phone Number ID, WABA ID, Access Token, and Verify Token are required' },
        { status: 400 }
      )
    }

    // Load existing config
    const existingConfig = loadWhatsAppConfig()
    
    // Encrypt sensitive data
    const accessTokenEnc = encryptSecret(body.accessToken)
    const verifyTokenEnc = encryptSecret(body.verifyToken)
    const appSecretEnc = body.appSecret ? encryptSecret(body.appSecret) : ''
    
    // Merge with new data
    const updatedConfig = {
      ...existingConfig,
      phoneNumberId: body.phoneNumberId,
      wabaId: body.wabaId,
      accessTokenEnc,
      verifyTokenEnc,
      appId: body.appId || '',
      appSecretEnc,
      graphVersion: body.graphVersion || 'v21.0',
      mode: body.mode || 'sandbox',
      createdAt: existingConfig.createdAt || new Date().toISOString()
    }

    // Save configuration
    if (saveWhatsAppConfig(updatedConfig)) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp configuration saved successfully',
        config: {
          phoneNumberId: updatedConfig.phoneNumberId,
          wabaId: updatedConfig.wabaId,
          appId: updatedConfig.appId,
          graphVersion: updatedConfig.graphVersion,
          mode: updatedConfig.mode
        }
      })
    } else {
      throw new Error('Failed to save configuration')
    }

  } catch (error) {
    console.error('Error in PUT /api/config/whatsapp:', error)
    return NextResponse.json(
      { error: 'Failed to encrypt secret' },
      { status: 500 }
    )
  }
}

