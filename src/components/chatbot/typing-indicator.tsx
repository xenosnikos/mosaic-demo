import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot [animation-delay:200ms]" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse-dot [animation-delay:400ms]" />
      </div>
    </div>
  );
}
