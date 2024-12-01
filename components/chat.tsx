// 'use client';

// import type { Attachment, Message } from 'ai';
// import { useChat } from 'ai/react';
// import { AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import useSWR, { useSWRConfig } from 'swr';
// import { useWindowSize } from 'usehooks-ts';

// import { ChatHeader } from '@/components/chat-header';
// import { PreviewMessage, ThinkingMessage } from '@/components/message';
// import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
// import type { Vote } from '@/lib/db/schema';
// import { fetcher } from '@/lib/utils';

// import { Block, type UIBlock } from './block';
// import { BlockStreamHandler } from './block-stream-handler';
// import { MultimodalInput } from './multimodal-input';
// import { Overview } from './overview';

// export function Chat({
//   id,
//   initialMessages,
//   selectedModelId,
// }: {
//   id: string;
//   initialMessages: Array<Message>;
//   selectedModelId: string;
// }) {
//   const { mutate } = useSWRConfig();

//   const {
//     messages,
//     setMessages,
//     handleSubmit,
//     input,
//     setInput,
//     append,
//     isLoading,
//     stop,
//     data: streamingData,
//   } = useChat({
//     body: { id, modelId: selectedModelId },
//     initialMessages,
//     onFinish: () => {
//       mutate('/api/history');
//     },
//   });

//   const { width: windowWidth = 1920, height: windowHeight = 1080 } =
//     useWindowSize();

//   const [block, setBlock] = useState<UIBlock>({
//     documentId: 'init',
//     content: '',
//     title: '',
//     status: 'idle',
//     isVisible: false,
//     boundingBox: {
//       top: windowHeight / 4,
//       left: windowWidth / 4,
//       width: 250,
//       height: 50,
//     },
//   });

//   const { data: votes } = useSWR<Array<Vote>>(
//     `/api/vote?chatId=${id}`,
//     fetcher,
//   );

//   const [messagesContainerRef, messagesEndRef] =
//     useScrollToBottom<HTMLDivElement>();

//   const [attachments, setAttachments] = useState<Array<Attachment>>([]);

//   return (
//     <>
//       <div className="flex flex-col min-w-0 h-dvh bg-background">
//         <ChatHeader selectedModelId={selectedModelId} />
//         <div
//           ref={messagesContainerRef}
//           className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
//         >
//           {messages.length === 0 && <Overview />}

//           {messages.map((message, index) => (
//             <PreviewMessage
//               key={message.id}
//               chatId={id}
//               message={message}
//               block={block}
//               setBlock={setBlock}
//               isLoading={isLoading && messages.length - 1 === index}
//               vote={
//                 votes
//                   ? votes.find((vote) => vote.messageId === message.id)
//                   : undefined
//               }
//             />
//           ))}

//           {isLoading &&
//             messages.length > 0 &&
//             messages[messages.length - 1].role === 'user' && (
//               <ThinkingMessage />
//             )}

//           <div
//             ref={messagesEndRef}
//             className="shrink-0 min-w-[24px] min-h-[24px]"
//           />
//         </div>
//         <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
//           <MultimodalInput
//             chatId={id}
//             input={input}
//             setInput={setInput}
//             handleSubmit={handleSubmit}
//             isLoading={isLoading}
//             stop={stop}
//             attachments={attachments}
//             setAttachments={setAttachments}
//             messages={messages}
//             setMessages={setMessages}
//             append={append}
//           />
//         </form>
//       </div>

//       <AnimatePresence>
//         {block?.isVisible && (
//           <Block
//             chatId={id}
//             input={input}
//             setInput={setInput}
//             handleSubmit={handleSubmit}
//             isLoading={isLoading}
//             stop={stop}
//             attachments={attachments}
//             setAttachments={setAttachments}
//             append={append}
//             block={block}
//             setBlock={setBlock}
//             messages={messages}
//             setMessages={setMessages}
//             votes={votes}
//           />
//         )}
//       </AnimatePresence>

//       <BlockStreamHandler streamingData={streamingData} setBlock={setBlock} />
//     </>
//   );
// }




// 'use client';

// import { useState } from 'react';

// export function Chat({ id, initialMessages }: { id: string; initialMessages: Array<any> }) {
//   const [messages, setMessages] = useState(initialMessages);
//   const [isLoading, setIsLoading] = useState(false);

//   // Funzione per inviare messaggi al backend
//   const sendMessage = async (messageContent: string) => {
//     const latitude = "41.9028"; // Latitudine statica (es. Roma)
//     const longitude = "12.4964"; // Longitudine statica

//     const newMessage = {
//       id: `${Date.now()}`, // Genera un ID univoco per il messaggio
//       content: messageContent,
//       role: 'user', // Ruolo del mittente
//     };

//     // Aggiungi il messaggio dell'utente allo stato
//     setMessages((prev) => [...prev, newMessage]);
//     setIsLoading(true);

//     try {
//       // Chiamata al tuo endpoint

//       const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/message', {
//         method: 'POST',
//         // mode: 'no-cors', // Aggiungi questa riga
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: messageContent, latitude: "41.9028", longitude: "12.4964" }),
//       });

//       if (!response.ok) {
//         throw new Error('Errore nella risposta dal backend');
//       }

//       const replyContent = await response.text();

//       // Aggiungi la risposta al flusso di messaggi
//       const replyMessage = {
//         id: `${Date.now() + 1}`,
//         content: replyContent,
//         role: 'assistant', // Ruolo del modello
//       };

//       setMessages((prev) => [...prev, replyMessage]);
//     } catch (error) {
//       console.error('Errore durante l\'invio del messaggio:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((message) => (
//           <div key={message.id} className={`message ${message.role}`}>
//             {message.content}
//           </div>
//         ))}
//         {isLoading && <div className="message assistant">Scrivendo...</div>}
//       </div>
//       <div className="input-bar">
//         <input
//           type="text"
//           placeholder="Scrivi un messaggio..."
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && e.currentTarget.value.trim()) {
//               sendMessage(e.currentTarget.value.trim());
//               e.currentTarget.value = ''; // Pulisce l'input
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';

export function Chat({ id, initialMessages }: { id: string; initialMessages: Array<any> }) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Stato per lo userId

  // Genera un userId unico all'inizio della sessione
  useEffect(() => {
    const storedUserId = localStorage.getItem('chatUserId');
    if (storedUserId) {
      setUserId(storedUserId); // Usa lo userId esistente se disponibile
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      setUserId(newUserId); // Genera un nuovo userId
      localStorage.setItem('chatUserId', newUserId); // Salva lo userId nel localStorage
    }
  }, []);

  // Funzione per inviare messaggi al backend
  const sendMessage = async (messageContent: string) => {
    const latitude = "41.9028"; // Latitudine statica (es. Roma)
    const longitude = "12.4964"; // Longitudine statica

    const newMessage = {
      id: `${Date.now()}`, // Genera un ID univoco per il messaggio
      content: messageContent,
      role: 'user', // Ruolo del mittente
    };

    // Aggiungi il messaggio dell'utente allo stato
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Chiamata al tuo endpoint
      const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          latitude: latitude,
          longitude: longitude,
          userId: userId, // Includi lo userId nella richiesta
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta dal backend');
      }

      const replyContent = await response.text();

      // Aggiungi la risposta al flusso di messaggi
      const replyMessage = {
        id: `${Date.now() + 1}`,
        content: replyContent,
        role: 'assistant', // Ruolo del modello
      };

      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="message assistant">Scrivendo...</div>}
      </div>
      <div className="input-bar">
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value.trim());
              e.currentTarget.value = ''; // Pulisce l'input
            }
          }}
        />
      </div>
    </div>
  );
}
