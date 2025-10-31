import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommandTextareaProps {
  onExecute: (command: string) => void;
  placeholder?: string;
}

export function CommandTextarea({ onExecute, placeholder }: CommandTextareaProps) {
  const [command, setCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!command.trim()) {
      toast.error("Digite um comando antes de executar");
      return;
    }

    setIsExecuting(true);
    
    try {
      await onExecute(command);
      toast.success("Comando executado com sucesso");
      setCommand("");
    } catch (error) {
      toast.error("Erro ao executar comando");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative">
        <Textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={placeholder || "Digite seu comando de teste aqui..."}
          className="min-h-[200px] font-mono text-sm bg-command-bg text-white border-command-border focus-visible:ring-command-border resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              handleExecute();
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Pressione <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> para executar
        </p>
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !command.trim()}
          className="gap-2"
        >
          {isExecuting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Executar
        </Button>
      </div>
    </div>
  );
}
