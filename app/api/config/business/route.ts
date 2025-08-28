import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BUSINESS_CONFIG_FILE = path.join(process.cwd(), 'data', 'business-config.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(BUSINESS_CONFIG_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load business configuration
function loadBusinessConfig() {
  try {
    if (fs.existsSync(BUSINESS_CONFIG_FILE)) {
      const data = fs.readFileSync(BUSINESS_CONFIG_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading business config:', error)
  }
  
  // Return default config
  return {
    name: '',
    industry: '',
    description: '',
    hours: '',
    phone: '',
    email: '',
    website: '',
    menuUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Save business configuration
function saveBusinessConfig(config: any) {
  try {
    ensureDataDirectory()
    const dataToSave = {
      ...config,
      updatedAt: new Date().toISOString()
    }
    fs.writeFileSync(BUSINESS_CONFIG_FILE, JSON.stringify(dataToSave, null, 2))
    return true
  } catch (error) {
    console.error('Error saving business config:', error)
    return false
  }
}

export async function GET() {
  try {
    const config = loadBusinessConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error in GET /api/config/business:', error)
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
    if (!body.name || !body.industry) {
      return NextResponse.json(
        { error: 'Name and industry are required' },
        { status: 400 }
      )
    }

    // Load existing config
    const existingConfig = loadBusinessConfig()
    
    // Merge with new data
    const updatedConfig = {
      ...existingConfig,
      ...body,
      createdAt: existingConfig.createdAt || new Date().toISOString()
    }

    // Save configuration
    if (saveBusinessConfig(updatedConfig)) {
      return NextResponse.json({
        success: true,
        message: 'Business configuration saved successfully',
        config: updatedConfig
      })
    } else {
      throw new Error('Failed to save configuration')
    }

  } catch (error) {
    console.error('Error in PUT /api/config/business:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




