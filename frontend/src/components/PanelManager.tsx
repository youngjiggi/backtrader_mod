import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PanelState {
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomPanelHeight: number;
  leftPanelVisible: boolean;
  rightPanelVisible: boolean;
  bottomPanelVisible: boolean;
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
  const defaultState: PanelState = {
    leftPanelWidth: 320,
    rightPanelWidth: 320,
    bottomPanelHeight: 300,
    leftPanelVisible: true,
    rightPanelVisible: true,
    bottomPanelVisible: true,
    ...initialState
  };

  const [state, setState] = useState<PanelState>(defaultState);

  const setLeftPanelWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, leftPanelWidth: width }));
  }, []);

  const setRightPanelWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, rightPanelWidth: width }));
  }, []);

  const setBottomPanelHeight = useCallback((height: number) => {
    setState(prev => ({ ...prev, bottomPanelHeight: height }));
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
    toggleBottomPanel
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