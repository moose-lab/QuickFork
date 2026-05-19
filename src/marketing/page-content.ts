import type { MarketingBuyerStage, MarketingLink, MarketingPageType, MarketingPrimaryCta } from "./link-catalog";

const pageTypeLabels: Record<MarketingPageType, string> = {
  product: "Product",
  use_case: "Use case",
  resource: "Resource",
  tool: "Tool",
  template: "Template",
  example: "Example",
  compare: "Comparison",
  contact: "Contact",
};

const buyerStageLabels: Record<MarketingBuyerStage, string> = {
  awareness: "Awareness",
  consideration: "Consideration",
  decision: "Decision",
  implementation: "Implementation",
};

const primaryCtaLabels: Record<MarketingPrimaryCta, string> = {
  generate_launch_card: "Generate launch card",
  request_checklist: "Request checklist",
  request_prompt_template: "Request prompt template",
  start_free_tool: "Start free tool",
  request_template: "Request template",
  generate_similar_card: "Generate similar card",
  generate_comparison_card: "Generate comparison card",
  request_demo: "Request demo",
  request_partnership: "Request partnership",
};

const primaryCtaHrefs: Record<MarketingPrimaryCta, string> = {
  generate_launch_card: "/#hero",
  request_checklist: "/#studio",
  request_prompt_template: "/#studio",
  start_free_tool: "/#studio",
  request_template: "/#studio",
  generate_similar_card: "/#hero",
  generate_comparison_card: "/#hero",
  request_demo: "/contact?intent=demo",
  request_partnership: "/contact?intent=partnership",
};

export function getMarketingPageTitle(link: MarketingLink) {
  return `${formatMarketingLabel(link.primaryKeyword)} | QuickFork`;
}

export function getMarketingPageHeadline(link: MarketingLink) {
  const keyword = formatMarketingLabel(link.primaryKeyword);

  switch (link.pageType) {
    case "product":
      return `${keyword} for source-backed repository launch assets.`;
    case "use_case":
      return `${keyword} without rewriting your repo story from scratch.`;
    case "resource":
      return `${keyword} for teams preparing a public project launch.`;
    case "tool":
      return `${keyword} for pre-launch repository reviews.`;
    case "template":
      return `${keyword} for faster repository launch drafts.`;
    case "example":
      return `${keyword} as a traceable QuickFork showcase route.`;
    case "compare":
      return `${keyword} with repository evidence in the loop.`;
    case "contact":
      return `${keyword} for founder-led follow-up.`;
  }
}

export function getMarketingPageDescription(link: MarketingLink) {
  const audience = formatMarketingLabel(link.persona.replace(/_/g, " "));
  const pageType = pageTypeLabels[link.pageType].toLowerCase();

  return `QuickFork maps ${link.primaryKeyword} into a source-backed ${pageType} path for ${audience}, with campaign attribution and a clear next action.`;
}

export function getMarketingPageKicker(link: MarketingLink) {
  return `${pageTypeLabels[link.pageType]} / ${buyerStageLabels[link.buyerStage]} / ${link.funnelStage.toUpperCase()} funnel`;
}

export function getMarketingPrimaryCtaLabel(link: MarketingLink) {
  return primaryCtaLabels[link.primaryCta];
}

export function getMarketingPrimaryCtaHref(link: MarketingLink) {
  return primaryCtaHrefs[link.primaryCta];
}

export function getMarketingPageTypeLabel(link: MarketingLink) {
  return pageTypeLabels[link.pageType];
}

export function formatMarketingLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .replace(/\bGithub\b/g, "GitHub")
    .replace(/\bChatgpt\b/g, "ChatGPT")
    .replace(/\bDevrel\b/g, "DevRel")
    .replace(/\bReadme\b/g, "README")
    .replace(/\bQwenlm\b/g, "QwenLM")
    .replace(/\bFlashqla\b/g, "FlashQLA")
    .replace(/\bDeepseek\b/g, "DeepSeek")
    .replace(/\bTwvp\b/g, "TWVP")
    .replace(/\bCanva\b/g, "Canva");
}
