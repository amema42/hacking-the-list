import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID(); // Generazione ID univoco per la sessione

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]} // Nessun messaggio iniziale
    />
  );
}

