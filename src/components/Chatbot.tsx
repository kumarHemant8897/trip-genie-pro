
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
import { Bot } from 'lucide-react';
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

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const currentMessages = [...messages, userMessage];
      const { data, error } = await supabase.functions.invoke('ai-chat-support', {
        body: { messages: currentMessages },
      });

      if (error) throw error;
      
      const assistantMessage = data.message;
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to get response from AI. ${error.message || 'Please try again.'}`,
        variant: 'destructive',
      });
      setMessages(prev => [...prev, {role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again later."}])
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
      <DrawerContent className="h-[80vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-center">AI Assistant</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 items-end ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-800" />
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-coral-DEFAULT text-white rounded-br-none'
                      : 'bg-slate-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start items-end">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-800" />
                </div>
                <div className="max-w-xs p-3 rounded-xl bg-slate-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-1">
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
        <DrawerFooter className="mt-auto bg-background border-t">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
