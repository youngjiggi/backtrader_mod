import React, { useEffect, useRef } from 'react';
import { useVoice } from '../contexts/VoiceContext';

interface VoiceControllerProps {
  onCommand?: (command: string) => void;
  children?: React.ReactNode;
}

/**
 * VoiceController - Web Speech API wrapper component
 * Provides voice recognition and synthesis for FSD interface
 */
const VoiceController: React.FC<VoiceControllerProps> = ({ 
  onCommand,
  children 
}) => {
  const {
    isListening,
    isVoiceEnabled,
    isQuietHours,
    commandMappings,
    voiceSettings,
    startListening,
    stopListening,
    speak,
    toggleVoice,
    updateSettings
  } = useVoice();

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;

    // Check browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      // Only process final results
      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(transcript.toLowerCase().trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Auto-restart on no speech
        setTimeout(() => {
          if (isListening && recognition.readyState !== 'listening') {
            recognition.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart if we should still be listening
      if (isListening && isVoiceEnabled && !isQuietHours) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.error('Failed to restart recognition:', error);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [isVoiceEnabled, isListening, isQuietHours]);

  // Start/stop recognition based on listening state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening && isVoiceEnabled && !isQuietHours) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // Recognition might already be running
        console.warn('Recognition start error:', error);
      }
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening, isVoiceEnabled, isQuietHours]);

  const processVoiceCommand = (transcript: string) => {
    // Find matching command from mappings
    const matchedCommand = commandMappings.find(mapping => 
      mapping.phrases.some(phrase => transcript.includes(phrase))
    );

    if (matchedCommand) {
      // Provide audio feedback if enabled
      if (voiceSettings.audioFeedback && !isQuietHours) {
        speak(`Executing ${matchedCommand.description}`);
      }

      // Execute command callback
      onCommand?.(matchedCommand.command);

      // Log for debugging
      console.log('Voice command processed:', {
        transcript,
        command: matchedCommand.command,
        description: matchedCommand.description
      });
    } else {
      // Handle unrecognized commands
      if (voiceSettings.audioFeedback && !isQuietHours) {
        speak('Command not recognized');
      }
      console.log('Unrecognized voice input:', transcript);
    }
  };

  // Keyboard shortcuts for development/testing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + V to toggle voice
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
        event.preventDefault();
        toggleVoice();
      }

      // Ctrl/Cmd + Shift + L to toggle listening
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, toggleVoice, startListening, stopListening]);

  return (
    <>
      {children}
      
      {/* Voice Status Indicator (only show when voice is active) */}
      {isVoiceEnabled && (
        <div 
          className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg border shadow-lg"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: isListening ? 'var(--highlight)' : 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center space-x-2 text-sm">
            <div 
              className={`w-2 h-2 rounded-full ${
                isListening ? 'animate-pulse bg-red-500' : 'bg-gray-400'
              }`}
            />
            <span>
              {isQuietHours 
                ? 'Voice (Quiet)' 
                : isListening 
                  ? 'Listening...' 
                  : 'Voice Ready'
              }
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceController;