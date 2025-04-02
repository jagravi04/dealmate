
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import { useDeal } from "@/contexts/DealContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  dealId: string;
  messages: Message[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ dealId, messages }) => {
  const { user } = useAuth();
  const { sendMessage } = useDeal();
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !user) return;
    
    setLoading(true);
    try {
      await sendMessage(dealId, inputMessage);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Deal Conversation</h3>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isSender = message.senderId === user?.id;
              
              return (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    isSender ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="flex max-w-[80%]">
                    {!isSender && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={message.sender.avatarUrl} alt={message.sender.name} />
                        <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col">
                      <div 
                        className={cn(
                          "px-3 py-2 rounded-md",
                          isSender ? "chat-message-sender" : "chat-message-receiver"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 px-1">
                        {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t mt-auto">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
