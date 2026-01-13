import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PomodoroTimer } from '@/components/productivity/PomodoroTimer';
import { TodoList } from '@/components/productivity/TodoList';
import { HabitTracker } from '@/components/productivity/HabitTracker';
import { NotesPanel } from '@/components/productivity/NotesPanel';
import { KanbanBoard } from '@/components/productivity/KanbanBoard';
import { DailyGoals } from '@/components/productivity/DailyGoals';
import { Sparkles, Calendar } from 'lucide-react';

const Index = () => {
  const today = new Date();
  const greeting = (() => {
    const hour = today.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Produtividade
              </h1>
              <p className="text-sm text-muted-foreground">
                {greeting}! {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(today, 'dd/MM/yyyy')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer & Goals */}
          <div className="space-y-6">
            <PomodoroTimer />
            <DailyGoals />
          </div>

          {/* Center Column - Todos & Habits */}
          <div className="space-y-6">
            <TodoList />
            <HabitTracker />
          </div>

          {/* Right Column - Notes */}
          <div className="space-y-6">
            <NotesPanel />
          </div>
        </div>

        {/* Kanban Board - Full Width */}
        <div className="mt-6">
          <KanbanBoard />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          💾 Todos os dados são salvos automaticamente no seu navegador
        </div>
      </footer>
    </div>
  );
};

export default Index;
