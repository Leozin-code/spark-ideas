import { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Flame, Heart, Book, Dumbbell, Moon, Droplets, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ICONS = [
  { icon: Heart, name: 'heart', label: '❤️' },
  { icon: Book, name: 'book', label: '📚' },
  { icon: Dumbbell, name: 'gym', label: '💪' },
  { icon: Moon, name: 'sleep', label: '😴' },
  { icon: Droplets, name: 'water', label: '💧' },
  { icon: Music, name: 'music', label: '🎵' },
];

const COLORS = [
  { name: 'red', class: 'bg-habit-red' },
  { name: 'orange', class: 'bg-habit-orange' },
  { name: 'yellow', class: 'bg-habit-yellow' },
  { name: 'green', class: 'bg-habit-green' },
  { name: 'blue', class: 'bg-habit-blue' },
  { name: 'purple', class: 'bg-habit-purple' },
  { name: 'pink', class: 'bg-habit-pink' },
];

export function HabitTracker() {
  const { habits, addHabit, toggleHabitForDate, deleteHabit, getStreak } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('heart');
  const [selectedColor, setSelectedColor] = useState('purple');

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit.trim(), selectedIcon, selectedColor);
      setNewHabit('');
      setShowForm(false);
    }
  };

  const getColorClass = (color: string) => {
    return COLORS.find(c => c.name === color)?.class || 'bg-habit-purple';
  };

  const getIconEmoji = (iconName: string) => {
    return ICONS.find(i => i.name === iconName)?.label || '❤️';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-habit-orange" />
            Hábitos
          </span>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded-lg space-y-3">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Nome do hábito..."
            />
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setSelectedIcon(icon.name)}
                  className={cn(
                    "p-2 rounded-lg border transition-all",
                    selectedIcon === icon.name && "ring-2 ring-primary"
                  )}
                >
                  {icon.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    color.class,
                    selectedColor === color.name && "ring-2 ring-offset-2 ring-foreground"
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full">Adicionar Hábito</Button>
          </form>
        )}

        <div className="space-y-3">
          {habits.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Crie seu primeiro hábito! 🌟
            </p>
          ) : (
            habits.map((habit) => {
              const isCompletedToday = habit.completedDates.includes(todayStr);
              const streak = getStreak(habit.id);

              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <button
                    onClick={() => toggleHabitForDate(habit.id)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all",
                      isCompletedToday
                        ? `${getColorClass(habit.color)} text-white`
                        : "bg-muted"
                    )}
                  >
                    {getIconEmoji(habit.icon)}
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{habit.name}</div>
                    {streak > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Flame className="h-3 w-3 text-habit-orange" />
                        {streak} dias seguidos
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
