import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  message: string;
  response: string;
  createdAt: string;
}

export default function Chatbot() {
  const { toast } = useToast();
  const [input, setInput] = useState("");

  const { data: chatHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/chatbot/history"],
    queryFn: async () => {
      const res = await fetch("/api/chatbot/history");
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chatbot", { message });
      return res.json();
    },
    onSuccess: () => {
      setInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    mutation.mutate(input);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">AI Farming Assistant</h2>
          <p className="text-muted-foreground">Get expert agricultural advice</p>
        </div>

        <Card className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory?.map((msg: Message) => (
                  <div key={msg.id} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-6 w-6 mt-1" />
                      <div className="bg-secondary p-3 rounded-lg">
                        {msg.message}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Bot className="h-6 w-6 mt-1 text-primary" />
                      <div className="bg-primary/10 p-3 rounded-lg">
                        {msg.response}
                      </div>
                    </div>
                  </div>
                ))}
                {mutation.isPending && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI is thinking...
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <CardContent className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming techniques, crop management, etc..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={mutation.isPending || !input.trim()}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-2">Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
