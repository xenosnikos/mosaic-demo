"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { useChatStore } from "@/stores/chat-store";
import { Send } from "lucide-react";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const { messages, isTyping, addMessage, setTyping, setAgentPhase } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");

    // Add user message
    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    });

    setTyping(true);

    // Animate agent phases
    setAgentPhase("coordinator", "perceive");
    setTimeout(() => setAgentPhase("coordinator", "decide"), 300);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();

      // Show specialist phases
      for (const agentId of data.agents || []) {
        setAgentPhase(agentId, "act");
      }

      setAgentPhase("coordinator", "act");

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        agentId: data.agents?.join(", "),
        timestamp: Date.now(),
      });
    } catch (err) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Make sure the server is running with a valid OPENAI_API_KEY.",
        timestamp: Date.now(),
      });
    } finally {
      setTyping(false);
      setAgentPhase("coordinator", "idle");
      setAgentPhase("knowledge-agent", "idle");
      setAgentPhase("code-agent", "idle");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Ask about Mosaic</p>
            <p className="text-sm mb-4">
              Try asking about the BDI architecture, event bus, or request a code example.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "What is the BDI model?",
                "How does the event bus work?",
                "Show me how to create an LLMAgent",
                "What extension points does Mosaic offer?",
              ].map((q) => (
                <button
                  key={q}
                  className="text-xs border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Mosaic..."
          disabled={isTyping}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
