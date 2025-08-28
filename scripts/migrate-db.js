#!/usr/bin/env node

/**
 * Script de migración de base de datos para Automatía ChatBot
 * Ejecuta las migraciones de Prisma y genera el cliente
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migración de base de datos para Automatía ChatBot...\n');

// Verificar que estamos en el directorio correcto
if (!fs.existsSync('prisma/schema.prisma')) {
  console.error('❌ Error: No se encontró el archivo schema.prisma');
  console.error('   Asegúrate de ejecutar este script desde la raíz del proyecto');
  process.exit(1);
}

// Verificar que existe .env.local
if (!fs.existsSync('.env.local')) {
  console.error('❌ Error: No se encontró el archivo .env.local');
  console.error('   Crea este archivo con las variables de entorno necesarias');
  process.exit(1);
}

try {
  // Paso 1: Generar el cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado exitosamente\n');

  // Paso 2: Ejecutar migraciones
  console.log('🔄 Ejecutando migraciones de la base de datos...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Migraciones ejecutadas exitosamente\n');

  // Paso 3: Verificar el estado de la base de datos
  console.log('🔍 Verificando estado de la base de datos...');
  execSync('npx prisma db pull', { stdio: 'inherit' });
  console.log('✅ Estado de la base de datos verificado\n');

  // Paso 4: Generar el cliente nuevamente (por si acaso)
  console.log('📦 Regenerando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente regenerado exitosamente\n');

  console.log('🎉 ¡Migración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Configura tus proveedores LLM en /dashboard/chatbot/configurar');
  console.log('   2. Conecta tus canales (WhatsApp, Telegram, Webchat)');
  console.log('   3. Crea flujos de conversación');
  console.log('   4. Activa tu bot');
  console.log('\n🚀 ¡Tu ChatBot está listo para funcionar!');

} catch (error) {
  console.error('\n❌ Error durante la migración:', error.message);
  console.error('\n🔧 Soluciones comunes:');
  console.error('   - Verifica que PostgreSQL esté ejecutándose');
  console.error('   - Confirma que DATABASE_URL en .env.local sea correcta');
  console.error('   - Asegúrate de tener permisos en la base de datos');
  console.error('   - Revisa que todas las dependencias estén instaladas');
  process.exit(1);
}

