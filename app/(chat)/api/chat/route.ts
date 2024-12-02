export async function POST(request: Request) {
  const url = new URL(request.url);
  const isClearChat = url.pathname.endsWith('/clear-chat'); // Controlla se è una richiesta di "clear-chat"

  if (isClearChat) {
    const { userId }: { userId: string } = await request.json();

    if (!userId) {
      return new Response('userId mancante', { status: 400 });
    }

    try {
      const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/clear-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        return new Response(`Errore durante la pulizia della chat: ${response.statusText}`, { status: response.status });
      }

      return new Response('Chat pulita con successo', { status: 200 });
    } catch (error) {
      console.error('Errore durante la richiesta di pulizia della chat:', error);
      return new Response('Errore del server', { status: 500 });
    }
  }

  // Continua con il gestore originale per le altre richieste
  const { id, message, latitude, longitude, userId }: { 
    id: string; 
    message: string; 
    latitude: number; 
    longitude: number; 
    userId: string 
  } = await request.json();

  const payload = {
    message,
    latitude,
    longitude,
    userId,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000); // Timeout: 9 sec

  try {
    const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    clearTimeout(timeout); // Cancella il timeout se la risposta è veloce

    if (!response.ok) {
      return new Response(`Error from LLM: ${response.statusText}`, { status: response.status });
    }

    const result = await response.text();
    return new Response(result, { status: 200 });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Timeout raggiunto per la richiesta');
      return new Response('Timeout raggiunto', { status: 504 });
    }
    console.error('Errore durante la comunicazione con LLM:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
