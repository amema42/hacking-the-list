'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from '@/components/chat-header';
import { PreviewMessage } from '@/components/message';
import { MultimodalInput } from '@/components/multimodal-input';

export function Chat({ id, initialMessages }: { id: string; initialMessages: Array<any> }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsHydrated(true);
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    setUserId(newUserId);
    console.log('Generato nuovo userId:', newUserId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !userId) return;

    const newMessage = {
      id: `${Date.now()}`,
      content: inputValue.trim(),
      role: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          message: newMessage.content,
          latitude: 41.7681013,
          longitude: 12.3224347,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta dal backend');
      }

      const replyJson = await response.json();
      const replyContent = replyJson.message;

      const replyMessage = {
        id: `${Date.now() + 1}`,
        content: replyContent,
        role: 'assistant',
      };
      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          content: 'Errore nell\'invio del messaggio. Riprova più tardi.',
          role: 'assistant',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="chat-container flex flex-col h-screen">
      <ChatHeader selectedModelId={id} userId={userId} />
      <div className="messages flex-1 overflow-y-auto p-2 space-y-2"> {/* Ridotto padding */}
        {messages.map((message) => (
          <PreviewMessage key={message.id} chatId={id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-20" /> {/* Aggiunge uno spazio extra di 10 unità (tailwind h-10) */}
      <div className="input-bar flex items-center p-3 bg-[hsl(155,85%,10%)]"> {/* Regola padding */}
        <MultimodalInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
