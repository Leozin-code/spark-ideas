import { useState, useEffect, useCallback, useRef } from 'react';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  completedPomodoros: number;
}

const DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>(() => {
    const saved = localStorage.getItem('pomodoro-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isRunning: false };
    }
    return {
      timeLeft: DURATIONS.work,
      isRunning: false,
      mode: 'work' as const,
      completedPomodoros: 0,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.timeLeft]);

  const handleComplete = useCallback(() => {
    setState(prev => {
      if (prev.mode === 'work') {
        const newCompleted = prev.completedPomodoros + 1;
        const nextMode = newCompleted % 4 === 0 ? 'longBreak' : 'shortBreak';
        return {
          ...prev,
          mode: nextMode,
          timeLeft: DURATIONS[nextMode],
          isRunning: false,
          completedPomodoros: newCompleted,
        };
      } else {
        return {
          ...prev,
          mode: 'work',
          timeLeft: DURATIONS.work,
          isRunning: false,
        };
      }
    });
  }, []);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: DURATIONS[prev.mode],
      isRunning: false,
    }));
  }, []);

  const setMode = useCallback((mode: 'work' | 'shortBreak' | 'longBreak') => {
    setState(prev => ({
      ...prev,
      mode,
      timeLeft: DURATIONS[mode],
      isRunning: false,
    }));
  }, []);

  return {
    ...state,
    start,
    pause,
    reset,
    setMode,
  };
}
