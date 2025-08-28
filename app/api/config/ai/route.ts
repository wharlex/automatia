import { NextRequest, NextResponse } from 'next/server'
import { encryptSecret } from '@/lib/crypto'
import fs from 'fs'
import path from 'path'

const AI_CONFIG_FILE = path.join(process.cwd(), 'data', 'ai-config.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(AI_CONFIG_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load AI configuration
function loadAIConfig() {
  try {
    if (fs.existsSync(AI_CONFIG_FILE)) {
      const data = fs.readFileSync(AI_CONFIG_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading AI config:', error)
  }
  
  // Return default config
  return {
    openaiApiKeyEnc: '',
    systemPrompt: 'Eres un asistente virtual profesional y amigable para un negocio. Responde de manera clara, útil y siempre mantén un tono profesional pero cercano.',
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Save AI configuration
function saveAIConfig(config: any) {
  try {
    ensureDataDirectory()
    const dataToSave = {
      ...config,
      updatedAt: new Date().toISOString()
    }
    fs.writeFileSync(AI_CONFIG_FILE, JSON.stringify(dataToSave, null, 2))
    return true
  } catch (error) {
    console.error('Error saving AI config:', error)
    return false
  }
}

export async function GET() {
  try {
    const config = loadAIConfig()
    
    // Return config without sensitive data
    const safeConfig = {
      openaiApiKey: config.openaiApiKeyEnc ? '••••••••••' : '',
      systemPrompt: config.systemPrompt,
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    }
    
    return NextResponse.json(safeConfig)
  } catch (error) {
    console.error('Error in GET /api/config/ai:', error)
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
    if (!body.openaiApiKey || !body.systemPrompt) {
      return NextResponse.json(
        { error: 'OpenAI API Key and System Prompt are required' },
        { status: 400 }
      )
    }

    // Load existing config
    const existingConfig = loadAIConfig()
    
    // Encrypt sensitive data
    const openaiApiKeyEnc = encryptSecret(body.openaiApiKey)
    
    // Merge with new data
    const updatedConfig = {
      ...existingConfig,
      openaiApiKeyEnc,
      systemPrompt: body.systemPrompt,
      model: body.model || 'gpt-4o-mini',
      maxTokens: body.maxTokens || 1000,
      temperature: body.temperature || 0.7,
      createdAt: existingConfig.createdAt || new Date().toISOString()
    }

    // Save configuration
    if (saveAIConfig(updatedConfig)) {
      return NextResponse.json({
        success: true,
        message: 'AI configuration saved successfully',
        config: {
          systemPrompt: updatedConfig.systemPrompt,
          model: updatedConfig.model,
          maxTokens: updatedConfig.maxTokens,
          temperature: updatedConfig.temperature
        }
      })
    } else {
      throw new Error('Failed to save configuration')
    }

  } catch (error) {
    console.error('Error in PUT /api/config/ai:', error)
    return NextResponse.json(
      { error: 'Failed to encrypt secret' },
      { status: 500 }
    )
  }
}

