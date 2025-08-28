#!/bin/bash

# Script de despliegue para Automatía Chatbot
# Uso: ./scripts/deploy.sh [production|staging]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar argumentos
ENVIRONMENT=${1:-staging}
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    error "Ambiente debe ser 'production' o 'staging'"
    exit 1
fi

log "🚀 Iniciando despliegue en ambiente: $ENVIRONMENT"

# Variables de configuración
if [[ "$ENVIRONMENT" == "production" ]]; then
    SERVER_HOST="automatia.store"
    SERVER_USER="automatia"
    SERVER_PATH="/var/www/automatia-chatbot"
    BRANCH="main"
else
    SERVER_HOST="staging.automatia.store"
    SERVER_USER="automatia"
    SERVER_PATH="/var/www/automatia-chatbot-staging"
    BRANCH="develop"
fi

# Verificar que estamos en el branch correcto
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
    warning "Estás en el branch '$CURRENT_BRANCH', pero el despliegue es para '$BRANCH'"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Despliegue cancelado"
        exit 1
    fi
fi

# Verificar que no hay cambios sin commitear
if [[ -n $(git status --porcelain) ]]; then
    error "Hay cambios sin commitear. Por favor, haz commit o stash antes de desplegar."
    git status --short
    exit 1
fi

# Verificar que estamos actualizados con el remote
git fetch origin
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/$BRANCH)

if [[ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]]; then
    warning "Tu branch local no está actualizado con origin/$BRANCH"
    read -p "¿Hacer pull antes de desplegar? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        log "Haciendo pull..."
        git pull origin $BRANCH
    fi
fi

# Build local
log "🔨 Construyendo aplicación..."
npm run build

if [[ $? -ne 0 ]]; then
    error "Build falló. Abortando despliegue."
    exit 1
fi

success "Build completado exitosamente"

# Crear archivo de versión
VERSION=$(git rev-parse --short HEAD)
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"version\":\"$VERSION\",\"buildDate\":\"$BUILD_DATE\",\"environment\":\"$ENVIRONMENT\"}" > .next/version.json

# Crear tarball
log "📦 Creando tarball..."
tar -czf "deploy-$ENVIRONMENT-$VERSION.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=logs \
    --exclude=*.log \
    .

success "Tarball creado: deploy-$ENVIRONMENT-$VERSION.tar.gz"

# Desplegar al servidor
log "🚀 Desplegando a $SERVER_HOST..."

# Crear directorio temporal en el servidor
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH/temp"

# Copiar archivos
scp "deploy-$ENVIRONMENT-$VERSION.tar.gz" $SERVER_USER@$SERVER_HOST:$SERVER_PATH/temp/

# Ejecutar despliegue en el servidor
ssh $SERVER_USER@$SERVER_HOST << EOF
    cd $SERVER_PATH
    
    # Backup del directorio actual
    if [ -d "current" ]; then
        log "💾 Creando backup..."
        cp -r current "backup-\$(date +%Y%m%d-%H%M%S)"
    fi
    
    # Extraer nuevo código
    log "📂 Extrayendo código..."
    cd temp
    tar -xzf "deploy-$ENVIRONMENT-$VERSION.tar.gz"
    
    # Mover a directorio actual
    cd ..
    rm -rf current
    mv temp/* current/
    rmdir temp
    
    # Instalar dependencias
    log "📦 Instalando dependencias..."
    cd current
    npm ci --only=production
    
    # Generar cliente Prisma
    log "🗄️ Generando cliente Prisma..."
    npx prisma generate
    
    # Ejecutar migraciones si es necesario
    if [ "$ENVIRONMENT" = "production" ]; then
        log "🔄 Ejecutando migraciones..."
        npx prisma db push
    fi
    
    # Configurar permisos
    chown -R $SERVER_USER:$SERVER_USER .
    chmod -R 755 .
    
    # Reiniciar servicios
    log "🔄 Reiniciando servicios..."
    if command -v pm2 &> /dev/null; then
        pm2 reload ecosystem.config.js --env $ENVIRONMENT
    else
        # Fallback a systemd
        sudo systemctl restart automatia-chatbot
    fi
    
    # Limpiar backups antiguos (mantener solo los últimos 5)
    cd ..
    ls -t backup-* | tail -n +6 | xargs -r rm -rf
    
    log "✅ Despliegue completado en $SERVER_PATH/current"
EOF

if [[ $? -eq 0 ]]; then
    success "🚀 Despliegue completado exitosamente!"
    
    # Limpiar archivo local
    rm "deploy-$ENVIRONMENT-$VERSION.tar.gz"
    
    # Mostrar información del despliegue
    log "📊 Información del despliegue:"
    log "   - Versión: $VERSION"
    log "   - Ambiente: $ENVIRONMENT"
    log "   - Servidor: $SERVER_HOST"
    log "   - Ruta: $SERVER_PATH/current"
    log "   - Fecha: $BUILD_DATE"
    
    # Verificar salud del servicio
    log "🏥 Verificando salud del servicio..."
    sleep 5
    
    if curl -f "https://$SERVER_HOST/health" > /dev/null 2>&1; then
        success "✅ Servicio respondiendo correctamente"
    else
        warning "⚠️ Servicio no responde inmediatamente (puede estar iniciando)"
    fi
    
else
    error "❌ Despliegue falló"
    exit 1
fi

log "🎉 Despliegue completado!"





