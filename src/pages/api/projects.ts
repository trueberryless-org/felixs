import { getContributedProjects, getOwnProjects } from "@/lib/github";

export const prerender = false;

export async function GET() {
  try {
    const [contributedProjects, ownProjects] = await Promise.all([
      getContributedProjects(),
      getOwnProjects(),
    ]);

    return new Response(
      JSON.stringify({
        contributedProjects,
        ownProjects,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "public, max-age=86400, stale-while-revalidate=7776000",
          "CDN-Cache-Control":
            "public, durable, max-age=604800, stale-while-revalidate=7776000",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
