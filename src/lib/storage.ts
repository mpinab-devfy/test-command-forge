export interface Project {
  id: string;
  name: string;
  coverImage?: string;
  createdAt: Date;
  savedCommands: SavedCommand[];
}

export interface SavedCommand {
  id: string;
  command: string;
  name: string;
  createdAt: Date;
}

export interface CommandHistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  status: "success" | "error";
  projectId?: string;
}

const STORAGE_KEYS = {
  PROJECTS: "qa-tester-projects",
  HISTORY: "qa-tester-history",
};

export const storage = {
  // Projects
  getProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  addProject(project: Omit<Project, "id" | "createdAt" | "savedCommands">): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      savedCommands: [],
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.saveProjects(projects);
    }
  },

  deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
  },

  getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  },

  // Saved Commands
  addSavedCommand(projectId: string, command: Omit<SavedCommand, "id" | "createdAt">): void {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const newCommand: SavedCommand = {
        ...command,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      project.savedCommands.push(newCommand);
      this.saveProjects(projects);
    }
  },

  deleteSavedCommand(projectId: string, commandId: string): void {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.savedCommands = project.savedCommands.filter((c) => c.id !== commandId);
      this.saveProjects(projects);
    }
  },

  // History
  getHistory(projectId?: string): CommandHistoryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: CommandHistoryItem[] = data ? JSON.parse(data) : [];
    return projectId ? history.filter((h) => h.projectId === projectId) : history.filter((h) => !h.projectId);
  },

  addHistoryItem(item: Omit<CommandHistoryItem, "id" | "timestamp">): void {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    const newItem: CommandHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    history.unshift(newItem);
    // Keep only last 50 items
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },
};
