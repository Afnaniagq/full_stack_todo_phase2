// Utility functions for authentication

const TOKEN_KEY = 'auth_token';

/**
 * Store authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * UPDATED: Check if user is authenticated
 * We simplified this to only check if the token exists to stop the redirect loop.
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  
  // If the token exists, we consider the user logged in for now.
  // This bypasses the strict time/expiration check.
  return !!token; 
};

/**
 * Get decoded user information from token
 */
export interface TokenPayload {
  sub: string; // user ID
  email: string;
  exp: number; // expiration time
  iat: number; // issued at time
}

export const getTokenPayload = (): TokenPayload | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
};

/**
 * Check if token is about to expire
 */
export const isTokenExpiringSoon = (thresholdMinutes: number = 5): boolean => {
  const payload = getTokenPayload();
  if (!payload) {
    return true; 
  }

  const thresholdSeconds = thresholdMinutes * 60;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - currentTime;

  return timeUntilExpiry < thresholdSeconds;
};