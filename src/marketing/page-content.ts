import type { MarketingBuyerStage, MarketingLink, MarketingPageType, MarketingPrimaryCta } from "./link-catalog";

export interface MarketingPageNarrative {
  definition: string;
  targetUser: string;
  jobToBeDone: string;
  evidenceBoundary: string;
  benefits: Array<{
    title: string;
    body: string;
  }>;
  workflow: Array<{
    title: string;
    body: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

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
  generate_launch_card: "Generate free repo brief",
  request_checklist: "Request checklist",
  request_prompt_template: "Request prompt template",
  start_free_tool: "Start free tool",
  request_template: "Request template",
  generate_similar_card: "Generate similar card",
  generate_comparison_card: "Generate comparison card",
  request_demo: "Request demo",
  request_partnership: "Request partnership",
  request_launch_package: "Request full launch package",
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
  request_launch_package: "/contact?intent=launch-package",
};

const pageNarratives: Partial<Record<string, MarketingPageNarrative>> = {
  github_repo_to_launch_package: {
    definition:
      "A GitHub repo to launch package workflow turns repository evidence into a reviewable launch brief, README improvements, social copy, deck structure, outreach drafts, and visual explainer assets for a cold-start technical product.",
    targetUser: "AI project builders, open-source maintainers, indie technical founders, and DevRel teams.",
    jobToBeDone:
      "When a technical project is ready to share, help the team explain the repo clearly across launch channels without rewriting the same story by hand.",
    evidenceBoundary:
      "Claims should come from repository metadata, README content, official links, generated quality reports, or explicit user input.",
    benefits: [
      {
        title: "Start from one repository URL",
        body: "Use the repo as the intake surface instead of asking builders to assemble a blank marketing brief.",
      },
      {
        title: "Keep launch claims source-backed",
        body: "Preserve the difference between repository evidence, user-provided facts, and hypotheses that still need review.",
      },
      {
        title: "Package the same story for every channel",
        body: "Create aligned README, social, deck, outreach, and visual explanation assets from the same project brief.",
      },
      {
        title: "Help strangers understand the project fast",
        body: "Translate technical workflow, architecture, and value into launch-ready explanations for users who have not read the code.",
      },
    ],
    workflow: [
      {
        title: "Paste a public GitHub repo",
        body: "QuickFork normalizes the owner, repo, URL, README, metadata, topics, and identity assets.",
      },
      {
        title: "Build a source-backed brief",
        body: "The pipeline extracts project purpose, audience hypotheses, workflows, proof limits, and launch angles.",
      },
      {
        title: "Generate launch assets",
        body: "The package drafts README copy, social posts, deck outline, outreach copy, visual prompts, images, and quality reports.",
      },
      {
        title: "Review before publishing",
        body: "Builders inspect the artifact manifest, edit unsupported language, and export only the assets that match their launch.",
      },
    ],
    faqs: [
      {
        question: "What is a GitHub repo to launch package?",
        answer:
          "It is a collection of source-backed launch materials generated from one repository URL: brief, README copy, social posts, deck outline, outreach drafts, visual prompts, generated images, and review artifacts.",
      },
      {
        question: "How is this different from asking ChatGPT to write launch copy?",
        answer:
          "QuickFork provides a structured workflow around repository evidence, channel outputs, visual explanation, quality reports, and launch review instead of relying on a blank chat prompt.",
      },
      {
        question: "Who should use this first?",
        answer:
          "The first target users are AI project builders, open-source maintainers, indie technical founders, and DevRel teams preparing a public launch from a working repo.",
      },
      {
        question: "Does QuickFork publish the generated assets automatically?",
        answer:
          "No. QuickFork produces reviewable launch drafts. A human should approve claims, visuals, pricing, examples, and public publishing decisions.",
      },
    ],
  },
};

export function getMarketingPageTitle(link: MarketingLink) {
  return `${formatMarketingLabel(link.primaryKeyword)} | QuickFork`;
}

export function getMarketingPageHeadline(link: MarketingLink) {
  if (link.intentCluster === "github_repo_to_launch_package") {
    return "GitHub Repo To Launch Package for cold-start technical launches.";
  }

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
  if (link.intentCluster === "github_repo_to_launch_package") {
    return "QuickFork maps github repo to launch package demand into source-backed README, social, deck, outreach, and visual explainer assets for cold-start technical launches.";
  }

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

export function getMarketingPageNarrative(link: MarketingLink): MarketingPageNarrative {
  return (
    pageNarratives[link.intentCluster] ?? {
      definition: getMarketingPageDescription(link),
      targetUser: formatMarketingLabel(link.persona.replace(/_/g, " ")),
      jobToBeDone: "Move from a specific search or campaign intent into one measurable QuickFork product action.",
      evidenceBoundary:
        "Keep the page tied to repository evidence, route metadata, and explicit user input. Do not add unverified performance claims.",
      benefits: [
        {
          title: "Capture a precise intent",
          body: `This route targets ${link.primaryKeyword} with a canonical URL and one primary CTA.`,
        },
        {
          title: "Keep claims reviewable",
          body: "The page frames QuickFork as a source-backed launch workflow instead of a generic AI content generator.",
        },
        {
          title: "Connect traffic to activation",
          body: "The CTA routes visitors back to the generator, lead capture, or a bottom-funnel follow-up action.",
        },
      ],
      workflow: [
        {
          title: "Match the query",
          body: `Answer the visitor's ${formatMarketingLabel(link.intentCluster)} intent with clear product language.`,
        },
        {
          title: "Explain the source-backed workflow",
          body: "Show how repo evidence becomes a brief, prompt, visual asset, report, and manifest.",
        },
        {
          title: "Route to one next action",
          body: `Ask the visitor to ${getMarketingPrimaryCtaLabel(link).toLowerCase()}.`,
        },
      ],
      faqs: [
        {
          question: `Who is this ${pageTypeLabels[link.pageType].toLowerCase()} page for?`,
          answer: `It is for ${formatMarketingLabel(link.persona.replace(/_/g, " "))} visitors evaluating ${link.primaryKeyword}.`,
        },
        {
          question: "What proof can this page claim?",
          answer: "Only repository-grounded workflow claims are safe until interviews, analytics, or customer evidence proves more.",
        },
      ],
    }
  );
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
