import { useState, useEffect } from "react";
import { CommandTextarea } from "@/components/CommandTextarea";
import { CommandHistory, CommandHistoryItem } from "@/components/CommandHistory";
import { storage } from "@/lib/storage";

export default function Home() {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);

  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  const handleExecute = async (command: string) => {
    // Simulate command execution
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    storage.addHistoryItem({
      command,
      status: "success",
    });
    
    setHistory(storage.getHistory());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Console de Testes
          </h1>
          <p className="text-muted-foreground">
            Digite comandos para automatizar seus testes com Playwright
          </p>
        </div>

        <div className="mb-12">
          <CommandTextarea onExecute={handleExecute} />
        </div>

        <div className="max-w-4xl mx-auto">
          <CommandHistory items={history} />
        </div>
      </div>
    </div>
  );
}
