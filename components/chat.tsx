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

  // Genera e salva userId unico per la sessione utente
  useEffect(() => {
    const storedUserId = localStorage.getItem('chatUserId');
    if (!storedUserId) {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('chatUserId', newUserId);
      setUserId(newUserId);
    } else {
      setUserId(storedUserId);
    }
  }, []);

  // Funzione per inviare messaggi
  const sendMessage = async () => {
    if (!inputValue.trim() || !userId) return;

    const newMessage = {
      id: `${Date.now()}`,
      content: inputValue.trim(),
      role: 'user',
    };

    // Aggiunge il messaggio dell'utente
    setMessages((prev) => [...prev, newMessage]);
    setInputValue(''); // Pulisce l'input
    setIsLoading(true);

    try {
      // Chiamata al tuo endpoint per ottenere la risposta dell'assistente
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

      // Parsing della risposta come JSON
      const replyJson = await response.json();
      const replyContent = replyJson.message; // Assumendo che il messaggio sia nella proprietà "message"

      // Aggiunge il messaggio dell'assistente alla chat
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

  // Gestione dell'invio del messaggio tramite tasto Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault(); // Previene il comportamento predefinito di Enter
      sendMessage();
    }
  };

  // Scrolla automaticamente alla fine dei messaggi ogni volta che `messages` cambia
  useScrollToBottom(messages);

  return (
    <div
      className="chat-container flex flex-col h-screen"
      style={{ backgroundColor: 'var(--background-color)', transition: 'background-color 0.3s' }} // Colore dinamico per light/dark mode
    >
      {/* Intestazione della chat */}
      <ChatHeader />

      {/* Area dei messaggi */}
      <div className="messages flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--background-color)', transition: 'background-color 0.3s' }}>
        {messages.map((message) => (
          <PreviewMessage
            key={message.id}
            chatId={id}
            message={message}
            //block={null} // Passiamo `null` se non usiamo blocchi per questo esempio
            setBlock={() => {}} // Funzione vuota per setBlock se non viene usata
            isLoading={false}
            vote={undefined}
          />
        ))}
        {isLoading && (
          <PreviewMessage
            chatId={id}
            message={{ role: 'assistant', content: 'Scrivendo...' }}
            block={null}
            setBlock={() => {}}
            isLoading={true}
            vote={undefined}
          />
        )}
      </div>

      {/* Barra di input per inviare messaggi */}
      <MultimodalInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={sendMessage}
        isLoading={isLoading}
        onKeyDown={handleKeyDown} // Aggiungi la gestione dell'evento keyDown
      />
    </div>
  );
}

// Aggiungi le variabili CSS per supportare light/dark mode
const root = document.documentElement;
root.style.setProperty('--background-color', 'hsl(0, 0%, 100%)'); // Imposta il colore di sfondo per la modalità light
root.style.setProperty('--background-color-dark', 'hsl(155, 85%, 10%)'); // Imposta il colore di sfondo per la modalità dark

// Aggiungi un listener per cambiare il tema dinamicamente
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    root.style.setProperty('--background-color', root.style.getPropertyValue('--background-color-dark'));
  } else {
    root.style.setProperty('--background-color', 'hsl(0, 0%, 100%)');
  }
});
