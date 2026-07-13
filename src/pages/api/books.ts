import { applyCache, longLivedCache } from "@/lib/cache";
import { fetchBooks } from "@/lib/data";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import BooksContent from "@/components/books/BooksContent.astro";

export const prerender = false;

export async function GET() {
  const books = await fetchBooks().catch(() => null);
  if (!books || books.length === 0) return new Response(null, { status: 503 });

  const container = await AstroContainer.create();
  const html = await container.renderToString(BooksContent, {
    props: { books },
  });

  const response = new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  applyCache(response, longLivedCache);
  return response;
}
