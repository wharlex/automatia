#!/usr/bin/env node

/**
 * Script de verificación de configuración de Firebase
 * Ejecuta: node scripts/setup-firebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Firebase...\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('📝 Crea el archivo .env.local con la configuración de Firebase\n');
  
  const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCzxEdM4ve2RqCOesUN4nasyGXuHc1Cnsc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=automatia-b2138.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=automatia-b2138
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=automatia-b2138.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=902831495475
NEXT_PUBLIC_FIREBASE_APP_ID=1:902831495475:web:680ef62d6c507f36520646
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-40HTEYL9XZ

# Firebase Admin SDK (para backend)
FIREBASE_PROJECT_ID=automatia-b2138
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@automatia-b2138.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nTu_Clave_Privada_Aquí\\n-----END PRIVATE KEY-----"`;
  
  console.log('📋 Contenido sugerido para .env.local:');
  console.log(envContent);
  console.log('\n');
} else {
  console.log('✅ Archivo .env.local encontrado');
  
  // Leer y verificar contenido
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
  
  if (missingVars.length === 0) {
    console.log('✅ Todas las variables de entorno requeridas están presentes');
  } else {
    console.log('⚠️  Variables de entorno faltantes:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
  }
}

// Verificar dependencias
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const firebaseDeps = ['firebase', 'firebase-admin'];
  
  const missingDeps = firebaseDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ Dependencias de Firebase instaladas');
  } else {
    console.log('❌ Dependencias faltantes:');
    missingDeps.forEach(dep => console.log(`   - ${dep}`));
    console.log('\n💡 Ejecuta: npm install ' + missingDeps.join(' '));
  }
}

// Verificar archivos de configuración
const configFiles = [
  'lib/firebaseConfig.ts',
  'lib/firebaseClient.ts',
  'hooks/useAuth.ts'
];

console.log('\n📁 Verificando archivos de configuración:');
configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - No encontrado`);
  }
});

console.log('\n🎯 Próximos pasos:');
console.log('1. Configura las variables de entorno en .env.local');
console.log('2. Obtén las credenciales de Firebase Admin desde Firebase Console');
console.log('3. Habilita la autenticación con Google en Firebase Console');
console.log('4. Ejecuta: npm run dev');
console.log('5. Prueba el login/registro con Google');

console.log('\n📚 Documentación: FIREBASE_SETUP.md');
console.log('🚀 ¡Listo para usar!');


