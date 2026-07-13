import { applyCache, longLivedCache } from "@/lib/cache";
import { fetchPosts } from "@/lib/data";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import RecentPostsInner from "@/components/landing/RecentPostsInner.astro";

export const prerender = false;

export async function GET() {
  const posts = await fetchPosts().catch(() => null);
  if (!posts || posts.length === 0) return new Response(null, { status: 503 });

  const container = await AstroContainer.create();
  const html = await container.renderToString(RecentPostsInner, {
    props: { posts },
  });

  const response = new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  applyCache(response, longLivedCache);
  return response;
}
