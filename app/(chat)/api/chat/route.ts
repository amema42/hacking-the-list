export async function POST(request: Request) {
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

  try {
    const response = await fetch('https://mysterious-erika-liiist-cc9f939c.koyeb.app/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return new Response(`Error from LLM: ${response.statusText}`, { status: response.status });
    }

    const result = await response.text();

    return new Response(result, { status: 200 });
  } catch (error) {
    console.error('Error communicating with the LLM:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}