import { create } from 'zustand';
import { Address, User } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeAddress: Address | null;
  isSimulatingFailures: boolean;
  tempPhone: string;
  hasCompletedOnboarding: boolean;

  // Actions
  loginMockUser: () => void;
  loginWithCredentials: (email: string, name?: string) => void;
  signUpUser: (name: string, email: string, phone: string) => void;
  setTempPhone: (phone: string) => void;
  verifyOtpAndLogin: (otp: string) => boolean;
  setActiveAddress: (addressId: string) => void;
  setCustomLocation: (label: string, street: string, city: string, zipCode: string) => void;
  logout: () => void;
  toggleSimulateFailures: () => void;
  completeOnboarding: () => void;
}

const AUTH_STORAGE_KEY = 'ahoum_auth_session';

const defaultAddress: Address = {
  id: 'addr-1',
  label: 'Home',
  street: '742 Evergreen Terrace',
  apartment: 'Apt 4B',
  city: 'Springfield',
  zipCode: '97477',
  isDefault: true,
};

const mockUser: User = {
  id: 'usr-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  isOnboarded: true,
  activeAddressId: 'addr-1',
  addresses: [
    defaultAddress,
    {
      id: 'addr-2',
      label: 'Work',
      street: '100 Innovation Way',
      apartment: 'Floor 3',
      city: 'Springfield',
      zipCode: '97478',
      isDefault: false,
    },
  ],
};

const loadSessionFromStorage = (): {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  activeAddress: Address | null;
} => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return {
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
        activeAddress: null,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      isAuthenticated: Boolean(parsed.isAuthenticated),
      hasCompletedOnboarding: Boolean(parsed.hasCompletedOnboarding),
      activeAddress: parsed.activeAddress || null,
    };
  } catch (err) {
    console.error('[AuthStore] Failed to load session from storage:', err);
    return {
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      activeAddress: null,
    };
  }
};

const saveSessionToStorage = (data: {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  activeAddress: Address | null;
}) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[AuthStore] Failed to save session to storage:', err);
  }
};

const initialSession = loadSessionFromStorage();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession.user,
  isAuthenticated: initialSession.isAuthenticated,
  activeAddress: initialSession.activeAddress,
  isSimulatingFailures: false,
  tempPhone: '',
  hasCompletedOnboarding: initialSession.hasCompletedOnboarding,

  loginMockUser: () => {
    const session = {
      user: mockUser,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      activeAddress: mockUser.addresses[0] || defaultAddress,
    };
    saveSessionToStorage(session);
    set(session);
  },

  loginWithCredentials: (email: string, name?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0] || 'Grocery Shopper',
      email,
      phone: get().tempPhone || '+1 (555) 019-2834',
      isOnboarded: true,
      activeAddressId: 'addr-1',
      addresses: [defaultAddress],
    };
    const session = {
      user: newUser,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      activeAddress: defaultAddress,
    };
    saveSessionToStorage(session);
    set(session);
  },

  signUpUser: (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      isOnboarded: true,
      activeAddressId: 'addr-1',
      addresses: [defaultAddress],
    };
    const session = {
      user: newUser,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      activeAddress: defaultAddress,
    };
    saveSessionToStorage(session);
    set(session);
  },

  setTempPhone: (phone: string) => {
    set({ tempPhone: phone });
  },

  verifyOtpAndLogin: (otp: string) => {
    if (otp.length === 4) {
      const phone = get().tempPhone || '+1 (555) 987-6543';
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: 'Mobile Member',
        email: 'member@ahoum.com',
        phone,
        isOnboarded: true,
        activeAddressId: 'addr-1',
        addresses: [defaultAddress],
      };
      const session = {
        user: newUser,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        activeAddress: defaultAddress,
      };
      saveSessionToStorage(session);
      set(session);
      return true;
    }
    return false;
  },

  setActiveAddress: (addressId: string) => {
    const user = get().user;
    if (!user) return;
    const targetAddr = user.addresses.find((a) => a.id === addressId) || null;
    if (targetAddr) {
      const session = {
        user: { ...user, activeAddressId: addressId },
        isAuthenticated: get().isAuthenticated,
        hasCompletedOnboarding: get().hasCompletedOnboarding,
        activeAddress: targetAddr,
      };
      saveSessionToStorage(session);
      set(session);
    }
  },

  setCustomLocation: (label: string, street: string, city: string, zipCode: string) => {
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label,
      street,
      city,
      zipCode,
      isDefault: true,
    };
    const currentUser = get().user;
    const updatedUser: User = currentUser
      ? {
          ...currentUser,
          activeAddressId: newAddr.id,
          addresses: [newAddr, ...currentUser.addresses],
        }
      : {
          id: `usr-${Date.now()}`,
          name: 'Grocery Member',
          email: 'member@ahoum.com',
          phone: '+1 (555) 000-1111',
          isOnboarded: true,
          activeAddressId: newAddr.id,
          addresses: [newAddr],
        };

    const session = {
      user: updatedUser,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      activeAddress: newAddr,
    };
    saveSessionToStorage(session);
    set(session);
  },

  logout: () => {
    const session = {
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: get().hasCompletedOnboarding,
      activeAddress: null,
    };
    saveSessionToStorage(session);
    set(session);
  },

  toggleSimulateFailures: () => {
    const nextState = !get().isSimulatingFailures;
    mockApi.setSimulateFailures(nextState, 0.3);
    set({ isSimulatingFailures: nextState });
  },

  completeOnboarding: () => {
    const session = {
      user: get().user,
      isAuthenticated: get().isAuthenticated,
      hasCompletedOnboarding: true,
      activeAddress: get().activeAddress,
    };
    saveSessionToStorage(session);
    set(session);
  },
}));
