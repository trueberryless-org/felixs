const SIX_MONTHS = 60 * 60 * 24 * 30 * 6;
const ONE_HOUR = 60 * 60;

interface CacheProfile {
  browser: string;
  cdn: string;
}

const cdn = (maxAge: number, swr: number, sie: number) =>
  `public, durable, s-maxage=${maxAge}, stale-while-revalidate=${swr}, stale-if-error=${sie}`;

export const longLivedCache: CacheProfile = {
  browser: "public, max-age=0, must-revalidate",
  cdn: cdn(60, SIX_MONTHS, SIX_MONTHS),
};

export const degradedCache: CacheProfile = {
  browser: "public, max-age=0, must-revalidate",
  cdn: cdn(60, 300, ONE_HOUR),
};

export function applyCache(
  response: { headers: Headers },
  profile: CacheProfile = longLivedCache
) {
  response.headers.set("Cache-Control", profile.browser);
  response.headers.set("CDN-Cache-Control", profile.cdn);
  response.headers.set("Netlify-CDN-Cache-Control", profile.cdn);
}
