import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Voice command types based on FSD plan specifications
export type VoiceCommand = 
  | 'execute'
  | 'dismiss' 
  | 'save'
  | 'next'
  | 'read-next'
  | 'clear-all'
  | 'show-chart'
  | 'mark-read'
  | 'select-all'
  | 'filter'
  | 'help';

export interface VoiceSettings {
  enabled: boolean;
  autoRead: boolean; // Auto-read notifications on arrival
  readingSpeed: number; // 0.5 to 2.0 (normal is 1.0)
  voicePitch: number; // 0.0 to 2.0 (normal is 1.0)
  volume: number; // 0.0 to 1.0
  sensitivity: number; // Voice recognition sensitivity 0.0 to 1.0
  language: string; // Language code (e.g., 'en-US')
  autoPlay: boolean; // Auto-play voice summary in modals
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
}

export interface VoiceCommandMapping {
  command: VoiceCommand;
  phrases: string[]; // Alternative phrases that trigger this command
  description: string; // Help text for users
}

interface VoiceContextType {
  // Voice settings
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  
  // Speech synthesis state
  isPlaying: boolean;
  currentText: string;
  
  // Speech recognition state
  isListening: boolean;
  isSupported: boolean;
  lastRecognizedText: string;
  
  // Voice commands
  commandMappings: VoiceCommandMapping[];
  updateCommandMappings: (mappings: VoiceCommandMapping[]) => void;
  
  // Actions
  speak: (text: string, options?: { interrupt?: boolean; onEnd?: () => void }) => void;
  stopSpeaking: () => void;
  startListening: () => void;
  stopListening: () => void;
  toggleVoice: () => void;
  
  // Command processing
  processVoiceCommand: (text: string) => VoiceCommand | null;
  executeVoiceCommand: (command: VoiceCommand, context?: any) => void;
  
  // Utility
  isQuietTime: () => boolean;
  getVoiceStatus: () => 'available' | 'listening' | 'speaking' | 'disabled' | 'unsupported';
}

const defaultSettings: VoiceSettings = {
  enabled: true,
  autoRead: true,
  readingSpeed: 1.0,
  voicePitch: 1.0,
  volume: 0.8,
  sensitivity: 0.7,
  language: 'en-US',
  autoPlay: true,
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
  },
};

const defaultCommandMappings: VoiceCommandMapping[] = [
  {
    command: 'execute',
    phrases: ['execute', 'trade', 'buy', 'go', 'do it'],
    description: 'Execute the selected trade or notification',
  },
  {
    command: 'dismiss',
    phrases: ['dismiss', 'close', 'cancel', 'skip', 'ignore'],
    description: 'Dismiss the current notification or modal',
  },
  {
    command: 'save',
    phrases: ['save', 'bookmark', 'watch', 'later'],
    description: 'Save notification to watchlist for later review',
  },
  {
    command: 'next',
    phrases: ['next', 'continue', 'move on'],
    description: 'Move to the next notification',
  },
  {
    command: 'read-next',
    phrases: ['read next', 'next notification', 'what\'s next'],
    description: 'Read the next notification aloud',
  },
  {
    command: 'clear-all',
    phrases: ['clear all', 'dismiss all', 'clear everything'],
    description: 'Clear all notifications',
  },
  {
    command: 'show-chart',
    phrases: ['show chart', 'chart', 'graph', 'analysis'],
    description: 'Show detailed chart analysis',
  },
  {
    command: 'mark-read',
    phrases: ['mark read', 'mark as read', 'read'],
    description: 'Mark notifications as read',
  },
  {
    command: 'select-all',
    phrases: ['select all', 'choose all', 'all'],
    description: 'Select all visible notifications',
  },
  {
    command: 'filter',
    phrases: ['filter', 'search', 'find'],
    description: 'Open filter options',
  },
  {
    command: 'help',
    phrases: ['help', 'commands', 'what can I say'],
    description: 'Show available voice commands',
  },
];

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>(defaultSettings);
  const [commandMappings, setCommandMappings] = useState<VoiceCommandMapping[]>(defaultCommandMappings);
  
  // Speech synthesis state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [lastRecognizedText, setLastRecognizedText] = useState('');
  
  // Web Speech API support detection
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechSynthesis' in window || 'webkitSpeechSynthesis' in window) &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Speech synthesis instance
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  // Initialize Web Speech API on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && isSupported) {
      setSpeechSynthesis(window.speechSynthesis || (window as any).webkitSpeechSynthesis);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = settings.language;
        setSpeechRecognition(recognition);
      }
    }
  }, [isSupported, settings.language]);

  // Load persisted settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('fsd_voice_settings');
    const savedMappings = localStorage.getItem('fsd_voice_commands');

    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Failed to load voice settings:', error);
      }
    }

    if (savedMappings) {
      try {
        setCommandMappings(JSON.parse(savedMappings));
      } catch (error) {
        console.error('Failed to load voice command mappings:', error);
        setCommandMappings(defaultCommandMappings);
      }
    }
  }, []);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('fsd_voice_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist command mappings to localStorage
  useEffect(() => {
    localStorage.setItem('fsd_voice_commands', JSON.stringify(commandMappings));
  }, [commandMappings]);

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateCommandMappings = (mappings: VoiceCommandMapping[]) => {
    setCommandMappings(mappings);
  };

  const isQuietTime = useCallback((): boolean => {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = settings.quietHours.startTime;
    const end = settings.quietHours.endTime;
    
    if (start <= end) {
      // Same day range (e.g., 09:00 to 17:00)
      return currentTime >= start && currentTime <= end;
    } else {
      // Overnight range (e.g., 22:00 to 07:00)
      return currentTime >= start || currentTime <= end;
    }
  }, [settings.quietHours]);

  const speak = useCallback((text: string, options?: { interrupt?: boolean; onEnd?: () => void }) => {
    if (!speechSynthesis || !settings.enabled || isQuietTime()) return;

    if (options?.interrupt && isPlaying) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.readingSpeed;
    utterance.pitch = settings.voicePitch;
    utterance.volume = settings.volume;
    utterance.lang = settings.language;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentText('');
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setCurrentText('');
    };

    speechSynthesis.speak(utterance);
  }, [speechSynthesis, settings, isPlaying, isQuietTime]);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentText('');
    }
  }, [speechSynthesis]);

  const startListening = useCallback(() => {
    if (!speechRecognition || !settings.enabled || isListening) return;

    try {
      speechRecognition.start();
      setIsListening(true);

      speechRecognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setLastRecognizedText(result);
        
        const command = processVoiceCommand(result);
        if (command) {
          executeVoiceCommand(command);
        }
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  }, [speechRecognition, settings.enabled, isListening]);

  const stopListening = useCallback(() => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
      setIsListening(false);
    }
  }, [speechRecognition, isListening]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const processVoiceCommand = useCallback((text: string): VoiceCommand | null => {
    const normalizedText = text.toLowerCase().trim();
    
    for (const mapping of commandMappings) {
      for (const phrase of mapping.phrases) {
        if (normalizedText.includes(phrase.toLowerCase())) {
          return mapping.command;
        }
      }
    }
    
    return null;
  }, [commandMappings]);

  const executeVoiceCommand = useCallback((command: VoiceCommand, context?: any) => {
    console.log('Executing voice command:', command, context);
    
    // Dispatch custom event for voice commands that other components can listen to
    const event = new CustomEvent('voiceCommand', { 
      detail: { command, context } 
    });
    window.dispatchEvent(event);

    // Provide audio feedback for command recognition
    if (settings.enabled && !isQuietTime()) {
      const feedbackText = getCommandFeedback(command);
      if (feedbackText) {
        speak(feedbackText, { interrupt: false });
      }
    }
  }, [settings.enabled, isQuietTime, speak]);

  const getCommandFeedback = (command: VoiceCommand): string => {
    switch (command) {
      case 'execute': return 'Executing';
      case 'dismiss': return 'Dismissed';
      case 'save': return 'Saved';
      case 'next': return 'Next';
      case 'mark-read': return 'Marked as read';
      case 'select-all': return 'All selected';
      default: return '';
    }
  };

  const getVoiceStatus = useCallback((): 'available' | 'listening' | 'speaking' | 'disabled' | 'unsupported' => {
    if (!isSupported) return 'unsupported';
    if (!settings.enabled) return 'disabled';
    if (isListening) return 'listening';
    if (isPlaying) return 'speaking';
    return 'available';
  }, [isSupported, settings.enabled, isListening, isPlaying]);

  const contextValue: VoiceContextType = {
    // Settings
    settings,
    updateSettings,
    
    // Speech synthesis state
    isPlaying,
    currentText,
    
    // Speech recognition state
    isListening,
    isSupported,
    lastRecognizedText,
    
    // Voice commands
    commandMappings,
    updateCommandMappings,
    
    // Actions
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleVoice,
    
    // Command processing
    processVoiceCommand,
    executeVoiceCommand,
    
    // Utility
    isQuietTime,
    getVoiceStatus,
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};