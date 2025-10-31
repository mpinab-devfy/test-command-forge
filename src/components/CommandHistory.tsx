import { Clock, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export interface CommandHistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  status: "success" | "error";
}

interface CommandHistoryProps {
  items: CommandHistoryItem[];
  onRerun?: (command: string) => void;
  showRerun?: boolean;
}

export function CommandHistory({ items, onRerun, showRerun = false }: CommandHistoryProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Comando copiado");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhum histórico</h3>
        <p className="text-sm text-muted-foreground">
          Execute comandos para ver o histórico aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
        Histórico de Comandos
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="border-border hover:border-accent transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                    {item.command}
                  </pre>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString("pt-BR")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "success" ? "Sucesso" : "Erro"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(item.command)}
                    title="Salvar fluxo"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  {showRerun && onRerun && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRerun(item.command)}
                      title="Executar novamente"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
