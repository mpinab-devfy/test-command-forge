import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandTextarea } from "@/components/CommandTextarea";
import { CommandHistory, CommandHistoryItem } from "@/components/CommandHistory";
import { storage, Project, SavedCommand } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commandToSave, setCommandToSave] = useState("");
  const [savedCommandName, setSavedCommandName] = useState("");

  useEffect(() => {
    if (id) {
      const proj = storage.getProject(id);
      if (proj) {
        setProject(proj);
        setHistory(storage.getHistory(id));
      } else {
        navigate("/projetos");
      }
    }
  }, [id, navigate]);

  const handleExecute = async (command: string) => {
    if (!id) return;
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    storage.addHistoryItem({
      command,
      status: "success",
      projectId: id,
    });
    
    setHistory(storage.getHistory(id));
  };

  const handleSaveCommand = (command: string) => {
    setCommandToSave(command);
    setIsDialogOpen(true);
  };

  const confirmSaveCommand = () => {
    if (!id || !savedCommandName.trim()) {
      toast.error("Digite um nome para o comando");
      return;
    }

    storage.addSavedCommand(id, {
      name: savedCommandName,
      command: commandToSave,
    });

    const updatedProject = storage.getProject(id);
    if (updatedProject) {
      setProject(updatedProject);
    }

    setSavedCommandName("");
    setCommandToSave("");
    setIsDialogOpen(false);
    toast.success("Comando salvo com sucesso");
  };

  const handleDeleteSavedCommand = (commandId: string) => {
    if (!id) return;
    storage.deleteSavedCommand(id, commandId);
    const updatedProject = storage.getProject(id);
    if (updatedProject) {
      setProject(updatedProject);
    }
    toast.success("Comando removido");
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/projetos")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Projetos
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.savedCommands.length} comandos salvos • Criado em{" "}
            {new Date(project.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <CommandTextarea
                onExecute={handleExecute}
                placeholder="Digite seu comando de teste para este projeto..."
              />
            </div>

            <div>
              <CommandHistory
                items={history}
                onRerun={handleExecute}
                showRerun={true}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Comandos Salvos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.savedCommands.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum comando salvo ainda
                  </p>
                ) : (
                  project.savedCommands.map((cmd) => (
                    <Card key={cmd.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm">{cmd.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteSavedCommand(cmd.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto mb-2">
                          {cmd.command}
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleExecute(cmd.command)}
                        >
                          Executar
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}

                {history.length > 0 && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          if (history[0]) {
                            setCommandToSave(history[0].command);
                            setIsDialogOpen(true);
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Salvar Último Comando
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Salvar Comando</DialogTitle>
                        <DialogDescription>
                          Dê um nome para este comando para reutilizá-lo depois
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="commandName">Nome do Comando</Label>
                          <Input
                            id="commandName"
                            value={savedCommandName}
                            onChange={(e) => setSavedCommandName(e.target.value)}
                            placeholder="Ex: Teste de Login Admin"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Comando</Label>
                          <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
                            {commandToSave}
                          </pre>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={confirmSaveCommand}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
