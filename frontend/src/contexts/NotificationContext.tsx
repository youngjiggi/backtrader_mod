import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Notification data structure based on FSD plan specifications
export interface DroneNotification {
  id: string;
  symbol: string;
  strategyName: string;
  strategyVersion: string;
  setupType: string;
  confidence: number;
  timestamp: Date;
  isRead: boolean;
  isSelected: boolean;
  urgency: 'low' | 'medium' | 'high';
  marketCap: 'micro' | 'small' | 'mid' | 'large' | 'mega';
  volume: 'low' | 'normal' | 'high';
  setupRationale: string;
  droneId: string;
  chartData?: any; // Will be populated by chart components
  riskMetrics: {
    stopLoss: number;
    positionSize: number;
    riskReward: number;
  };
  companyInfo: {
    sector: string;
    marketCap: number;
    avgVolume: number;
  };
}

// Filter configuration for notification feed
export interface NotificationFilters {
  confidence: number; // Minimum confidence threshold (0-100)
  symbols: string[]; // Selected symbols filter
  strategies: string[]; // Selected strategy filter
  timeRange: 'hour' | 'today' | 'week' | 'all';
  urgency: ('low' | 'medium' | 'high')[];
  marketCap: ('micro' | 'small' | 'mid' | 'large' | 'mega')[];
  onlyUnread: boolean;
}

// Drone status for fleet management
export interface DroneStatus {
  id: string;
  strategyName: string;
  symbols: string[];
  status: 'running' | 'paused' | 'stopped' | 'error';
  lastScan: Date;
  setupsFoundToday: number;
  scanFrequency: '15m' | '1h' | '4h' | 'daily';
  confidenceThreshold: number;
  notificationPreference: 'immediate' | 'batch' | 'digest';
}

interface NotificationContextType {
  // Notification state
  notifications: DroneNotification[];
  filteredNotifications: DroneNotification[];
  selectedNotifications: string[];
  unreadCount: number;
  
  // Filter state
  filters: NotificationFilters;
  
  // Drone fleet state
  drones: DroneStatus[];
  activeDroneCount: number;
  
  // Actions
  addNotification: (notification: Omit<DroneNotification, 'id' | 'timestamp' | 'isRead' | 'isSelected'>) => void;
  markAsRead: (notificationIds: string[]) => void;
  markAllAsRead: () => void;
  selectNotification: (notificationId: string, selected: boolean) => void;
  selectAllNotifications: (selected: boolean) => void;
  dismissNotifications: (notificationIds: string[]) => void;
  
  // Filter actions
  updateFilters: (newFilters: Partial<NotificationFilters>) => void;
  resetFilters: () => void;
  
  // Drone management
  addDrone: (drone: Omit<DroneStatus, 'id' | 'lastScan' | 'setupsFoundToday'>) => void;
  updateDroneStatus: (droneId: string, status: DroneStatus['status']) => void;
  removeDrone: (droneId: string) => void;
  
  // Bulk operations
  executeSelectedNotifications: () => void;
  saveSelectedNotifications: () => void;
}

const defaultFilters: NotificationFilters = {
  confidence: 70,
  symbols: [],
  strategies: [],
  timeRange: 'today',
  urgency: ['low', 'medium', 'high'],
  marketCap: ['micro', 'small', 'mid', 'large', 'mega'],
  onlyUnread: false,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<DroneNotification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filters, setFilters] = useState<NotificationFilters>(defaultFilters);
  const [drones, setDrones] = useState<DroneStatus[]>([]);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('fsd_notifications');
    const savedFilters = localStorage.getItem('fsd_notification_filters');
    const savedDrones = localStorage.getItem('fsd_drones');

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Failed to load saved notifications:', error);
      }
    }

    if (savedFilters) {
      try {
        setFilters({ ...defaultFilters, ...JSON.parse(savedFilters) });
      } catch (error) {
        console.error('Failed to load saved filters:', error);
      }
    }

    if (savedDrones) {
      try {
        const parsed = JSON.parse(savedDrones);
        const dronesWithDates = parsed.map((d: any) => ({
          ...d,
          lastScan: new Date(d.lastScan),
        }));
        setDrones(dronesWithDates);
      } catch (error) {
        console.error('Failed to load saved drones:', error);
      }
    }
  }, []);

  // Persist notifications to localStorage
  useEffect(() => {
    localStorage.setItem('fsd_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem('fsd_notification_filters', JSON.stringify(filters));
  }, [filters]);

  // Persist drones to localStorage
  useEffect(() => {
    localStorage.setItem('fsd_drones', JSON.stringify(drones));
  }, [drones]);

  // Filter notifications based on current filter settings
  const filteredNotifications = notifications.filter(notification => {
    // Confidence filter
    if (notification.confidence < filters.confidence) return false;

    // Symbol filter
    if (filters.symbols.length > 0 && !filters.symbols.includes(notification.symbol)) return false;

    // Strategy filter
    if (filters.strategies.length > 0 && !filters.strategies.includes(notification.strategyName)) return false;

    // Time range filter
    const now = new Date();
    const notificationDate = notification.timestamp;
    switch (filters.timeRange) {
      case 'hour':
        if (now.getTime() - notificationDate.getTime() > 60 * 60 * 1000) return false;
        break;
      case 'today':
        if (now.toDateString() !== notificationDate.toDateString()) return false;
        break;
      case 'week':
        if (now.getTime() - notificationDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
        break;
      // 'all' requires no filtering
    }

    // Urgency filter
    if (!filters.urgency.includes(notification.urgency)) return false;

    // Market cap filter
    if (!filters.marketCap.includes(notification.marketCap)) return false;

    // Read status filter
    if (filters.onlyUnread && notification.isRead) return false;

    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeDroneCount = drones.filter(d => d.status === 'running').length;

  // Notification actions
  const addNotification = (notificationData: Omit<DroneNotification, 'id' | 'timestamp' | 'isRead' | 'isSelected'>) => {
    const newNotification: DroneNotification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false,
      isSelected: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationIds: string[]) => {
    setNotifications(prev => prev.map(notification => 
      notificationIds.includes(notification.id) 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const selectNotification = (notificationId: string, selected: boolean) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isSelected: selected }
        : notification
    ));

    setSelectedNotifications(prev => 
      selected 
        ? [...prev, notificationId]
        : prev.filter(id => id !== notificationId)
    );
  };

  const selectAllNotifications = (selected: boolean) => {
    const visibleIds = filteredNotifications.map(n => n.id);
    
    setNotifications(prev => prev.map(notification => 
      visibleIds.includes(notification.id)
        ? { ...notification, isSelected: selected }
        : notification
    ));

    setSelectedNotifications(selected ? visibleIds : []);
  };

  const dismissNotifications = (notificationIds: string[]) => {
    setNotifications(prev => prev.filter(notification => !notificationIds.includes(notification.id)));
    setSelectedNotifications(prev => prev.filter(id => !notificationIds.includes(id)));
  };

  // Filter actions
  const updateFilters = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Drone management actions
  const addDrone = (droneData: Omit<DroneStatus, 'id' | 'lastScan' | 'setupsFoundToday'>) => {
    const newDrone: DroneStatus = {
      ...droneData,
      id: `drone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastScan: new Date(),
      setupsFoundToday: 0,
    };

    setDrones(prev => [...prev, newDrone]);
  };

  const updateDroneStatus = (droneId: string, status: DroneStatus['status']) => {
    setDrones(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status, lastScan: status === 'running' ? new Date() : drone.lastScan }
        : drone
    ));
  };

  const removeDrone = (droneId: string) => {
    setDrones(prev => prev.filter(drone => drone.id !== droneId));
  };

  // Bulk operations (mock implementations for frontend)
  const executeSelectedNotifications = () => {
    console.log('Mock execution of notifications:', selectedNotifications);
    // Mark executed notifications as read and deselect
    markAsRead(selectedNotifications);
    setSelectedNotifications([]);
    // In real implementation, this would trigger trading API calls
  };

  const saveSelectedNotifications = () => {
    console.log('Mock save of notifications:', selectedNotifications);
    // Mark saved notifications as read and deselect
    markAsRead(selectedNotifications);
    setSelectedNotifications([]);
    // In real implementation, this would add to watchlist or review queue
  };

  const contextValue: NotificationContextType = {
    // State
    notifications,
    filteredNotifications,
    selectedNotifications,
    unreadCount,
    filters,
    drones,
    activeDroneCount,

    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    selectNotification,
    selectAllNotifications,
    dismissNotifications,
    updateFilters,
    resetFilters,
    addDrone,
    updateDroneStatus,
    removeDrone,
    executeSelectedNotifications,
    saveSelectedNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};