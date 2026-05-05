import { setAuthToken } from '../api/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

export const auth = {
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
  },

  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
    }
    return token;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
  },

  saveUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined') return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isLoggedIn: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  login: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthToken(token);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
  },
};