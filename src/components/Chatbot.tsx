
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! How can I help you with your travel plans today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const currentMessages = [...messages, userMessage];
      console.log('Sending messages to AI:', currentMessages);

      const { data, error } = await supabase.functions.invoke('ai-chat-support', {
        body: { messages: currentMessages },
      });

      if (error || !data) {
        const errorMsg = error?.message || (data && data.error) || "Unknown error";
        throw new Error(errorMsg);
      }

      if (!data.message || !data.message.content) {
        throw new Error("AI service did not return a response.");
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: 'Connection Error',
        description: `Unable to connect to AI service: ${error.message || error}`,
        variant: 'destructive',
      });
      setMessages(prev => [...prev, {
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-8 left-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-xl z-50"
          title="AI Assistant"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] flex flex-col max-w-4xl mx-auto">
        <DrawerHeader className="border-b bg-white">
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI Travel Assistant
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-grow p-4 bg-gray-50">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3 items-start w-full"
              >
                <div className={`${message.role === 'user' 
                  ? "ml-auto flex flex-row-reverse" 
                  : ""} w-full flex items-end`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1 rounded-full 
                    ${message.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'}`}>
                    {message.role === 'user'
                      ? <User className="w-5 h-5 text-white" />
                      : <Bot className="w-5 h-5 text-blue-600" />
                    }
                  </div>
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] md:max-w-[60%] p-4 my-1 rounded-2xl shadow-sm bg-white border border-gray-200 text-gray-800 
                            flex-1 
                            ${message.role === 'user'
                              ? 'rounded-br-md ml-3'
                              : 'rounded-bl-md mr-3'
                            }`}
                  >
                    <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="max-w-[75%] md:max-w-[60%] p-4 rounded-2xl bg-white border border-gray-200 flex-1 rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <DrawerFooter className="bg-white border-t">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-3xl mx-auto w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your travel plans..."
              className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
              autoComplete="off"
              data-testid="chatbot-input"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 flex items-center justify-center"
              data-testid="chatbot-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
