import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage as ChatMessageType } from "@/types/demo";
import { User, Bot } from "lucide-react";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {message.agentId && !isUser && (
          <Badge variant="secondary" className="text-[10px] mb-2">
            {message.agentId}
          </Badge>
        )}
        <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
        <div className="text-[10px] opacity-50 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
