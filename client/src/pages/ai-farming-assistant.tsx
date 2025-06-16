import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIFarmingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI farming assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      setInput("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    sendMessage(input);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="space-y-8 h-full flex flex-col">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Farming Assistant</h2>
            <p className="text-muted-foreground">
              Get expert advice on farming practices, crop management, and more
            </p>
          </div>

          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Chat with AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about farming practices, crop management, etc..."
                  disabled={isPending}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
