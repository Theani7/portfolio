import crypto from "node:crypto";
import { hasValidAdminSession } from "./_lib/adminSession.js";

const TEN_MINUTES = 60 * 10;

const getBaseUrl = (req) => {
  if (process.env.OAUTH_BASE_URL) return process.env.OAUTH_BASE_URL;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}`;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasValidAdminSession(req)) {
    return res.status(401).json({ error: "Admin session required" });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "Missing GITHUB_CLIENT_ID" });
  }

  const state = crypto.randomBytes(24).toString("hex");
  const scope = process.env.GITHUB_OAUTH_SCOPE || "repo";
  const baseUrl = getBaseUrl(req);
  const callbackUrl = process.env.OAUTH_CALLBACK_URL || `${baseUrl}/api/callback`;

  res.setHeader(
    "Set-Cookie",
    `decap_oauth_state=${state}; Path=/; HttpOnly; Max-Age=${TEN_MINUTES}; SameSite=Lax; Secure`
  );

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", callbackUrl);
  githubAuthUrl.searchParams.set("scope", scope);
  githubAuthUrl.searchParams.set("state", state);

  return res.redirect(githubAuthUrl.toString());
}
