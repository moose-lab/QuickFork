import { getMarketingLinkByPath, type MarketingPageType } from "../marketing/link-catalog";

export type AnalyticsEventName =
  | "page_view"
  | "cta_clicked"
  | "outbound_link_clicked"
  | "resource_page_viewed"
  | "example_page_viewed"
  | "tool_started"
  | "tool_result_viewed"
  | "hero_repo_url_entered"
  | "generation_started"
  | "generation_completed"
  | "generation_failed"
  | "launch_brief_viewed"
  | "launch_brief_copied"
  | "launch_artifact_copied"
  | "launch_artifact_downloaded"
  | "generated_image_preview_opened"
  | "generated_image_downloaded"
  | "lead_magnet_requested"
  | "lead_magnet_delivered"
  | "showcase_publish_started"
  | "showcase_published"
  | "demo_requested"
  | "sales_contact_requested"
  | "signup_started"
  | "signup_completed"
  | "signin_started"
  | "signin_completed";

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

type DataLayerEntry = Record<string, unknown> | GtagArguments;
type GtagArguments = ["js", Date] | ["config", string] | ["event", string, AnalyticsProperties?];

const CAMPAIGN_PARAM_NAMES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const CAMPAIGN_STORAGE_KEY = "quickfork_campaign_context";
const SENSITIVE_PROPERTY_KEY_PATTERN =
  /(^|_)(email|token|secret|api[_-]?key|apikey|auth|otp|password|raw|readme|backend_error|error_message)($|_)/i;
const EMAIL_VALUE_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const SECRET_VALUE_PATTERN = /(token=|secret|api[_-]?key=|password=)/i;
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

  const enrichedProperties = sanitizeAnalyticsProperties({ ...getCampaignAnalyticsProperties(), ...properties });
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
      ...getRouteAnalyticsProperties("/"),
    };
  }

  return {
    page_path: window.location.pathname,
    page_title: document.title,
    page_referrer: sanitizeUrlForAnalytics(document.referrer),
    ...getRouteAnalyticsProperties(window.location.pathname),
  };
}

export function getRouteAnalyticsProperties(pathname: string): AnalyticsProperties {
  const normalizedPath = normalizePathname(pathname);
  const marketingLink = getMarketingLinkByPath(normalizedPath);
  const [family, slug] = normalizedPath.replace(/^\/+/, "").split("/");
  const intentCluster = slug ? slugToIntentCluster(slug) : undefined;

  if (marketingLink) {
    return {
      page_type: marketingLink.pageType,
      page_intent: getMarketingPageIntent(marketingLink.pageType),
      buyer_stage: marketingLink.buyerStage,
      intent_cluster: marketingLink.intentCluster,
    };
  }

  if (normalizedPath === "/") {
    return {
      page_type: "homepage",
      page_intent: "activation",
      buyer_stage: "consideration",
      intent_cluster: "repo_to_launch",
    };
  }

  if (normalizedPath === "/sign-in") {
    return {
      page_type: "auth",
      page_intent: "account_access",
      buyer_stage: "decision",
      intent_cluster: "account_access",
    };
  }

  if (normalizedPath === "/sign-up") {
    return {
      page_type: "auth",
      page_intent: "account_creation",
      buyer_stage: "decision",
      intent_cluster: "signup",
    };
  }

  if (normalizedPath === "/contact") {
    return {
      page_type: "contact",
      page_intent: "sales_contact",
      buyer_stage: "decision",
      intent_cluster: "founder_led_sales",
    };
  }

  switch (family) {
    case "product":
      return {
        page_type: "product",
        page_intent: "category_or_feature_consideration",
        buyer_stage: "consideration",
        intent_cluster: intentCluster ?? "product",
      };
    case "use-cases":
      return {
        page_type: "use_case",
        page_intent: "job_to_be_done",
        buyer_stage: "consideration",
        intent_cluster: intentCluster ?? "use_case",
      };
    case "resources":
      return {
        page_type: "resource",
        page_intent: "education",
        buyer_stage: "awareness",
        intent_cluster: intentCluster ?? "resource",
      };
    case "compare":
      return {
        page_type: "compare",
        page_intent: "alternative_evaluation",
        buyer_stage: "decision",
        intent_cluster: intentCluster ?? "compare",
      };
    case "examples":
      return {
        page_type: "example",
        page_intent: "proof",
        buyer_stage: "decision",
        intent_cluster: intentCluster ?? "example",
      };
    case "tools":
      return {
        page_type: "tool",
        page_intent: "utility",
        buyer_stage: "consideration",
        intent_cluster: intentCluster ?? "tool",
      };
    case "templates":
      return {
        page_type: "template",
        page_intent: "implementation",
        buyer_stage: "implementation",
        intent_cluster: intentCluster ?? "template",
      };
    default:
      return {
        page_type: "unknown",
        page_intent: "unknown",
        buyer_stage: "unknown",
        intent_cluster: "unknown",
      };
  }
}

function getMarketingPageIntent(pageType: MarketingPageType) {
  switch (pageType) {
    case "product":
      return "category_or_feature_consideration";
    case "use_case":
      return "job_to_be_done";
    case "resource":
      return "education";
    case "compare":
      return "alternative_evaluation";
    case "example":
      return "proof";
    case "tool":
      return "utility";
    case "template":
      return "implementation";
    case "contact":
      return "sales_contact";
  }
}

function sanitizeAnalyticsProperties(properties: AnalyticsProperties): AnalyticsProperties {
  const safeProperties: AnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || SENSITIVE_PROPERTY_KEY_PATTERN.test(key)) continue;
    if (typeof value === "string" && (EMAIL_VALUE_PATTERN.test(value) || SECRET_VALUE_PATTERN.test(value))) continue;
    safeProperties[key] = value;
  }

  return safeProperties;
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

function normalizePathname(pathname: string) {
  const path = pathname.split(/[?#]/)[0] || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
}

function sanitizeUrlForAnalytics(url: string) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return "";
  }
}

function slugToIntentCluster(slug: string) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
}
