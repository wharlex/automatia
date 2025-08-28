import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(process.env.MASTER_KEY || '').digest();

export const seal = (plain: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
};

export const open = (b64: string): string => {
  const raw = Buffer.from(b64, 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const data = raw.subarray(28);
  const dec = crypto.createDecipheriv(ALGO, KEY, iv);
  dec.setAuthTag(tag);
  return Buffer.concat([dec.update(data), dec.final()]).toString('utf8');
};

// Legacy compatibility
export class CryptoService {
  private masterKey: Buffer;

  constructor() {
    const masterKey = process.env.MASTER_KEY;
    if (!masterKey) {
      throw new Error('MASTER_KEY environment variable is required');
    }
    this.masterKey = Buffer.from(masterKey, 'hex');
    if (this.masterKey.length !== 32) {
      throw new Error('MASTER_KEY must be 32 bytes (64 hex characters)');
    }
  }

  encrypt(text: string): string {
    return seal(text);
  }

  decrypt(encryptedText: string): string {
    return open(encryptedText);
  }

  static generateMasterKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static validateMasterKey(key: string): boolean {
    return /^[0-9a-f]{64}$/i.test(key);
  }
}

export const cryptoService = new CryptoService();

// Función de compatibilidad para encryptSecret
export const encryptSecret = (secret: string): string => {
  return seal(secret);
};

// Función para verificar firma de Meta (WhatsApp)
export const verifyMetaSignature = (body: string, signature: string, appSecret: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature.replace('sha256=', ''), 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying Meta signature:', error);
    return false;
  }
};

