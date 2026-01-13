import { useLocalStorage } from './useLocalStorage';
import { Project } from '@/types/productivity';

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('productivity-projects', []);

  const addProject = (title: string, description: string = '', priority: Project['priority'] = 'medium', dueDate?: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'todo',
      priority,
      createdAt: new Date().toISOString(),
      dueDate,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const moveProject = (id: string, status: Project['status']) => {
    updateProject(id, { status });
  };

  const getProjectsByStatus = (status: Project['status']) => {
    return projects.filter(project => project.status === status);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    moveProject,
    getProjectsByStatus,
  };
}
