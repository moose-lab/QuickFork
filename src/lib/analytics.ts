export type AnalyticsEventName =
  | "page_view"
  | "hero_repo_url_entered"
  | "generation_started"
  | "generation_completed"
  | "generation_failed"
  | "generated_image_preview_opened"
  | "generated_image_downloaded"
  | "signup_started"
  | "signup_completed"
  | "signin_started"
  | "signin_completed";

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

type DataLayerEntry = Record<string, unknown> | GtagArguments;
type GtagArguments = ["js", Date] | ["config", string] | ["event", string, AnalyticsProperties?];

declare global {
  interface Window {
    dataLayer?: Array<DataLayerEntry>;
    gtag?: (...args: GtagArguments) => void;
  }
}

export function initializeAnalytics(measurementId?: string) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];

  if (!measurementId) return;

  window.gtag = window.gtag ?? ((...args: GtagArguments) => window.dataLayer?.push(args));

  const existingScript = document.querySelector("script[data-quickfork-analytics]");
  if (existingScript) return;

  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("async", "");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.setAttribute("data-quickfork-analytics", "true");
  document.head.append(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

export function trackEvent(event: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  const payload = { event, ...properties };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.gtag?.("event", event, properties);
  window.dispatchEvent(
    new CustomEvent("quickfork:analytics", {
      detail: {
        event,
        properties,
      },
    }),
  );
}

export function getRepoAnalyticsProperties(repoUrl: string): AnalyticsProperties {
  try {
    const url = new URL(repoUrl.trim());
    const [owner, repoWithExtension] = url.pathname.replace(/^\/+/, "").split("/");
    const repo = repoWithExtension?.replace(/\.git$/i, "");

    if (url.hostname !== "github.com" || !owner || !repo) {
      return {
        repo_host: url.hostname || "unknown",
        repo_full_name: "unknown",
      };
    }

    return {
      repo_host: url.hostname,
      repo_full_name: `${owner}/${repo}`,
    };
  } catch {
    return {
      repo_host: "unknown",
      repo_full_name: "unknown",
    };
  }
}

export function getPageAnalyticsProperties() {
  if (typeof window === "undefined") {
    return {
      page_path: "/",
      page_title: "",
      page_referrer: "",
    };
  }

  return {
    page_path: window.location.pathname,
    page_title: document.title,
    page_referrer: document.referrer,
  };
}
