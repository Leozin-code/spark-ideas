import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Kanban, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from '@/types/productivity';

const STATUS_LABELS = {
  'todo': { label: 'A Fazer', color: 'bg-muted' },
  'in-progress': { label: 'Em Progresso', color: 'bg-info/20' },
  'done': { label: 'Concluído', color: 'bg-success/20' },
};

export function KanbanBoard() {
  const { projects, addProject, updateProject, deleteProject, moveProject, getProjectsByStatus } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Project['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addProject(newTitle.trim(), newDescription, newPriority);
      setNewTitle('');
      setNewDescription('');
      setNewPriority('medium');
      setShowForm(false);
    }
  };

  const priorityColors = {
    low: 'border-l-info',
    medium: 'border-l-warning',
    high: 'border-l-destructive',
  };

  const columns: Project['status'][] = ['todo', 'in-progress', 'done'];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Kanban className="h-5 w-5 text-primary" />
            Projetos
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
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nome do projeto..."
            />
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descrição (opcional)..."
            />
            <Select value={newPriority} onValueChange={(v: Project['priority']) => setNewPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa prioridade</SelectItem>
                <SelectItem value="medium">Média prioridade</SelectItem>
                <SelectItem value="high">Alta prioridade</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">Adicionar Projeto</Button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-3">
          {columns.map((status) => (
            <div key={status} className={cn("rounded-lg p-2", STATUS_LABELS[status].color)}>
              <div className="text-xs font-medium text-center mb-2 text-muted-foreground">
                {STATUS_LABELS[status].label}
              </div>
              <div className="space-y-2 min-h-[100px]">
                {getProjectsByStatus(status).map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "bg-card p-2 rounded border border-l-4 shadow-sm",
                      priorityColors[project.priority]
                    )}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">{project.title}</div>
                        {project.description && (
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {project.description}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {columns.filter(s => s !== status).map((newStatus) => (
                        <Button
                          key={newStatus}
                          variant="outline"
                          size="sm"
                          className="h-5 text-[10px] px-1.5 flex-1"
                          onClick={() => moveProject(project.id, newStatus)}
                        >
                          {newStatus === 'todo' ? '←' : newStatus === 'done' ? '→' : status === 'todo' ? '→' : '←'}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
