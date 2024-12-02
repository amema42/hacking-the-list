'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';
import { TrashIcon } from './icons';
import { useSidebar } from './ui/sidebar';

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

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
        <BetterTooltip content="Clean Chat">
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <TrashIcon />
            <span className="md:sr-only">Clean chat</span>
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
