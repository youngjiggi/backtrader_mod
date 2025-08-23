import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type PanelLayoutMode = 'separate' | 'combined';
export type LeftPanelContent = 'configuration' | 'dashboard';

export interface DashboardSettings {
  strategyEvolution: boolean;
  sataScore: boolean;
  performanceTrend: boolean;
  rsiSignal: boolean;
  vwapSignal: boolean;
  cvdSignal: boolean;
  movingAverageSignal: boolean;
  recommendations: boolean;
}

interface PanelState {
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomPanelHeight: number;
  leftPanelVisible: boolean;
  rightPanelVisible: boolean;
  bottomPanelVisible: boolean;
  layoutMode: PanelLayoutMode;
  leftPanelContent: LeftPanelContent;
  dashboardSettings: DashboardSettings;
}

interface PanelActions {
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
  setLeftPanelVisible: (visible: boolean) => void;
  setRightPanelVisible: (visible: boolean) => void;
  setBottomPanelVisible: (visible: boolean) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  setLayoutMode: (mode: PanelLayoutMode) => void;
  toggleLayoutMode: () => void;
  setLeftPanelContent: (content: LeftPanelContent) => void;
  toggleLeftPanelContent: () => void;
  setDashboardSettings: (settings: DashboardSettings) => void;
  updateDashboardSetting: (key: keyof DashboardSettings, value: boolean) => void;
}

type PanelContextType = PanelState & PanelActions;

const PanelContext = createContext<PanelContextType | undefined>(undefined);

interface PanelManagerProviderProps {
  children: ReactNode;
  initialState?: Partial<PanelState>;
}

export const PanelManagerProvider: React.FC<PanelManagerProviderProps> = ({ 
  children, 
  initialState = {} 
}) => {
  // Load saved layout mode from localStorage
  const getSavedLayoutMode = (): PanelLayoutMode => {
    try {
      const saved = localStorage.getItem('panelLayoutMode');
      return (saved === 'combined' || saved === 'separate') ? saved : 'combined';
    } catch {
      return 'combined';
    }
  };

  // Load saved left panel content from localStorage
  const getSavedLeftPanelContent = (): LeftPanelContent => {
    try {
      const saved = localStorage.getItem('leftPanelContent');
      return (saved === 'configuration' || saved === 'dashboard') ? saved : 'configuration';
    } catch {
      return 'configuration';
    }
  };

  // Load saved dashboard settings from localStorage
  const getSavedDashboardSettings = (): DashboardSettings => {
    try {
      const saved = localStorage.getItem('dashboardSettings');
      if (saved) {
        return { ...getDefaultDashboardSettings(), ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return getDefaultDashboardSettings();
  };

  // Default dashboard settings - all features enabled
  const getDefaultDashboardSettings = (): DashboardSettings => ({
    strategyEvolution: true,
    sataScore: true,
    performanceTrend: true,
    rsiSignal: true,
    vwapSignal: true,
    cvdSignal: true,
    movingAverageSignal: true,
    recommendations: true,
  });

  // Calculate responsive bottom panel height (half screen with constraints)
  const getResponsiveBottomHeight = () => {
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const halfScreen = Math.floor(screenHeight * 0.5);
    const minHeight = 200;
    const maxHeight = Math.floor(screenHeight * 0.8);
    return Math.max(minHeight, Math.min(maxHeight, halfScreen));
  };

  const defaultState: PanelState = {
    leftPanelWidth: 320,
    rightPanelWidth: 320,
    bottomPanelHeight: getResponsiveBottomHeight(),
    leftPanelVisible: true,
    rightPanelVisible: true,
    bottomPanelVisible: true,
    layoutMode: getSavedLayoutMode(),
    leftPanelContent: getSavedLeftPanelContent(),
    dashboardSettings: getSavedDashboardSettings(),
    ...initialState
  };

  const [state, setState] = useState<PanelState>(defaultState);

  // Handle window resize to update bottom panel height responsively
  useEffect(() => {
    const handleResize = () => {
      const newBottomHeight = getResponsiveBottomHeight();
      setState(prev => ({ ...prev, bottomPanelHeight: newBottomHeight }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Save layout mode to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('panelLayoutMode', state.layoutMode);
    } catch {
      // Ignore localStorage errors
    }
  }, [state.layoutMode]);

  // Save dashboard settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('dashboardSettings', JSON.stringify(state.dashboardSettings));
    } catch {
      // Ignore localStorage errors
    }
  }, [state.dashboardSettings]);

  const setLeftPanelWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, leftPanelWidth: width }));
  }, []);

  const setRightPanelWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, rightPanelWidth: width }));
  }, []);

  const setBottomPanelHeight = useCallback((height: number) => {
    // Apply same constraints when manually resizing
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const minHeight = 200;
    const maxHeight = Math.floor(screenHeight * 0.8);
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    setState(prev => ({ ...prev, bottomPanelHeight: constrainedHeight }));
  }, []);

  const setLeftPanelVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, leftPanelVisible: visible }));
  }, []);

  const setRightPanelVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, rightPanelVisible: visible }));
  }, []);

  const setBottomPanelVisible = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, bottomPanelVisible: visible }));
  }, []);

  const toggleLeftPanel = useCallback(() => {
    setState(prev => ({ ...prev, leftPanelVisible: !prev.leftPanelVisible }));
  }, []);

  const toggleRightPanel = useCallback(() => {
    setState(prev => ({ ...prev, rightPanelVisible: !prev.rightPanelVisible }));
  }, []);

  const toggleBottomPanel = useCallback(() => {
    setState(prev => ({ ...prev, bottomPanelVisible: !prev.bottomPanelVisible }));
  }, []);

  const setLayoutMode = useCallback((mode: PanelLayoutMode) => {
    setState(prev => {
      const newState = { ...prev, layoutMode: mode };
      
      // Adjust panel widths and visibility based on layout mode
      if (mode === 'combined') {
        // In combined mode: expand left panel, hide right panel
        newState.leftPanelWidth = 480;
        newState.rightPanelVisible = false;
      } else {
        // In separate mode: restore original widths, show right panel
        newState.leftPanelWidth = 320;
        newState.rightPanelVisible = true;
      }
      
      return newState;
    });
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setState(prev => {
      const newMode = prev.layoutMode === 'separate' ? 'combined' : 'separate';
      const newState = { ...prev, layoutMode: newMode };
      
      // Adjust panel widths and visibility based on layout mode
      if (newMode === 'combined') {
        newState.leftPanelWidth = 480;
        newState.rightPanelVisible = false;
      } else {
        newState.leftPanelWidth = 320;
        newState.rightPanelVisible = true;
      }
      
      return newState;
    });
  }, []);

  const setLeftPanelContent = useCallback((content: LeftPanelContent) => {
    setState(prev => ({ ...prev, leftPanelContent: content }));
    try {
      localStorage.setItem('leftPanelContent', content);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleLeftPanelContent = useCallback(() => {
    setState(prev => {
      const newContent = prev.leftPanelContent === 'configuration' ? 'dashboard' : 'configuration';
      try {
        localStorage.setItem('leftPanelContent', newContent);
      } catch {
        // Ignore localStorage errors
      }
      return { ...prev, leftPanelContent: newContent };
    });
  }, []);

  const setDashboardSettings = useCallback((settings: DashboardSettings) => {
    setState(prev => ({ ...prev, dashboardSettings: settings }));
  }, []);

  const updateDashboardSetting = useCallback((key: keyof DashboardSettings, value: boolean) => {
    setState(prev => ({
      ...prev,
      dashboardSettings: {
        ...prev.dashboardSettings,
        [key]: value
      }
    }));
  }, []);

  const contextValue: PanelContextType = {
    ...state,
    setLeftPanelWidth,
    setRightPanelWidth,
    setBottomPanelHeight,
    setLeftPanelVisible,
    setRightPanelVisible,
    setBottomPanelVisible,
    toggleLeftPanel,
    toggleRightPanel,
    toggleBottomPanel,
    setLayoutMode,
    toggleLayoutMode,
    setLeftPanelContent,
    toggleLeftPanelContent,
    setDashboardSettings,
    updateDashboardSetting
  };

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelManager = (): PanelContextType => {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanelManager must be used within a PanelManagerProvider');
  }
  return context;
};