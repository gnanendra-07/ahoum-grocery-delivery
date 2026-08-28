import { create } from 'zustand';
import { Address, User } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeAddress: Address | null;
  isSimulatingFailures: boolean;

  // Actions
  loginMockUser: () => void;
  logout: () => void;
  setActiveAddress: (addressId: string) => void;
  toggleSimulateFailures: () => void;
  completeOnboarding: () => void;
}

const mockUser: User = {
  id: 'usr-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 234-5678',
  isOnboarded: true,
  activeAddressId: 'addr-1',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Springfield',
      zipCode: '97477',
      isDefault: true,
    },
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mockUser,
  isAuthenticated: true,
  activeAddress: mockUser.addresses.find((a) => a.id === mockUser.activeAddressId) || mockUser.addresses[0] || null,
  isSimulatingFailures: false,

  loginMockUser: () => {
    set({
      user: mockUser,
      isAuthenticated: true,
      activeAddress: mockUser.addresses[0] || null,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      activeAddress: null,
    });
  },

  setActiveAddress: (addressId: string) => {
    const user = get().user;
    if (!user) return;
    const targetAddr = user.addresses.find((a) => a.id === addressId) || null;
    if (targetAddr) {
      set({
        activeAddress: targetAddr,
        user: {
          ...user,
          activeAddressId: addressId,
        },
      });
    }
  },

  toggleSimulateFailures: () => {
    const nextState = !get().isSimulatingFailures;
    mockApi.setSimulateFailures(nextState, 0.3); // 30% failure rate when enabled
    set({ isSimulatingFailures: nextState });
  },

  completeOnboarding: () => {
    const user = get().user;
    if (user) {
      set({ user: { ...user, isOnboarded: true } });
    }
  },
}));
