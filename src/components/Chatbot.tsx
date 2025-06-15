
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

      if (error) {
        console.error("Error invoking Supabase function:", error);
        throw error;
      }
      
      console.log('Received response from AI:', data);
      
      if (!data || !data.message) {
        throw new Error("Invalid response format from AI service");
      }
      
      const assistantMessage = data.message;
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      
      const errorMessage = error.message || 'Unknown error occurred';
      
      toast({
        title: 'Connection Error',
        description: `Unable to connect to AI service: ${errorMessage}`,
        variant: 'destructive',
      });
      
      // Add a fallback message
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
                className={`flex gap-3 items-start ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] md:max-w-[60%] p-4 rounded-2xl shadow-sm bg-white border border-gray-200 text-gray-800 ${
                    message.role === 'user'
                      ? 'rounded-br-md'
                      : 'rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="max-w-[75%] md:max-w-[60%] p-4 rounded-2xl bg-white border border-gray-200 rounded-bl-md">
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
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
