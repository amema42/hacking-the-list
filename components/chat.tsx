'use client';

import { useState, useEffect } from 'react';
import { ChatHeader } from '@/components/chat-header'; // Intestazione della chat
import { PreviewMessage } from '@/components/message'; // Import del componente per i messaggi
import { MultimodalInput } from '@/components/multimodal-input'; // Input per l'utente
import { useScrollToBottom } from '@/components/use-scroll-to-bottom'; // Auto scroll

export function Chat({ id, initialMessages }: { id: string; initialMessages: Array<any> }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false); // Stato per verificare l'idratazione

  // Genera un nuovo userId lato client dopo l'idratazione
  useEffect(() => {
    setIsHydrated(true); // Indica che l'idratazione è completata
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    setUserId(newUserId);
    console.log('Generato nuovo userId:', newUserId);
  }, []);

  // Funzione per inviare messaggi
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
          latitude: 41.7681013, // Static: Tivoli, Roma
          longitude: 12.3224347, // Static: Tivoli, Roma
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
    } finally {
      setIsLoading(false);
    }
  };

  useScrollToBottom(messages);

  if (!isHydrated) {
    return <div>loading...</div>; // Placeholder fino a quando l'idratazione è completata
  }

  return (
    <div className="chat-container flex flex-col h-screen">
      {/* Passa userId come prop al ChatHeader */}
      <ChatHeader selectedModelId={id} userId={userId} />
      <div className="messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <PreviewMessage key={message.id} chatId={id} message={message} />
        ))}
        {isLoading && (
          <PreviewMessage chatId={id} message={{ role: 'assistant', content: 'Writing...' }} isLoading={true} />
        )}
      </div>
      <MultimodalInput inputValue={inputValue} setInputValue={setInputValue} onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
