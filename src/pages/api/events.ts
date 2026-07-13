import { applyCache, longLivedCache } from "@/lib/cache";
import { fetchEvents } from "@/lib/data";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import EventsContent from "@/components/events/EventsContent.astro";

export const prerender = false;

export async function GET() {
  const events = await fetchEvents().catch(() => null);
  if (!events || events.length === 0)
    return new Response(null, { status: 503 });

  const container = await AstroContainer.create();
  const html = await container.renderToString(EventsContent, {
    props: { events },
  });

  const response = new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  applyCache(response, longLivedCache);
  return response;
}
