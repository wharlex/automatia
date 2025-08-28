import { PrismaClient } from '@prisma/client'
import { encryptSecret } from '../lib/crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear negocio de ejemplo
  const business = await prisma.business.upsert({
    where: { id: 'demo-business-001' },
    update: {},
    create: {
      id: 'demo-business-001',
      name: 'Automatía Demo',
      industry: 'Tecnología'
    }
  })

  console.log('✅ Negocio creado:', business.name)

  // Crear configuración de WhatsApp
  const whatsappConfig = await prisma.whatsAppConfig.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      phoneNumberId: 'demo-phone-number-id',
      wabaId: 'demo-waba-id',
      accessTokenEnc: encryptSecret('demo-access-token'),
      verifyTokenEnc: encryptSecret('automatia_verify_token_2024'),
      graphVersion: 'v21.0',
      mode: 'sandbox'
    }
  })

  console.log('✅ Configuración de WhatsApp creada')

  // Crear configuración de IA
  const aiConfig = await prisma.aiConfig.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      openaiKeyEnc: process.env.OPENAI_API_KEY ? encryptSecret(process.env.OPENAI_API_KEY) : null
    }
  })

  console.log('✅ Configuración de IA creada')

  // Crear usuario de ejemplo
  const user = await prisma.user.upsert({
    where: { email: 'demo@automatia.store' },
    update: {},
    create: {
      email: 'demo@automatia.store',
      name: 'Usuario Demo',
      role: 'BUSINESS_OWNER'
    }
  })

  console.log('✅ Usuario demo creado:', user.email)

  // Crear algunos logs de ejemplo
  const sampleLogs = [
    {
      businessId: business.id,
      level: 'INFO',
      message: 'Sistema iniciado correctamente',
      meta: { component: 'system', version: '1.0.0' }
    },
    {
      businessId: business.id,
      level: 'INFO',
      message: 'Webhook de WhatsApp configurado',
      meta: { endpoint: '/api/webhooks/whatsapp', status: 'active' }
    },
    {
      businessId: business.id,
      level: 'INFO',
      message: 'Servicio de IA inicializado',
      meta: { model: 'gpt-4o-mini', provider: 'openai' }
    }
  ]

  for (const logData of sampleLogs) {
    await prisma.botLog.create({
      data: logData
    })
  }

  console.log('✅ Logs de ejemplo creados')

  // Crear memoria de conversación de ejemplo
  const sampleMemory = await prisma.memory.upsert({
    where: { 
      businessId_waId: {
        businessId: business.id,
        waId: 'demo-wa-user-001'
      }
    },
    update: {},
    create: {
      businessId: business.id,
      waId: 'demo-wa-user-001',
      windowJson: [
        { role: 'user', content: 'Hola, ¿cómo estás?' },
        { role: 'assistant', content: '¡Hola! Estoy muy bien, gracias por preguntar. Soy Automatía, tu asistente de IA. ¿En qué puedo ayudarte hoy?' }
      ]
    }
  })

  console.log('✅ Memoria de conversación creada')

  console.log('🎉 Seed completado exitosamente!')
  console.log('📊 Resumen:')
  console.log(`   - Negocio: ${business.name}`)
  console.log(`   - WhatsApp: ${whatsappConfig.mode} mode`)
  console.log(`   - IA: ${aiConfig.openaiKeyEnc ? 'Configurada' : 'No configurada'}`)
  console.log(`   - Usuario: ${user.email}`)
  console.log(`   - Logs: ${sampleLogs.length} entradas`)
  console.log(`   - Memoria: 1 conversación`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




