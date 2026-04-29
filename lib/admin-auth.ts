const COOKIE_NAME = "synq_admin";
const COOKIE_VERSION = "v1";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) return null;
  return secret;
}

async function hmacSha256(secret: string, payload: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Buffer.from(new Uint8Array(signature)).toString("base64url");
}

export async function createAdminCookieValue() {
  const secret = getSecret();
  if (!secret) return null;
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${COOKIE_VERSION}.${issuedAt}`;
  const sig = await hmacSha256(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminCookieValue(value: string | undefined | null) {
  if (!value) return false;
  const secret = getSecret();
  if (!secret) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [version, issuedAtRaw, sig] = parts;
  if (version !== COOKIE_VERSION) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - issuedAt > ONE_WEEK_SECONDS) return false;

  const payload = `${version}.${issuedAtRaw}`;
  const expected = await hmacSha256(secret, payload);
  return timingSafeEqualBase64Url(expected, sig);
}

function timingSafeEqualBase64Url(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
