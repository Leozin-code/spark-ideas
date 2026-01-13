import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim(), priority);
      setNewTodo('');
      setPriority('medium');
    }
  };

  const priorityColors = {
    low: 'bg-info/10 text-info border-info/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <ListTodo className="h-5 w-5 text-primary" />
            Tarefas
          </span>
          <Badge variant="secondary">
            {completedCount}/{todos.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Nova tarefa..."
            className="flex-1"
          />
          <Select value={priority} onValueChange={(v: 'low' | 'medium' | 'high') => setPriority(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma tarefa ainda. Adicione uma! ✨
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  todo.completed && "opacity-50"
                )}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span
                  className={cn(
                    "flex-1 text-sm",
                    todo.completed && "line-through"
                  )}
                >
                  {todo.text}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-xs", priorityColors[todo.priority])}
                >
                  {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteTodo(todo.id)}
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
