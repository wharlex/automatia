import dns from 'node:dns/promises';
import { isIP } from 'node:net';

const PRIVATE = [
  /^10\./,
  /^127\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^::1$/
];

export async function assertSafeUrl(raw: string) {
  const u = new URL(raw);
  
  if (!/^https?:$/.test(u.protocol)) {
    throw new Error('Only http/https protocols allowed');
  }
  
  const host = u.hostname;
  const addrs = isIP(host) ? [host] : (await dns.lookup(host, { all: true })).map(a => a.address);
  
  for (const a of addrs) {
    if (PRIVATE.some(rx => rx.test(a))) {
      throw new Error('Private IP blocked');
    }
  }
  
  const allow = process.env.ALLOWED_HTTP_HOSTS?.split(',').filter(Boolean);
  if (allow && !allow.some(h => host.endsWith(h.trim()))) {
    throw new Error('Host not in allowlist');
  }
}
