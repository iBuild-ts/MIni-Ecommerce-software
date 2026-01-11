import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isSubscribed: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => void;
  updateProfile: (updates: Partial<User>) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set({
          user: newUser,
          isAuthenticated: true,
        });
        return newUser;
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      // Check if user is authenticated from localStorage token
      checkAuth: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const userData = JSON.parse(userStr);
            set({
              user: {
                id: userData.id,
                name: userData.name || '',
                email: userData.email,
                isSubscribed: false,
              },
              isAuthenticated: true,
            });
          } catch (e) {
            // Invalid user data, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // After rehydration, also check localStorage for token
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);
