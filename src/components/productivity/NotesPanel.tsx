import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Search, X, Edit2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotesPanel() {
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);
      addNote(newTitle.trim(), newContent, tags);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setShowForm(false);
    }
  };

  const handleEdit = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingId(noteId);
      setNewTitle(note.title);
      setNewContent(note.content);
      setNewTags(note.tags.join(', '));
    }
  };

  const handleSaveEdit = () => {
    if (editingId && newTitle.trim()) {
      const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);
      updateNote(editingId, { title: newTitle, content: newContent, tags });
      setEditingId(null);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-info" />
            Notas
          </span>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {(showForm || editingId) && (
          <form onSubmit={editingId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSubmit} className="mb-4 p-3 border rounded-lg space-y-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título da nota..."
            />
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Escreva sua nota..."
              rows={4}
            />
            <Input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (separadas por vírgula)..."
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                {editingId ? 'Salvar' : 'Adicionar'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null);
                  setNewTitle('');
                  setNewContent('');
                  setNewTags('');
                }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {searchQuery ? 'Nenhuma nota encontrada' : 'Crie sua primeira nota! 📝'}
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{note.title}</h4>
                    {note.content && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {note.content}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(new Date(note.updatedAt), "d 'de' MMM", { locale: ptBR })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(note.id)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
