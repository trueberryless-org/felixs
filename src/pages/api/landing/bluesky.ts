import { applyCache, longLivedCache } from "@/lib/cache";
import { fetchBluesky } from "@/lib/data";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import RecentBlueskyPostsInner from "@/components/landing/RecentBlueskyPostsInner.astro";

export const prerender = false;

export async function GET() {
  const posts = await fetchBluesky().catch(() => null);
  if (!posts || posts.length === 0) return new Response(null, { status: 503 });

  const container = await AstroContainer.create();
  const html = await container.renderToString(RecentBlueskyPostsInner, {
    props: { posts },
  });

  const response = new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  applyCache(response, longLivedCache);
  return response;
}
