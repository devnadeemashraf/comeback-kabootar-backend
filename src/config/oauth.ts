/**
 * OAuth provider configuration. Stub until Google/Microsoft OAuth is implemented.
 * Add client IDs, secrets, and redirect URIs here when needed.
 */

export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID ?? '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
  },
} as const;
