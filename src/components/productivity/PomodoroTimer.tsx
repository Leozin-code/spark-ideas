import { useState, useEffect } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PomodoroTimer() {
  const { timeLeft, isRunning, mode, completedPomodoros, start, pause, reset, setMode } = usePomodoro();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (() => {
    const total = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    return ((total - timeLeft) / total) * 100;
  })();

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-all duration-1000",
          mode === 'work' ? "bg-primary" : "bg-accent"
        )}
        style={{ width: `${progress}%` }}
      />
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2 text-lg">
          {mode === 'work' ? (
            <>
              <Brain className="h-5 w-5 text-primary" />
              Foco
            </>
          ) : (
            <>
              <Coffee className="h-5 w-5 text-accent" />
              Pausa
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-center mb-4">
          <div className="text-5xl font-bold tracking-tight font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            🍅 {completedPomodoros} pomodoros hoje
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          <Button
            variant={mode === 'work' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('work')}
          >
            Trabalho
          </Button>
          <Button
            variant={mode === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('shortBreak')}
          >
            Pausa Curta
          </Button>
          <Button
            variant={mode === 'longBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('longBreak')}
          >
            Pausa Longa
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          {isRunning ? (
            <Button onClick={pause} size="lg" className="gap-2">
              <Pause className="h-4 w-4" />
              Pausar
            </Button>
          ) : (
            <Button onClick={start} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Iniciar
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
