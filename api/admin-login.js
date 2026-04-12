import crypto from "node:crypto";
import { createSessionCookie } from "./_lib/adminSession.js";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map();

const normalizeSecret = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/^['"]|['"]$/g, "");

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
};

const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

const getAttemptRecord = (ip) => {
  const now = Date.now();
  const existing = attempts.get(ip);

  if (!existing || now > existing.windowStart + WINDOW_MS) {
    const fresh = { windowStart: now, count: 0, lockUntil: 0 };
    attempts.set(ip, fresh);
    return fresh;
  }

  return existing;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  const record = getAttemptRecord(ip);
  const now = Date.now();

  if (record.lockUntil && now < record.lockUntil) {
    const retryAfter = Math.ceil((record.lockUntil - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({ error: "Too many login attempts. Try again later." });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return res.status(500).json({ error: "Missing ADMIN_PASSWORD" });
  }

  const headerPassword = req.headers["x-admin-password"];
  const bodyPassword =
    req.body && typeof req.body === "object" && typeof req.body.password === "string"
      ? req.body.password
      : "";

  const normalizedInput = normalizeSecret(bodyPassword || headerPassword);
  const normalizedExpected = normalizeSecret(expectedPassword);

  if (!normalizedInput || !safeEqual(normalizedInput, normalizedExpected)) {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockUntil = now + LOCK_MS;
    }
    return res.status(401).json({ error: "Invalid password" });
  }

  attempts.delete(ip);

  try {
    const sessionCookie = createSessionCookie();
    res.setHeader("Set-Cookie", sessionCookie);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Session initialization failed" });
  }
}
