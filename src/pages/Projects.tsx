import { useState, useEffect } from "react";
import { Plus, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage, Project } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectImage, setNewProjectImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(storage.getProjects());
  }, []);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Digite um nome para o projeto");
      return;
    }

    const project = storage.addProject({
      name: newProjectName,
      coverImage: newProjectImage || undefined,
    });

    setProjects(storage.getProjects());
    setNewProjectName("");
    setNewProjectImage("");
    setIsDialogOpen(false);
    toast.success("Projeto criado com sucesso");
  };

  const handleDeleteProject = (id: string) => {
    storage.deleteProject(id);
    setProjects(storage.getProjects());
    toast.success("Projeto excluído");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie seus projetos de teste
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
                <DialogDescription>
                  Defina um nome e opcionalmente uma imagem de capa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Projeto</Label>
                  <Input
                    id="name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Ex: Testes de Login"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem (opcional)</Label>
                  <Input
                    id="image"
                    value={newProjectImage}
                    onChange={(e) => setNewProjectImage(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProject}>Criar Projeto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              Nenhum projeto ainda
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro projeto para começar
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Projeto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  onClick={() => navigate(`/projetos/${project.id}`)}
                  className="h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
                >
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FolderOpen className="w-16 h-16 text-white/80" />
                  )}
                </div>
                <CardContent className="p-4" onClick={() => navigate(`/projetos/${project.id}`)}>
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.savedCommands.length} comandos salvos
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
