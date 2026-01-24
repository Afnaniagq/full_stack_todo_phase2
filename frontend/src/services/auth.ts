// Frontend authentication service
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for authentication
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Store token in localStorage
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Configure axios with auth token
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication functions
export const registerUser = async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post('/auth/register/', userData);
    const loginResponse: LoginResponse = response.data;

    // Save token to localStorage
    setAuthToken(loginResponse.access_token);

    return { data: loginResponse };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return { error: error.response?.data?.detail || 'Registration failed: Invalid input' };
    } else if (error.response?.status === 409) {
      return { error: 'User with this email already exists' };
    } else if (error.response?.status === 500) {
      return { error: 'Registration failed due to server error. Please try again later.' };
    }
    return { error: error.response?.data?.detail || 'Registration failed' };
  }
};

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post('/auth/login/', credentials);
    const loginResponse: LoginResponse = response.data;

    // Save token to localStorage
    setAuthToken(loginResponse.access_token);

    return { data: loginResponse };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return { error: error.response?.data?.detail || 'Invalid email or password' };
    } else if (error.response?.status === 401) {
      return { error: 'Invalid credentials' };
    } else if (error.response?.status === 500) {
      return { error: 'Login failed due to server error. Please try again later.' };
    }
    return { error: error.response?.data?.detail || 'Login failed' };
  }
};

export const logoutUser = () => {
  removeAuthToken();
};

export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.get('/auth/profile/');
    return { data: response.data };
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token might be expired, clear it
      removeAuthToken();
      return { error: 'Session expired. Please log in again.' };
    } else if (error.response?.status === 403) {
      return { error: 'Access denied. Please contact support.' };
    } else if (error.response?.status === 500) {
      return { error: 'Failed to get user profile due to server error. Please try again later.' };
    }
    return { error: error.response?.data?.detail || 'Failed to get user profile' };
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.put('/auth/profile/', userData);
    return { data: response.data };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return { error: error.response?.data?.detail || 'Invalid data provided' };
    } else if (error.response?.status === 401) {
      // Token might be expired, clear it
      removeAuthToken();
      return { error: 'Session expired. Please log in again.' };
    } else if (error.response?.status === 403) {
      return { error: 'Access denied. Cannot update profile.' };
    } else if (error.response?.status === 409) {
      return { error: 'Email already in use by another user' };
    } else if (error.response?.status === 500) {
      return { error: 'Failed to update profile due to server error. Please try again later.' };
    }
    return { error: error.response?.data?.detail || 'Failed to update user profile' };
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  // Simple check: decode token to see if it's expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (e) {
    return false;
  }
};

// Function to refresh token if needed (basic implementation)
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  if (!isAuthenticated()) {
    return false;
  }
  // In a real implementation, you'd call a refresh endpoint here
  // For now, we'll just check if the token is still valid
  return true;
};