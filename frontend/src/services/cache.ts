const CACHE_NAME = 'bible-readings-cache-v1';

export async function cacheReading(reference: string, text: string): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(
    new Request(`/readings/${reference}`),
    new Response(text)
  );
}

export async function getCachedReading(reference: string): Promise<string | null> {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/readings/${reference}`);
  return response ? await response.text() : null;
}