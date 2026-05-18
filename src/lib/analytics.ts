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

const CAMPAIGN_PARAM_NAMES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CAMPAIGN_STORAGE_KEY = "quickfork_campaign_context";
type CampaignParamName = (typeof CAMPAIGN_PARAM_NAMES)[number];

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

  const enrichedProperties = { ...getCampaignAnalyticsProperties(), ...properties };
  const payload = { event, ...enrichedProperties };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.gtag?.("event", event, enrichedProperties);
  window.dispatchEvent(
    new CustomEvent("quickfork:analytics", {
      detail: {
        event,
        properties: enrichedProperties,
      },
    }),
  );
}

export function getCampaignAnalyticsProperties(): AnalyticsProperties {
  if (typeof window === "undefined") return {};

  const currentCampaign = getCurrentCampaignProperties();
  if (Object.keys(currentCampaign).length > 0) {
    storeCampaignProperties(currentCampaign);
    return currentCampaign;
  }

  return getStoredCampaignProperties();
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

function getCurrentCampaignProperties(): AnalyticsProperties {
  const properties: AnalyticsProperties = {};
  const searchParams = new URLSearchParams(window.location.search);

  for (const name of CAMPAIGN_PARAM_NAMES) {
    const value = normalizeCampaignValue(searchParams.get(name));
    if (value) properties[name] = value;
  }

  return properties;
}

function getStoredCampaignProperties(): AnalyticsProperties {
  try {
    const stored = window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Partial<Record<CampaignParamName, unknown>>;
    const properties: AnalyticsProperties = {};

    for (const name of CAMPAIGN_PARAM_NAMES) {
      const value = typeof parsed[name] === "string" ? normalizeCampaignValue(parsed[name]) : undefined;
      if (value) properties[name] = value;
    }

    return properties;
  } catch {
    return {};
  }
}

function storeCampaignProperties(properties: AnalyticsProperties) {
  try {
    const campaignProperties: Record<string, string> = {};

    for (const name of CAMPAIGN_PARAM_NAMES) {
      const value = typeof properties[name] === "string" ? normalizeCampaignValue(properties[name]) : undefined;
      if (value) campaignProperties[name] = value;
    }

    if (Object.keys(campaignProperties).length > 0) {
      window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaignProperties));
    }
  } catch {
    // Session storage can be unavailable in some privacy modes; analytics should still work.
  }
}

function normalizeCampaignValue(value?: string | null) {
  const normalized = value?.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, 120);
  return normalized || undefined;
}
