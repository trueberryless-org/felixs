const TIMEOUT_MS = 3000;

type State = "loading" | "static" | "live" | "failed";

function setState(container: HTMLElement, state: State) {
  container.dataset.state = state;
  const name = container.dataset.hydrate;
  if (!name) return;
  const indicator = document.querySelector<HTMLElement>(
    `.live-indicator[data-for="${name}"]`
  );
  if (!indicator) return;
  indicator.dataset.status = state;
  const label = indicator.querySelector<HTMLElement>(".label");
  if (label) {
    label.textContent = {
      loading: "Loading…",
      static: "Cached",
      live: "Live",
      failed: "Offline",
    }[state];
  }
}

async function hydrateOne(container: HTMLElement) {
  const name = container.dataset.hydrate;
  if (!name) return;
  const hasStatic = container.dataset.state === "static";

  if (!hasStatic) setState(container, "loading");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`/api/${name}`, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`${res.status}`);
    const html = (await res.text()).trim();
    if (!html) throw new Error("empty");

    const content = container.querySelector<HTMLElement>("[data-content]");
    if (content) content.innerHTML = html;
    setState(container, "live");
  } catch {
    setState(container, hasStatic ? "static" : "failed");
  }
}

function run() {
  document.querySelectorAll<HTMLElement>("[data-hydrate]").forEach(hydrateOne);
}

if ("requestIdleCallback" in window) {
  (window as any).requestIdleCallback(run, { timeout: 500 });
} else {
  setTimeout(run, 100);
}
