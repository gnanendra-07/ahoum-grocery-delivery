import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FAVORITES_STORAGE_KEY = 'ahoum_favorite_product_ids';

const loadFavoritesFromStorage = (): string[] => {
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load favorites from storage', err);
    return [];
  }
};

const saveFavoritesToStorage = (ids: string[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save favorites to storage', err);
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: loadFavoritesFromStorage(),

  toggleFavorite: (productId: string) => {
    set((state) => {
      const exists = state.favoriteIds.includes(productId);
      const updated = exists
        ? state.favoriteIds.filter((id) => id !== productId)
        : [...state.favoriteIds, productId];

      saveFavoritesToStorage(updated);
      return { favoriteIds: updated };
    });
  },

  isFavorite: (productId: string) => {
    return get().favoriteIds.includes(productId);
  },

  clearFavorites: () => {
    saveFavoritesToStorage([]);
    set({ favoriteIds: [] });
  },
}));
