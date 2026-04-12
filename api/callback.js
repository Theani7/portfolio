import { hasValidAdminSession, parseCookies } from "./_lib/adminSession.js";

const htmlEscape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const callbackPage = ({ status, payload, allowedOrigin }) => {
  const serialized = JSON.stringify(payload);
  const message = `authorization:github:${status}:${serialized}`;

  return `<!doctype html>
<html>
  <body>
    <script>
      (function() {
        var authMessage = ${JSON.stringify(message)};
        var allowedOrigin = ${JSON.stringify(allowedOrigin)};

        function postResult(targetOrigin) {
          if (!window.opener) return;
          try {
            window.opener.postMessage(authMessage, targetOrigin);
          } catch (_) {}
        }

        function receiveMessage(event) {
          if (event.data === "authorizing:github" && event.origin === allowedOrigin) {
            postResult(allowedOrigin);
          }
        }
        window.addEventListener("message", receiveMessage, false);

        if (window.opener) {
          window.opener.postMessage("authorizing:github", allowedOrigin);
          setTimeout(function() { postResult(allowedOrigin); }, 120);
          setTimeout(function() { postResult(allowedOrigin); }, 500);
        }
      })();
    </script>
    <p>${htmlEscape(status === "success" ? "Authorization complete. You can close this tab." : payload.error || "Authorization failed.")}</p>
  </body>
</html>`;
};

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

  const baseUrl = getBaseUrl(req);

  if (!hasValidAdminSession(req)) {
    return res.status(401).send(
      callbackPage({
        status: "error",
        payload: { error: "Admin session required." },
        allowedOrigin: baseUrl,
      })
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).send(
      callbackPage({
        status: "error",
        payload: { error: "Missing GitHub OAuth environment variables." },
        allowedOrigin: baseUrl,
      })
    );
  }

  const state = req.query.state;
  const code = req.query.code;
  const cookies = parseCookies(req.headers.cookie || "");

  res.setHeader(
    "Set-Cookie",
    "decap_oauth_state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure"
  );

  if (!state || !code || !cookies.decap_oauth_state || cookies.decap_oauth_state !== state) {
    return res
      .status(401)
      .send(callbackPage({ status: "error", payload: { error: "Invalid OAuth state." }, allowedOrigin: baseUrl }));
  }

  const redirectUri = process.env.OAUTH_CALLBACK_URL || `${baseUrl}/api/callback`;

  try {
    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        state,
      }),
    });

    const tokenData = await tokenResp.json();
    if (!tokenResp.ok || !tokenData.access_token) {
      const description =
        tokenData.error_description || tokenData.error || "GitHub token exchange failed.";
      return res
        .status(401)
        .send(callbackPage({ status: "error", payload: { error: description }, allowedOrigin: baseUrl }));
    }

    return res
      .status(200)
      .send(callbackPage({ status: "success", payload: { token: tokenData.access_token }, allowedOrigin: baseUrl }));
  } catch {
    return res
      .status(500)
      .send(callbackPage({ status: "error", payload: { error: "OAuth request failed." }, allowedOrigin: baseUrl }));
  }
}
