/**
 * Environment validation utility for frontend
 */

// Function to check if environment variables are properly configured
export function validateEnvironment() {
  const envVars = {
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    AUTH_API_BASE_URL: process.env.AUTH_API_BASE_URL,
  };

  const validationResults = {};

  for (const [key, value] of Object.entries(envVars)) {
    validationResults[key] = {
      isSet: value !== undefined && value !== null && value.trim() !== "",
      value: value,
    };
  }

  const allValid = Object.values(validationResults).every(
    (result) => result.isSet
  );

  return {
    allValid,
    validationResults,
  };
}

// Function to check shared secret configuration (informational only, as secrets aren't available on frontend)
export function checkEnvironmentConfig() {
  const authUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  const apiUrl = process.env.AUTH_API_BASE_URL;

  return {
    NEXT_PUBLIC_BETTER_AUTH_URL: authUrl || "not set",
    AUTH_API_BASE_URL: apiUrl || "not set",
    environmentValid: Boolean(authUrl && apiUrl),
  };
}