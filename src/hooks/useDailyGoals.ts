import { useLocalStorage } from './useLocalStorage';
import { DailyGoal } from '@/types/productivity';
import { format } from 'date-fns';

export function useDailyGoals() {
  const [goals, setGoals] = useLocalStorage<DailyGoal[]>('productivity-daily-goals', []);

  const today = format(new Date(), 'yyyy-MM-dd');

  const todayGoals = goals.filter(goal => goal.date === today);

  const addGoal = (text: string) => {
    const newGoal: DailyGoal = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      date: today,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getCompletionRate = (): number => {
    if (todayGoals.length === 0) return 0;
    const completed = todayGoals.filter(g => g.completed).length;
    return Math.round((completed / todayGoals.length) * 100);
  };

  return {
    goals: todayGoals,
    allGoals: goals,
    addGoal,
    toggleGoal,
    deleteGoal,
    getCompletionRate,
  };
}
