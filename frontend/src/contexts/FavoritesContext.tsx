import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteItem {
  id: string;
  title: string;
  type: 'strategy' | 'report' | 'comparison' | 'portfolio' | 'screen';
  path: string;
  icon?: string;
  metadata?: {
    strategyId?: string;
    symbol?: string;
    timeframe?: string;
    description?: string;
  };
  addedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (path: string) => boolean;
  getFavoriteByPath: (path: string) => FavoriteItem | undefined;
  clearFavorites: () => void;
  reorderFavorites: (fromIndex: number, toIndex: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('backstreet-betas-favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('backstreet-betas-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    // Check if already exists (by path)
    if (favorites.some(fav => fav.path === item.path)) {
      return; // Already favorited
    }

    const newFavorite: FavoriteItem = {
      ...item,
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString()
    };

    setFavorites(prev => [newFavorite, ...prev].slice(0, 20)); // Keep max 20 favorites
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (path: string): boolean => {
    return favorites.some(fav => fav.path === path);
  };

  const getFavoriteByPath = (path: string): FavoriteItem | undefined => {
    return favorites.find(fav => fav.path === path);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const reorderFavorites = (fromIndex: number, toIndex: number) => {
    setFavorites(prev => {
      const newFavorites = [...prev];
      const [removed] = newFavorites.splice(fromIndex, 1);
      newFavorites.splice(toIndex, 0, removed);
      return newFavorites;
    });
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByPath,
    clearFavorites,
    reorderFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};