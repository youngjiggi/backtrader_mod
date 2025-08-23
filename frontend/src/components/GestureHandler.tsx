import React, { useRef, useCallback, useEffect } from 'react';

export interface GestureEvent {
  type: 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap' | 'long-press';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  duration: number;
  target: HTMLElement;
}

interface GestureHandlerProps {
  onGesture?: (gesture: GestureEvent) => void;
  onSwipeLeft?: (gesture: GestureEvent) => void;
  onSwipeRight?: (gesture: GestureEvent) => void;
  onSwipeUp?: (gesture: GestureEvent) => void;
  onSwipeDown?: (gesture: GestureEvent) => void;
  onTap?: (gesture: GestureEvent) => void;
  onDoubleTap?: (gesture: GestureEvent) => void;
  onLongPress?: (gesture: GestureEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
  swipeThreshold?: number;
  tapThreshold?: number;
  longPressDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GestureHandler - Touch gesture recognition system for Tesla FSD interface
 * Supports swipe gestures, taps, double taps, and long press
 * Optimized for automotive 44px minimum touch targets
 */
const GestureHandler: React.FC<GestureHandlerProps> = ({
  onGesture,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onDoubleTap,
  onLongPress,
  children,
  disabled = false,
  swipeThreshold = 50,
  tapThreshold = 10,
  longPressDelay = 500,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const createGestureEvent = useCallback((
    type: GestureEvent['type'],
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    startTime: number,
    target: HTMLElement
  ): GestureEvent => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTime;

    return {
      type,
      startX,
      startY,
      endX,
      endY,
      deltaX,
      deltaY,
      distance,
      duration,
      target
    };
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (disabled || event.touches.length > 1) return;

    const touch = event.touches[0];
    const now = Date.now();
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };

    isDraggingRef.current = false;

    // Start long press timer
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      if (touchStartRef.current && !isDraggingRef.current && onLongPress) {
        const gesture = createGestureEvent(
          'long-press',
          touchStartRef.current.x,
          touchStartRef.current.y,
          touchStartRef.current.x,
          touchStartRef.current.y,
          touchStartRef.current.time,
          event.target as HTMLElement
        );
        
        onLongPress(gesture);
        onGesture?.(gesture);
        
        // Prevent other gestures after long press
        touchStartRef.current = null;
      }
    }, longPressDelay);

    // Prevent default to avoid text selection on long press
    event.preventDefault();
  }, [disabled, onLongPress, onGesture, createGestureEvent, clearLongPressTimer, longPressDelay]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (disabled || !touchStartRef.current || event.touches.length > 1) return;

    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If movement exceeds threshold, we're dragging
    if (deltaX > tapThreshold || deltaY > tapThreshold) {
      isDraggingRef.current = true;
      clearLongPressTimer();
    }

    event.preventDefault();
  }, [disabled, tapThreshold, clearLongPressTimer]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (disabled || !touchStartRef.current) return;

    clearLongPressTimer();

    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;
    const startTime = touchStartRef.current.time;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const target = event.target as HTMLElement;

    // Determine gesture type
    if (!isDraggingRef.current && distance <= tapThreshold) {
      // Handle tap or double tap
      const now = Date.now();
      
      if (lastTapRef.current && 
          now - lastTapRef.current.time < 300 && 
          Math.abs(endX - lastTapRef.current.x) < tapThreshold &&
          Math.abs(endY - lastTapRef.current.y) < tapThreshold) {
        
        // Double tap detected
        if (onDoubleTap) {
          const gesture = createGestureEvent('double-tap', startX, startY, endX, endY, startTime, target);
          onDoubleTap(gesture);
          onGesture?.(gesture);
        }
        lastTapRef.current = null;
      } else {
        // Single tap - set timer to wait for potential second tap
        lastTapRef.current = { time: now, x: endX, y: endY };
        
        setTimeout(() => {
          if (lastTapRef.current && lastTapRef.current.time === now && onTap) {
            const gesture = createGestureEvent('tap', startX, startY, endX, endY, startTime, target);
            onTap(gesture);
            onGesture?.(gesture);
          }
        }, 300);
      }
    } else if (distance >= swipeThreshold) {
      // Handle swipe gestures
      let gestureType: GestureEvent['type'];
      let handler: ((gesture: GestureEvent) => void) | undefined;

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          gestureType = 'swipe-right';
          handler = onSwipeRight;
        } else {
          gestureType = 'swipe-left';
          handler = onSwipeLeft;
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          gestureType = 'swipe-down';
          handler = onSwipeDown;
        } else {
          gestureType = 'swipe-up';
          handler = onSwipeUp;
        }
      }

      if (handler) {
        const gesture = createGestureEvent(gestureType, startX, startY, endX, endY, startTime, target);
        handler(gesture);
        onGesture?.(gesture);
      }
    }

    touchStartRef.current = null;
    isDraggingRef.current = false;
    event.preventDefault();
  }, [
    disabled, 
    onTap, 
    onDoubleTap, 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    onGesture,
    createGestureEvent,
    clearLongPressTimer,
    tapThreshold,
    swipeThreshold
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      clearLongPressTimer();
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, clearLongPressTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, [clearLongPressTimer]);

  return (
    <div
      ref={containerRef}
      className={`gesture-handler ${className}`}
      style={{
        touchAction: 'none', // Prevent default touch behaviors
        userSelect: 'none',   // Prevent text selection
        minHeight: '44px',    // Tesla automotive minimum touch target
        minWidth: '44px',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default GestureHandler;