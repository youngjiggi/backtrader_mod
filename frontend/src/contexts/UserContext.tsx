import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TradingPreferences {
  defaultPortfolioSize: number;
  defaultRiskLevel: number;
  preferredTimeframes: string[];
  defaultBenchmark: string;
  autoSaveInterval: number;
  defaultChartType: 'candlestick' | 'line' | 'area';
  showVolume: boolean;
  defaultIndicators: string[];
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  backtestCompletion: boolean;
  portfolioAlerts: boolean;
  marketAlerts: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
}

export interface UserPreferences {
  trading: TradingPreferences;
  notifications: NotificationPreferences;
  display: DisplayPreferences;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  accountType: 'free' | 'pro' | 'enterprise';
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (category: keyof UserPreferences, updates: Partial<UserPreferences[keyof UserPreferences]>) => void;
  signIn: (userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'isAuthenticated'>) => void;
  signOut: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

// Default user preferences
const defaultTradingPreferences: TradingPreferences = {
  defaultPortfolioSize: 100000,
  defaultRiskLevel: 0.02,
  preferredTimeframes: ['1D', '1W'],
  defaultBenchmark: 'SPY',
  autoSaveInterval: 30000, // 30 seconds
  defaultChartType: 'candlestick',
  showVolume: true,
  defaultIndicators: ['SMA_20', 'SMA_50']
};

const defaultNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  backtestCompletion: true,
  portfolioAlerts: true,
  marketAlerts: false,
  systemUpdates: true,
  weeklyReports: false
};

const defaultDisplayPreferences: DisplayPreferences = {
  theme: 'auto',
  fontSize: 'medium',
  compactMode: false,
  showTooltips: true,
  animationsEnabled: true
};

const defaultPreferences: UserPreferences = {
  trading: defaultTradingPreferences,
  notifications: defaultNotificationPreferences,
  display: defaultDisplayPreferences
};

// Mock user for development
const mockUser: User = {
  id: 'user_1',
  email: 'john.doe@example.com',
  displayName: 'John Doe',
  avatar: undefined,
  accountType: 'pro',
  preferences: defaultPreferences,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  isAuthenticated: true
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem('backstreet_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } else {
          // For development, use mock user
          setUser(mockUser);
          localStorage.setItem('backstreet_user', JSON.stringify(mockUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to mock user
        setUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem('backstreet_user', JSON.stringify(user));
    }
  }, [user, isLoading]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedUser = {
        ...prevUser,
        ...updates,
        lastLoginAt: new Date().toISOString()
      };
      
      return updatedUser;
    });
  };

  const updatePreferences = (
    category: keyof UserPreferences, 
    updates: Partial<UserPreferences[keyof UserPreferences]>
  ) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      return {
        ...prevUser,
        preferences: {
          ...prevUser.preferences,
          [category]: {
            ...prevUser.preferences[category],
            ...updates
          }
        },
        lastLoginAt: new Date().toISOString()
      };
    });
  };

  const signIn = (userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'isAuthenticated'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isAuthenticated: true,
      preferences: {
        ...defaultPreferences,
        ...userData.preferences
      }
    };
    
    setUser(newUser);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('backstreet_user');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        updatePreferences,
        signIn,
        signOut,
        isLoading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};