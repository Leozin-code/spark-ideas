import { useState } from 'react';
import { useDailyGoals } from '@/hooks/useDailyGoals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailyGoals() {
  const { goals, addGoal, toggleGoal, deleteGoal, getCompletionRate } = useDailyGoals();
  const [newGoal, setNewGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      addGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const completionRate = getCompletionRate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-success" />
            Metas do Dia
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {completionRate}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={completionRate} className="mb-4 h-2" />

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Nova meta para hoje..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {goals.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Defina suas metas do dia! 🎯
            </p>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  goal.completed && "bg-success/5 border-success/20"
                )}
              >
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <span
                  className={cn(
                    "flex-1 text-sm",
                    goal.completed && "line-through text-muted-foreground"
                  )}
                >
                  {goal.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
