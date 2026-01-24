// Better Auth configuration for frontend
import { createAuthClient } from "better-auth/react";

// Get the NEXT_PUBLIC_BETTER_AUTH_URL from environment
const NEXT_PUBLIC_BETTER_AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000/api/auth";

export const authClient = createAuthClient({
  baseURL: NEXT_PUBLIC_BETTER_AUTH_URL,
  // Additional configuration options can be added here
});

// Export the URL for validation purposes
export { NEXT_PUBLIC_BETTER_AUTH_URL };

// Helper function to validate JWT token format (client-side only for structure)
export function isValidJwtFormat(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  return parts.length === 3;
}