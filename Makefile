.PHONY: help verify-dev verify-all smoke build dev clean

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

verify-dev: ## Verificación rápida para desarrollo local
	@echo "🔍 Verificando endpoints de desarrollo..."
	@npx tsx scripts/verify-dev.ts

verify-all: ## Verificación completa (requiere Docker)
	@echo "🔍 Verificación integral del sistema..."
	@cd ops && bash verify-all.sh

smoke: ## Smoke test básico
	@echo "🚬 Smoke test..."
	@cd ops && bash smoke.sh

build: ## Construir la aplicación
	@echo "🏗️ Construyendo..."
	@npm run build

dev: ## Iniciar servidor de desarrollo
	@echo "🚀 Iniciando servidor de desarrollo..."
	@npm run dev

clean: ## Limpiar archivos generados
	@echo "🧹 Limpiando..."
	@rm -rf .next
	@rm -rf node_modules/.cache

test: ## Ejecutar tests
	@echo "🧪 Ejecutando tests..."
	@npm test

lint: ## Ejecutar linter
	@echo "🔍 Ejecutando linter..."
	@npm run lint

format: ## Formatear código
	@echo "✨ Formateando código..."
	@npm run format

install: ## Instalar dependencias
	@echo "📦 Instalando dependencias..."
	@npm install

deploy: ## Deploy a producción (requiere Docker)
	@echo "🚀 Deployando a producción..."
	@cd ops && bash deploy.sh

rollback: ## Rollback a versión anterior
	@echo "⏪ Haciendo rollback..."
	@cd ops && bash rollback.sh

backup: ## Crear backup de la base de datos
	@echo "💾 Creando backup..."
	@cd ops && bash backup.sh

logs: ## Ver logs de los contenedores
	@echo "📋 Mostrando logs..."
	@cd ops && docker compose logs -f

status: ## Estado de los contenedores
	@echo "📊 Estado de los contenedores..."
	@cd ops && docker compose ps

# Comandos de verificación específicos
verify-wa: ## Verificar webhook de WhatsApp
	@echo "📱 Verificando webhook de WhatsApp..."
	@npx tsx scripts/verify-runtime.ts --whatsapp-only

verify-tg: ## Verificar webhook de Telegram
	@echo "📱 Verificando webhook de Telegram..."
	@npx tsx scripts/verify-runtime.ts --telegram-only

verify-wc: ## Verificar webhook de Webchat
	@echo "🌐 Verificando webhook de Webchat..."
	@npx tsx scripts/verify-runtime.ts --webchat-only

check-links: ## Verificar enlaces internos
	@echo "🔗 Verificando enlaces internos..."
	@BASE_URL=http://localhost:3004 npx tsx scripts/check-links.ts
