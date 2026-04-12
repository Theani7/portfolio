import crypto from "node:crypto";

const SESSION_COOKIE = "decap_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

export const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const i = cookie.indexOf("=");
        if (i === -1) return [cookie, ""];
        return [cookie.slice(0, i), decodeURIComponent(cookie.slice(i + 1))];
      })
  );

const signValue = (value, secret) =>
  crypto.createHmac("sha256", secret).update(value).digest("hex");

const secureCompare = (a, b) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

export const createSessionCookie = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET");

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = String(expiresAt);
  const signature = signValue(payload, secret);
  const token = `${payload}.${signature}`;

  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax; Secure`;
};

export const clearSessionCookie =
  `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;

export const hasValidAdminSession = (req) => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expected = signValue(expiresAt, secret);
  if (!secureCompare(signature, expected)) return false;

  const expires = Number(expiresAt);
  if (!Number.isFinite(expires)) return false;

  return expires > Math.floor(Date.now() / 1000);
};
