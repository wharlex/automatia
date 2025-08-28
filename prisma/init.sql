-- Inicialización de la base de datos Automatía Chatbot
-- Este script se ejecuta automáticamente al crear el contenedor PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE automatia_chatbot'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'automatia_chatbot')\gexec

-- Conectar a la base de datos
\c automatia_chatbot;

-- Crear extensiones en la base de datos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear índices adicionales para optimización
CREATE INDEX IF NOT EXISTS idx_bot_logs_business_created ON "BotLog" ("businessId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_memory_business_wa ON "Memory" ("businessId", "waId");

-- Crear vistas útiles para el dashboard
CREATE OR REPLACE VIEW bot_stats AS
SELECT 
    "businessId",
    COUNT(*) as total_messages,
    COUNT(CASE WHEN level = 'INFO' THEN 1 END) as info_count,
    COUNT(CASE WHEN level = 'WARN' THEN 1 END) as warn_count,
    COUNT(CASE WHEN level = 'ERROR' THEN 1 END) as error_count,
    MAX("createdAt") as last_activity
FROM "BotLog"
GROUP BY "businessId";

-- Crear función para limpiar logs antiguos
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM "BotLog" 
    WHERE "createdAt" < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Crear función para obtener estadísticas de memoria
CREATE OR REPLACE FUNCTION get_memory_stats(business_id TEXT)
RETURNS TABLE(
    total_conversations BIGINT,
    avg_messages_per_conversation NUMERIC,
    oldest_conversation TIMESTAMP,
    newest_conversation TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_conversations,
        AVG(jsonb_array_length("windowJson")) as avg_messages_per_conversation,
        MIN("updatedAt") as oldest_conversation,
        MAX("updatedAt") as newest_conversation
    FROM "Memory"
    WHERE "businessId" = business_id;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las tablas que tienen updatedAt
CREATE TRIGGER update_business_updated_at 
    BEFORE UPDATE ON "Business" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_config_updated_at 
    BEFORE UPDATE ON "WhatsAppConfig" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_config_updated_at 
    BEFORE UPDATE ON "AiConfig" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_updated_at 
    BEFORE UPDATE ON "Memory" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo para desarrollo
INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt") 
VALUES (
    'demo-user-001',
    'demo@automatia.store',
    'Usuario Demo',
    'BUSINESS_OWNER',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Business" (id, name, industry, "createdAt", "updatedAt")
VALUES (
    'demo-business-001',
    'Automatía Demo',
    'Tecnología',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Comentarios sobre la estructura
COMMENT ON TABLE "Business" IS 'Negocios que utilizan el chatbot';
COMMENT ON TABLE "WhatsAppConfig" IS 'Configuración de WhatsApp Business API por negocio';
COMMENT ON TABLE "AiConfig" IS 'Configuración de IA por negocio';
COMMENT ON TABLE "Memory" IS 'Memoria de conversación por usuario de WhatsApp';
COMMENT ON TABLE "BotLog" IS 'Logs de actividad del chatbot';
COMMENT ON TABLE "User" IS 'Usuarios del sistema';

COMMENT ON COLUMN "WhatsAppConfig"."accessTokenEnc" IS 'Token de acceso encriptado con AES-256-GCM';
COMMENT ON COLUMN "WhatsAppConfig"."appSecretEnc" IS 'Secreto de la app encriptado con AES-256-GCM';
COMMENT ON COLUMN "WhatsAppConfig"."verifyTokenEnc" IS 'Token de verificación encriptado con AES-256-GCM';
COMMENT ON COLUMN "AiConfig"."openaiKeyEnc" IS 'Clave de OpenAI encriptada con AES-256-GCM';

-- Mostrar resumen de la inicialización
SELECT 'Base de datos Automatía Chatbot inicializada correctamente' as status;





