import { create } from 'zustand';
import { authApi } from '@/lib/authApi';
import type { User } from '@/types';

const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_EMAIL_KEY = 'userEmail';

let inFlightRefresh: Promise<string> | null = null;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  _accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  _accessToken: null,

  login: async (email, password) => {
    const tokens = await authApi.login(email, password);
    set({ _accessToken: tokens.accessToken });
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_EMAIL_KEY, email);
    const me = await authApi.getMe(tokens.accessToken);
    set({ user: { id: me.id, email: me.email, firstName: me.firstName, lastName: me.lastName } });
  },

  logout: async () => {
    const { _accessToken } = get();
    if (_accessToken) {
      try {
        await authApi.logout(_accessToken);
      }
      catch {
        // proceed with local logout even if server call fails
      }
    }
    set({ _accessToken: null, user: null });
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  },

  signup: async (email, password, firstName, lastName) => {
    await authApi.register(email, password, firstName, lastName);
  },

  confirmSignUp: async (email, code) => {
    await authApi.confirm(email, code);
  },

  restoreSession: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const email = localStorage.getItem(USER_EMAIL_KEY);

    if (!refreshToken || !email) {
      set({ isLoading: false });
      return;
    }

    try {
      const tokens = await authApi.refresh(refreshToken, email);
      set({ _accessToken: tokens.accessToken });
      const me = await authApi.getMe(tokens.accessToken);
      set({ user: { id: me.id, email: me.email, firstName: me.firstName, lastName: me.lastName } });
    }
    catch {
      set({ user: null, _accessToken: null });
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
    }
    finally {
      set({ isLoading: false });
    }
  },

  fetchWithAuth: async (url, options = {}) => {
    const { _accessToken, logout } = get();

    if (!_accessToken) {
      await logout();
      throw new Error('Not authenticated');
    }

    const makeRequest = (token: string) =>
      fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

    const response = await makeRequest(_accessToken);

    if (response.status !== 401) return response;

    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedEmail = localStorage.getItem(USER_EMAIL_KEY);

    if (!storedRefreshToken || !storedEmail) {
      await logout();
      throw new Error('Session expired. Please log in again.');
    }

    try {
      if (!inFlightRefresh) {
        inFlightRefresh = authApi.refresh(storedRefreshToken, storedEmail)
          .then((newTokens) => {
            set({ _accessToken: newTokens.accessToken });
            return newTokens.accessToken;
          })
          .finally(() => {
            inFlightRefresh = null;
          });
      }
      const accessToken = await inFlightRefresh;
      return makeRequest(accessToken);
    }
    catch {
      await logout();
      throw new Error('Session expired. Please log in again.');
    }
  },
}));
