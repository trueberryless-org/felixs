import { applyCache, longLivedCache } from "@/lib/cache";
import { buildReadingSummary, fetchBooks } from "@/lib/data";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import ReadingSummaryInner from "@/components/landing/ReadingSummaryInner.astro";

export const prerender = false;

export async function GET() {
  const books = await fetchBooks().catch(() => null);
  const summary = books ? buildReadingSummary(books) : null;
  if (!summary) return new Response(null, { status: 503 });

  const container = await AstroContainer.create();
  const html = await container.renderToString(ReadingSummaryInner, {
    props: { summary },
  });

  const response = new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  applyCache(response, longLivedCache);
  return response;
}
