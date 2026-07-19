import { env } from '@/lib/env';

const AUTH_BASE_URL = env.VITE_AUTH_SERVICE_URL;

async function apiFetch(path: string, options: RequestInit = {}, timeoutMs = 10000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${AUTH_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message ?? 'An error occurred. Please try again.');
    }

    return body.data;
  }
  catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
  finally {
    clearTimeout(timer);
  }
}

export interface LoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  idToken: string;
}

export interface MeResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  register: (email: string, password: string, firstName: string, lastName: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    }),

  confirm: (email: string, confirmationCode: string) =>
    apiFetch('/auth/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, confirmationCode }),
    }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }) as Promise<LoginResponse>,

  refresh: (refreshToken: string, email: string) =>
    apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, email }),
    }) as Promise<RefreshResponse>,

  logout: (accessToken: string) =>
    apiFetch('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  getMe: (accessToken: string) =>
    apiFetch('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }) as Promise<MeResponse>,
};
