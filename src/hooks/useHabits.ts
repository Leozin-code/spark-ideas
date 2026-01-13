import { useLocalStorage } from './useLocalStorage';
import { Habit } from '@/types/productivity';
import { format } from 'date-fns';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('productivity-habits', []);

  const addHabit = (name: string, icon: string, color: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabitForDate = (habitId: string, date: Date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== habitId) return habit;
        const hasDate = habit.completedDates.includes(dateStr);
        return {
          ...habit,
          completedDates: hasDate
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr],
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const getStreak = (habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (habit.completedDates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    habits,
    addHabit,
    toggleHabitForDate,
    deleteHabit,
    getStreak,
  };
}
