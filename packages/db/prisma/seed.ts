import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create OWNER user
  const owner = await prisma.user.upsert({
    where: { email: 'vr212563@gmail.com' },
    update: {},
    create: {
      email: 'vr212563@gmail.com',
      name: 'Valentín Rodríguez',
      emailVerified: new Date(),
      image: 'https://avatars.githubusercontent.com/u/vr212563'
    }
  })

  console.log('✅ Created OWNER user:', owner.email)

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'demo-workspace' },
    update: {},
    create: {
      id: 'demo-workspace',
      name: 'Workspace Demo',
      description: 'Workspace de demostración para Automatía',
      plan: 'PRO',
      status: 'ACTIVE'
    }
  })

  console.log('✅ Created demo workspace:', workspace.name)

  // Create OWNER membership
  const ownerMembership = await prisma.membership.upsert({
    where: { 
      userId_workspaceId: {
        userId: owner.id,
        workspaceId: workspace.id
      }
    },
    update: {},
    create: {
      userId: owner.id,
      workspaceId: workspace.id,
      role: 'OWNER',
      isApproved: true,
      joinedAt: new Date()
    }
  })

  console.log('✅ Created OWNER membership')

  // Create demo bot
  const bot = await prisma.bot.upsert({
    where: { id: 'demo-bot' },
    update: {},
    create: {
      id: 'demo-bot',
      name: 'Bot Demo',
      description: 'Bot de demostración para Automatía',
      workspaceId: workspace.id,
      provider: 'GPT',
      providerModel: 'gpt-4',
      isBotActivated: false,
      webhookUrl: 'https://automatia.ar/api/webhooks/whatsapp/demo-workspace'
    }
  })

  console.log('✅ Created demo bot:', bot.name)

  // Create initial ConfigBlocks
  const initialBlocks = [
    {
      id: 'prompts-system',
      key: 'prompts.system',
      value: 'Eres un asistente virtual profesional de Automatía, especializado en automatización de WhatsApp y atención al cliente. Responde de manera clara, profesional y útil.',
      status: 'PUBLISHED',
      version: 1,
      editableByClient: false,
      lockedByAdmin: true,
      workspaceId: workspace.id,
      description: 'Prompt del sistema que define el comportamiento del bot'
    },
    {
      id: 'prompts-faq',
      key: 'prompts.faq',
      value: 'Preguntas frecuentes sobre nuestros servicios:\n\n1. ¿Qué es Automatía?\n2. ¿Cómo funciona el chatbot?\n3. ¿Qué planes están disponibles?\n4. ¿Cómo me registro?',
      status: 'DRAFT',
      version: 1,
      editableByClient: true,
      lockedByAdmin: false,
      workspaceId: workspace.id,
      description: 'Preguntas frecuentes y respuestas del bot'
    },
    {
      id: 'datos-menu',
      key: 'datos.menu',
      value: {
        items: [
          { id: 1, name: 'Producto A', price: 100, description: 'Descripción del producto A' },
          { id: 2, name: 'Producto B', price: 200, description: 'Descripción del producto B' },
          { id: 3, name: 'Producto C', price: 150, description: 'Descripción del producto C' }
        ],
        categories: ['Electrónicos', 'Hogar', 'Servicios']
      },
      status: 'PUBLISHED',
      version: 1,
      editableByClient: true,
      lockedByAdmin: false,
      workspaceId: workspace.id,
      description: 'Menú de productos disponibles'
    },
    {
      id: 'flujo-conversacion',
      key: 'flujo.conversacion',
      value: {
        steps: [
          { id: 'saludo', type: 'message', content: '¡Hola! Bienvenido a Automatía' },
          { id: 'identificacion', type: 'input', prompt: '¿En qué puedo ayudarte hoy?' },
          { id: 'consulta', type: 'process', action: 'classify_intent' },
          { id: 'despedida', type: 'message', content: 'Gracias por contactarnos. ¡Que tengas un buen día!' }
        ],
        fallback: 'No entiendo tu consulta. ¿Podrías reformularla?'
      },
      status: 'PUBLISHED',
      version: 1,
      editableByClient: false,
      lockedByAdmin: false,
      workspaceId: workspace.id,
      description: 'Flujo de conversación del bot'
    }
  ]

  for (const blockData of initialBlocks) {
    const block = await prisma.configBlock.upsert({
      where: { id: blockData.id },
      update: {},
      create: blockData
    })
    console.log(`✅ Created ConfigBlock: ${block.key}`)
  }

  // Create demo allowed users
  const allowedUsers = [
    {
      email: 'cliente1@example.com',
      botId: bot.id,
      addedBy: owner.email
    },
    {
      email: 'cliente2@example.com',
      botId: bot.id,
      addedBy: owner.email
    }
  ]

  for (const userData of allowedUsers) {
    const allowedUser = await prisma.allowedUser.upsert({
      where: {
        botId_email: {
          botId: userData.botId,
          email: userData.email
        }
      },
      update: {},
      create: userData
    })
    console.log(`✅ Created AllowedUser: ${allowedUser.email}`)
  }

  // Create demo API keys
  const apiKey = await prisma.apiKey.upsert({
    where: { id: 'demo-api-key' },
    update: {},
    create: {
      id: 'demo-api-key',
      name: 'API Key Demo',
      workspaceId: workspace.id,
      key: 'demo_' + Math.random().toString(36).substring(2, 15),
      permissions: ['READ', 'WRITE'],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }
  })

  console.log('✅ Created demo API key')

  // Create demo datasource
  const datasource = await prisma.datasource.upsert({
    where: { id: 'demo-datasource' },
    update: {},
    create: {
      id: 'demo-datasource',
      name: 'Productos Demo',
      description: 'Base de datos de productos de demostración',
      type: 'CSV',
      workspaceId: workspace.id,
      metadata: {
        columns: ['id', 'name', 'price', 'description'],
        rowCount: 3,
        fileSize: 1024
      },
      status: 'ACTIVE'
    }
  })

  console.log('✅ Created demo datasource')

  // Create demo datasource rows
  const demoRows = [
    { datasourceId: datasource.id, rowNumber: 1, data: { id: 1, name: 'Producto A', price: 100, description: 'Descripción del producto A' } },
    { datasourceId: datasource.id, rowNumber: 2, data: { id: 2, name: 'Producto B', price: 200, description: 'Descripción del producto B' } },
    { datasourceId: datasource.id, rowNumber: 3, data: { id: 3, name: 'Producto C', price: 150, description: 'Descripción del producto C' } }
  ]

  for (const rowData of demoRows) {
    const row = await prisma.datasourceRow.upsert({
      where: {
        datasourceId_rowNumber: {
          datasourceId: rowData.datasourceId,
          rowNumber: rowData.rowNumber
        }
      },
      update: {},
      create: rowData
    })
    console.log(`✅ Created DatasourceRow: ${row.rowNumber}`)
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
