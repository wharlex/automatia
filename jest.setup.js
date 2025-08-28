// Mock fetch globally
global.fetch = jest.fn()

// Mock crypto for Node.js environment
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto
}

// Mock environment variables
process.env.ENCRYPTION_KEY = 'dGVzdC1lbmNyeXB0aW9uLWtleS1mb3ItdGVzdGluZy1wdXJwb3Nlcy1vbmx5'
process.env.OPENAI_API_KEY = 'test-openai-api-key'
process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token'
process.env.WHATSAPP_APP_SECRET = 'test-app-secret'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}





