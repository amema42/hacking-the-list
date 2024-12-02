'use client';

import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';
import { TrashIcon } from './icons';
import { useSidebar } from './ui/sidebar';

export function ChatHeader({
  selectedModelId,
  userId,
}: {
  selectedModelId: string;
  userId: string | null;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  // Funzione per svuotare la chat
  const clearChat = async () => {
    if (!userId) {
      console.error('❌ userId non trovato');
      return;
    }

    try {
      console.log('Invio richiesta al backend per svuotare la chat con userId:', userId);
      const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/clear-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Errore durante la pulizia della chat: ${response.statusText}`);
      }

      console.log('✅ Chat svuotata con successo');
      router.refresh(); // Ricarica la pagina per mostrare la chat svuotata
    } catch (error) {
      console.error('❌ Errore durante la pulizia della chat:', error);
    }
  };
  if (!userId) {
    console.error('❌ userId non trovato');
    return;
  }
  
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap');

        .funnel-display {
          font-family: 'Funnel Display', serif;
          font-optical-sizing: auto;
          font-weight: 800; /* Cambia il peso secondo necessità */
          font-style: normal;
          font-size: 1.5rem; /* Dimensione del testo */
          color: #fff; /* Colore del testo */
        }
      `}</style>
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <BetterTooltip content="clean Chat">
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={clearChat} // Associa il click alla funzione clearChat
          >
            <TrashIcon />
            <span className="md:sr-only">clean chat</span>
          </Button>
        </BetterTooltip>
      )}
      <ModelSelector
        selectedModelId={selectedModelId}
        className="order-1 md:order-2"
      />
      <div className="ml-auto order-4">
        <span className="funnel-display">(beta) liiist</span>
      </div>
    </header>
  );
}
