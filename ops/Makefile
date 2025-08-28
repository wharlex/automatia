.PHONY: help up down build logs migrate ready backup rotate-token

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Levantar el stack completo
	docker compose up -d

down: ## Bajar el stack
	docker compose down

build: ## Reconstruir las imágenes
	docker compose build --no-cache app worker

logs: ## Ver logs de todos los servicios
	docker compose logs -f

logs-app: ## Ver logs solo de la app
	docker compose logs -f app

logs-worker: ## Ver logs solo del worker
	docker compose logs -f worker

logs-nginx: ## Ver logs solo de nginx
	docker compose logs -f nginx

migrate: ## Ejecutar migraciones de la base de datos
	docker compose run --rm app npx prisma migrate deploy

ready: ## Verificar que todo esté listo
	./smoke.sh https://automatia.ar

backup: ## Crear backup de DB y Redis
	./backup.sh

rotate-token: ## Rotar token de WhatsApp (requiere ADMIN_TOKEN y parámetros)
	@if [ -z "$(CHANNEL_ID)" ] || [ -z "$(NEW_TOKEN)" ]; then \
		echo "Uso: make rotate-token CHANNEL_ID=<id> NEW_TOKEN=<token>"; \
		exit 1; \
	fi
	ADMIN_TOKEN=$(ADMIN_TOKEN) bash rotate-wa-token.sh $(CHANNEL_ID) $(NEW_TOKEN)

clean: ## Limpiar volúmenes y contenedores (¡CUIDADO!)
	docker compose down -v
	docker system prune -f

restart: ## Reiniciar todos los servicios
	docker compose restart

status: ## Ver estado de los servicios
	docker compose ps

health: ## Verificar health de la app
	curl -fsS https://automatia.ar/api/healthz | jq .

deploy: ## Deploy completo
	./deploy.sh
