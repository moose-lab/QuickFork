export const marketingLinkStatuses = ["draft", "ready", "published"] as const;
export const marketingFunnelStages = ["top", "middle", "bottom"] as const;
export const marketingBuyerStages = ["awareness", "consideration", "decision", "implementation"] as const;
export const marketingPageTypes = [
  "product",
  "use_case",
  "resource",
  "tool",
  "template",
  "example",
  "compare",
  "contact",
] as const;
export const marketingPrimaryCtas = [
  "generate_launch_card",
  "request_checklist",
  "request_prompt_template",
  "start_free_tool",
  "request_template",
  "generate_similar_card",
  "generate_comparison_card",
  "request_demo",
  "request_partnership",
  "request_launch_package",
] as const;

export type MarketingLinkStatus = (typeof marketingLinkStatuses)[number];
export type MarketingFunnelStage = (typeof marketingFunnelStages)[number];
export type MarketingBuyerStage = (typeof marketingBuyerStages)[number];
export type MarketingPageType = (typeof marketingPageTypes)[number];
export type MarketingPrimaryCta = (typeof marketingPrimaryCtas)[number];

export interface MarketingUtm {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export interface MarketingLink {
  status: MarketingLinkStatus;
  funnelStage: MarketingFunnelStage;
  buyerStage: MarketingBuyerStage;
  persona: string;
  intentCluster: string;
  pageType: MarketingPageType;
  slug: string;
  canonicalUrl: string;
  primaryKeyword: string;
  primaryCta: MarketingPrimaryCta;
  crmCampaign: string;
  utm: MarketingUtm;
}

const crawlablePageTypes = new Set<MarketingPageType>([
  "product",
  "use_case",
  "resource",
  "tool",
  "template",
  "example",
  "compare",
]);

export const marketingLinks: readonly MarketingLink[] = [
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "open_source_maintainer",
    intentCluster: "github_repo_to_launch_package",
    pageType: "product",
    slug: "github-repo-to-launch-package",
    canonicalUrl: "https://seekersai.com/product/github-repo-to-launch-package",
    primaryKeyword: "github repo to launch package",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_seo_foundation",
    utm: {
      source: "google",
      medium: "organic",
      campaign: "seo_foundation",
      content: "product_category",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "product_marketer",
    intentCluster: "source_backed_launch_assets",
    pageType: "product",
    slug: "source-backed-launch-assets",
    canonicalUrl: "https://seekersai.com/product/source-backed-launch-assets",
    primaryKeyword: "source backed launch assets",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_ai_visibility",
    utm: {
      source: "perplexity",
      medium: "ai_search",
      campaign: "ai_visibility",
      content: "source_backed_assets",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "design_lead",
    intentCluster: "readme_marketing_cards",
    pageType: "product",
    slug: "readme-marketing-cards",
    canonicalUrl: "https://seekersai.com/product/readme-marketing-cards",
    primaryKeyword: "readme marketing cards",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_readme_assets",
    utm: {
      source: "google",
      medium: "organic",
      campaign: "readme_assets",
      content: "product_page",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "open_source_maintainer",
    intentCluster: "open_source_launch",
    pageType: "use_case",
    slug: "open-source-launch",
    canonicalUrl: "https://seekersai.com/use-cases/open-source-launch",
    primaryKeyword: "open source launch",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_open_source_launch",
    utm: {
      source: "github",
      medium: "referral",
      campaign: "open_source_launch",
      content: "repo_footer",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "ai_project_builder",
    intentCluster: "ai_project_launch",
    pageType: "use_case",
    slug: "ai-project-launch",
    canonicalUrl: "https://seekersai.com/use-cases/ai-project-launch",
    primaryKeyword: "ai project launch",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_ai_project_launch",
    utm: {
      source: "perplexity",
      medium: "ai_search",
      campaign: "ai_project_launch",
      content: "use_case_page",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "developer_advocate",
    intentCluster: "devrel_workflow",
    pageType: "use_case",
    slug: "devrel-launch-workflow",
    canonicalUrl: "https://seekersai.com/use-cases/devrel-launch-workflow",
    primaryKeyword: "devrel launch workflow",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_devrel_workflow",
    utm: {
      source: "linkedin",
      medium: "organic_social",
      campaign: "devrel_workflow",
      content: "founder_post",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "awareness",
    persona: "open_source_maintainer",
    intentCluster: "open_source_launch_checklist",
    pageType: "resource",
    slug: "open-source-launch-checklist",
    canonicalUrl: "https://seekersai.com/resources/open-source-launch-checklist",
    primaryKeyword: "open source launch checklist",
    primaryCta: "request_checklist",
    crmCampaign: "2026_q2_launch_checklist",
    utm: {
      source: "x",
      medium: "organic_social",
      campaign: "launch_checklist",
      content: "thread_cta",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "awareness",
    persona: "open_source_maintainer",
    intentCluster: "github_project_marketing_card",
    pageType: "resource",
    slug: "github-project-marketing-card-guide",
    canonicalUrl: "https://seekersai.com/resources/github-project-marketing-card-guide",
    primaryKeyword: "github project marketing card",
    primaryCta: "generate_launch_card",
    crmCampaign: "2026_q2_repo_to_card_demo",
    utm: {
      source: "github",
      medium: "referral",
      campaign: "repo_to_card_demo",
      content: "readme_badge",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "consideration",
    persona: "founder",
    intentCluster: "github_repo_launch_demand_map",
    pageType: "resource",
    slug: "github-repo-launch-demand-map",
    canonicalUrl: "https://seekersai.com/resources/github-repo-launch-demand-map",
    primaryKeyword: "github repo launch demand",
    primaryCta: "request_launch_package",
    crmCampaign: "2026_q2_launch_demand_map",
    utm: {
      source: "product_hunt",
      medium: "directory",
      campaign: "launch_demand_map",
      content: "demand_map",
    },
  },
  {
    status: "published",
    funnelStage: "top",
    buyerStage: "implementation",
    persona: "design_lead",
    intentCluster: "readme_cover_prompt",
    pageType: "resource",
    slug: "readme-cover-prompt-guide",
    canonicalUrl: "https://seekersai.com/resources/readme-cover-prompt-guide",
    primaryKeyword: "readme cover prompt guide",
    primaryCta: "request_prompt_template",
    crmCampaign: "2026_q2_readme_cover_prompt",
    utm: {
      source: "reddit",
      medium: "community",
      campaign: "readme_cover_prompt",
      content: "comment_link",
    },
  },
  {
    status: "published",
    funnelStage: "middle",
    buyerStage: "consideration",
    persona: "founder",
    intentCluster: "launch_readiness_score",
    pageType: "tool",
    slug: "github-repo-launch-readiness-score",
    canonicalUrl: "https://seekersai.com/tools/github-repo-launch-readiness-score",
    primaryKeyword: "github repo launch readiness score",
    primaryCta: "start_free_tool",
    crmCampaign: "2026_q2_free_tool_launch",
    utm: {
      source: "product_hunt",
      medium: "directory",
      campaign: "free_tool_launch",
      content: "listing_cta",
    },
  },
  {
    status: "published",
    funnelStage: "middle",
    buyerStage: "implementation",
    persona: "founder",
    intentCluster: "github_launch_announcement",
    pageType: "template",
    slug: "github-launch-announcement",
    canonicalUrl: "https://seekersai.com/templates/github-launch-announcement",
    primaryKeyword: "github launch announcement template",
    primaryCta: "request_template",
    crmCampaign: "2026_q2_launch_templates",
    utm: {
      source: "newsletter",
      medium: "email",
      campaign: "launch_templates",
      content: "template_link",
    },
  },
  {
    status: "published",
    funnelStage: "middle",
    buyerStage: "decision",
    persona: "open_source_maintainer",
    intentCluster: "qwenlm_flashqla_launch_card",
    pageType: "example",
    slug: "qwenlm-flashqla-launch-card",
    canonicalUrl: "https://seekersai.com/examples/qwenlm-flashqla-launch-card",
    primaryKeyword: "qwenlm flashqla launch card",
    primaryCta: "generate_similar_card",
    crmCampaign: "2026_q2_example_showcase",
    utm: {
      source: "github",
      medium: "referral",
      campaign: "example_showcase",
      content: "source_repo_link",
    },
  },
  {
    status: "published",
    funnelStage: "middle",
    buyerStage: "decision",
    persona: "research_engineer",
    intentCluster: "deepseek_twvp_launch_card",
    pageType: "example",
    slug: "deepseek-twvp-launch-card",
    canonicalUrl: "https://seekersai.com/examples/deepseek-twvp-launch-card",
    primaryKeyword: "deepseek twvp launch card",
    primaryCta: "generate_similar_card",
    crmCampaign: "2026_q2_example_showcase",
    utm: {
      source: "linkedin",
      medium: "organic_social",
      campaign: "example_showcase",
      content: "visual_demo",
    },
  },
  {
    status: "published",
    funnelStage: "bottom",
    buyerStage: "decision",
    persona: "founder",
    intentCluster: "chatgpt_launch_copy_compare",
    pageType: "compare",
    slug: "chatgpt-open-source-launch-copy",
    canonicalUrl: "https://seekersai.com/compare/chatgpt-open-source-launch-copy",
    primaryKeyword: "chatgpt open source launch copy",
    primaryCta: "generate_comparison_card",
    crmCampaign: "2026_q2_alternative_pages",
    utm: {
      source: "google",
      medium: "organic",
      campaign: "alternative_pages",
      content: "chatgpt_compare",
    },
  },
  {
    status: "published",
    funnelStage: "bottom",
    buyerStage: "decision",
    persona: "design_lead",
    intentCluster: "canva_readme_banner_compare",
    pageType: "compare",
    slug: "canva-readme-banner-generator",
    canonicalUrl: "https://seekersai.com/compare/canva-readme-banner-generator",
    primaryKeyword: "canva readme banner generator",
    primaryCta: "generate_comparison_card",
    crmCampaign: "2026_q2_alternative_pages",
    utm: {
      source: "google",
      medium: "organic",
      campaign: "alternative_pages",
      content: "canva_compare",
    },
  },
  {
    status: "draft",
    funnelStage: "bottom",
    buyerStage: "decision",
    persona: "founder",
    intentCluster: "founder_led_sales",
    pageType: "contact",
    slug: "demo",
    canonicalUrl: "https://seekersai.com/contact?intent=demo",
    primaryKeyword: "quickfork demo",
    primaryCta: "request_demo",
    crmCampaign: "2026_q2_founder_led_sales",
    utm: {
      source: "linkedin",
      medium: "organic_social",
      campaign: "founder_led_sales",
      content: "demo_cta",
    },
  },
  {
    status: "draft",
    funnelStage: "bottom",
    buyerStage: "decision",
    persona: "developer_advocate",
    intentCluster: "devrel_partnerships",
    pageType: "contact",
    slug: "partnership",
    canonicalUrl: "https://seekersai.com/contact?intent=partnership",
    primaryKeyword: "quickfork partnership",
    primaryCta: "request_partnership",
    crmCampaign: "2026_q2_devrel_partnerships",
    utm: {
      source: "partner",
      medium: "referral",
      campaign: "devrel_partnerships",
      content: "partner_intro",
    },
  },
  {
    status: "draft",
    funnelStage: "bottom",
    buyerStage: "decision",
    persona: "founder",
    intentCluster: "full_launch_package",
    pageType: "contact",
    slug: "launch-package",
    canonicalUrl: "https://seekersai.com/contact?intent=launch-package",
    primaryKeyword: "full launch package",
    primaryCta: "request_launch_package",
    crmCampaign: "2026_q2_full_launch_package",
    utm: {
      source: "quickfork",
      medium: "product",
      campaign: "full_launch_package",
      content: "artifact_review_cta",
    },
  },
] as const;

export const publishedMarketingLinks = marketingLinks.filter((link) => link.status === "published");

export const marketingPageLinks = marketingLinks.filter((link) => crawlablePageTypes.has(link.pageType));

export const contactMarketingLinks = marketingLinks.filter((link) => link.pageType === "contact");

export const sitemapMarketingLinks = publishedMarketingLinks.filter((link) => crawlablePageTypes.has(link.pageType));

export function getMarketingLinkBySlug(slug: string) {
  return marketingLinks.find((link) => link.slug === slug);
}

export function getMarketingLinkByPath(pathname: string) {
  const normalizedPath = normalizePath(pathname);

  return marketingPageLinks.find((link) => getMarketingPath(link) === normalizedPath);
}

export function getContactMarketingLinkByIntent(intent: string | null) {
  const normalizedIntent = intent?.trim() || "demo";

  return contactMarketingLinks.find((link) => new URL(link.canonicalUrl).searchParams.get("intent") === normalizedIntent);
}

export function getMarketingPath(link: MarketingLink) {
  const url = new URL(link.canonicalUrl);
  return `${url.pathname}${url.search}`;
}

export function getDistributedMarketingUrl(link: MarketingLink) {
  const url = new URL(link.canonicalUrl);
  url.searchParams.set("utm_source", link.utm.source);
  url.searchParams.set("utm_medium", link.utm.medium);
  url.searchParams.set("utm_campaign", link.utm.campaign);
  url.searchParams.set("utm_content", link.utm.content);
  return url.toString();
}

function normalizePath(pathname: string) {
  const path = pathname.split(/[?#]/)[0] || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
}
