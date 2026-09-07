import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.register(userData);
      set({ isLoading: false });
      return user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    if (!localStorage.getItem('access_token')) return;
    try {
      const user = await authApi.getMe();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authApi.updateMe(profileData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  }
}));
