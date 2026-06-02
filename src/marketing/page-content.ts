import type { MarketingBuyerStage, MarketingLink, MarketingPageType, MarketingPrimaryCta } from "./link-catalog";
import { launchReadinessScorecard, type LaunchReadinessScorecard } from "./launch-readiness-score";
import { visualExplainerPackage, type VisualExplainerPackage } from "./visual-explainer-package";

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
  sourceNotes?: Array<{
    label: string;
    body: string;
    url: string;
  }>;
  lastUpdated?: string;
  scorecard?: LaunchReadinessScorecard;
  visualPackage?: VisualExplainerPackage;
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
  ai_project_launch: {
    definition:
      "A source-backed launch package for an AI repository turns README evidence, model or workflow context, benchmarks, caveats, visuals, and distribution copy into reviewable materials for a cold-start launch. It helps builders explain what the project does before audiences read the code.",
    targetUser: "AI project builders and open-source AI maintainers preparing a public launch.",
    jobToBeDone:
      "When an AI repo is ready to share, help the builder explain the model, system, benchmark, or workflow clearly across README, social, deck, and outreach surfaces.",
    evidenceBoundary:
      "AI project launch claims should come from README evidence, repository metadata, linked docs, official benchmarks, generated quality reports, or explicit user input. If evidence is thin, the copy should label claims as hypotheses.",
    benefits: [
      {
        title: "Turn repo evidence into a launch story",
        body: "Compress README, topics, workflow notes, and repo metadata into a story that non-maintainers can scan before reading implementation details.",
      },
      {
        title: "Explain the technical value without hype",
        body: "Frame model, agent, kernel, benchmark, or developer-workflow claims as reviewable launch copy instead of unsupported AI marketing language.",
      },
      {
        title: "Create channel-specific launch assets",
        body: "Draft README sections, social posts, pitch-deck flow, outreach copy, and visual explainer prompts from the same source-backed brief.",
      },
      {
        title: "Keep visual interpretation tied to the repo",
        body: "Use story maps, workflow diagrams, GitHub identity assets, and source references so visuals explain the project rather than decorate it.",
      },
    ],
    workflow: [
      {
        title: "Paste the AI repository URL",
        body: "QuickFork reads the public repo, README, topics, metadata, and identity signals without requiring a blank marketing brief.",
      },
      {
        title: "Map source, audience, workflow, proof, and launch",
        body: "The launch brief and story map separate what the repo proves from what still needs human review.",
      },
      {
        title: "Generate README, social, deck, and outreach drafts",
        body: "Each artifact stays aligned to the same project story so the launch does not fragment across channels.",
      },
      {
        title: "Review before publishing",
        body: "Builders approve claims, visuals, benchmark language, pricing, and examples before any public launch material is used.",
      },
    ],
    faqs: [
      {
        question: "What does an AI project launch page need to explain?",
        answer:
          "It should explain the repo's purpose, target user, technical workflow, evidence limits, visual story, README path, social angle, deck outline, and outreach message without inventing benchmarks, customers, rankings, or revenue.",
      },
      {
        question: "Who is the AI project launch use case for?",
        answer:
          "It is for AI project builders, open-source AI maintainers, research engineers, technical founders, and DevRel teams preparing a public launch from a working repository.",
      },
      {
        question: "How does QuickFork reduce launch prep work for AI projects?",
        answer:
          "QuickFork starts from one GitHub repository URL, builds a source-backed brief, creates a story map, and drafts README, social, deck, outreach, and visual prompt assets for review.",
      },
      {
        question: "Can QuickFork claim benchmark improvements for an AI repo?",
        answer:
          "Only when the benchmark appears in repository evidence, linked official docs, generated quality reports, or explicit user input. Otherwise QuickFork should avoid or label the claim as unvalidated.",
      },
    ],
  },
  github_repo_visual_explainer: {
    definition:
      "A GitHub repo visual explainer is a source-backed visual package that turns repository evidence into a project story map, README hero card direction, GitHub social preview, and deck-ready explainer slide before teams publish launch materials.",
    targetUser: "AI project builders, DevRel operators, open-source maintainers, and design/product leads preparing a public repository launch.",
    jobToBeDone:
      "When a technical repo is hard to understand at first glance, help the builder turn README evidence, audience context, workflow, and proof into visual assets that make the project easier to scan before the full launch package is generated.",
    evidenceBoundary:
      "Visual explainer claims should come from the repository, official identity assets, public launch guidance, or explicit human input. The page should not promise rankings, revenue, launch outcomes, viral sharing, or autonomous publishing.",
    benefits: [
      {
        title: "Make the project scannable before the README",
        body: "Use a story map and hero-card direction to explain what the repo does, who it helps, how it works, and what proof needs review.",
      },
      {
        title: "Connect visual assets to launch channels",
        body: "Plan README, GitHub social preview, deck, and Product Hunt gallery directions from the same source-backed project brief.",
      },
      {
        title: "Keep identity and proof reviewable",
        body: "Prefer official repo assets, GitHub avatars, source references, and uncertainty labels instead of random logos or invented benchmarks.",
      },
      {
        title: "Measure visual understanding as activation",
        body: "Track whether users open previews, copy story maps, download visual exports, and continue into the generation flow.",
      },
    ],
    workflow: [
      {
        title: "Read the repo evidence",
        body: "Start with README, metadata, topics, linked docs, official identity assets, and any explicit user notes instead of a blank prompt.",
      },
      {
        title: "Build a project story map",
        body: "Map source, audience, workflow, proof, and launch context so the visual direction explains the project rather than decorating it.",
      },
      {
        title: "Draft visual launch surfaces",
        body: "Turn the same source-backed story into README hero card, GitHub social preview, Product Hunt gallery, and deck-ready explainer directions.",
      },
      {
        title: "Generate and review assets",
        body: "Use the studio to generate launch materials, then review visual identity, unsupported claims, and channel fit before public use.",
      },
    ],
    faqs: [
      {
        question: "What is a GitHub repo visual explainer?",
        answer:
          "It is a source-backed visual package that turns a repository into a story map, README hero card direction, GitHub social preview, and deck-ready explainer slide so people can understand the project faster.",
      },
      {
        question: "Who should use a repo visual explainer?",
        answer:
          "It is for AI project builders, open-source maintainers, DevRel teams, founders, and design/product leads who need visual launch assets without inventing logos, customer proof, or performance claims.",
      },
      {
        question: "How does QuickFork keep the visuals source-backed?",
        answer:
          "QuickFork starts from repository evidence and official identity assets, then labels visual direction as reviewable launch material instead of final public proof.",
      },
      {
        question: "Does a visual explainer guarantee more traffic or launch success?",
        answer:
          "No. The explainer is an activation and review surface. Production analytics and interviews are still needed before treating it as validated demand.",
      },
    ],
    sourceNotes: [
      {
        label: "GitHub Docs About READMEs",
        body: "GitHub positions the README as the project explanation surface, which makes README hero direction a launch-readiness input.",
        url: "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      },
      {
        label: "GitHub Docs social preview",
        body: "GitHub documents repository social preview customization, making shared-link visuals a concrete launch surface.",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      },
      {
        label: "Open Source Guides finding users",
        body: "Open Source Guides ties project growth to audience discovery and feedback, which the story map turns into visual context.",
        url: "https://opensource.guide/finding-users/",
      },
      {
        label: "Product Hunt launch guide",
        body: "Product Hunt launch preparation makes gallery assets, maker context, tagline, and launch-day copy part of visual launch work.",
        url: "https://www.producthunt.com/launch/preparing-for-launch",
      },
    ],
    lastUpdated: "June 2, 2026",
    visualPackage: visualExplainerPackage,
  },
  repository_launch_package_pilot: {
    definition:
      "A repository launch package pilot is a source-backed request path for teams that need a complete launch package across README, social, deck, outreach, visual explainer, review, and measurement work before QuickFork publishes fixed pricing.",
    targetUser: "Founders, open-source maintainers, DevRel operators, and design/product leads with a real launch deadline.",
    jobToBeDone:
      "When a free repo brief or visual explainer is useful but incomplete for a launch deadline, help the team request a full package review without pretending pricing or demand is already validated.",
    evidenceBoundary:
      "This page collects paid-intent learning. It should not publish prices, promise launch outcomes, claim ranking lift, imply automated publishing, or describe willingness to pay as proven.",
    benefits: [
      {
        title: "Request the package after proof of need",
        body: "Use the pilot request when a repo brief, story map, or launch readiness score shows that the team needs channel-specific assets and human review.",
      },
      {
        title: "Package every launch surface together",
        body: "Frame README, social, deck, outreach, visual explainer, review, and measurement work as one source-backed package instead of scattered prompts.",
      },
      {
        title: "Do not publish prices yet",
        body: "Keep the public offer focused on qualification and scope while pricing research, pilot requests, and interviews determine the paid package shape.",
      },
      {
        title: "Preserve the evidence boundary",
        body: "Keep repository facts, explicit user input, uncertainty labels, and human review ahead of public claims or launch distribution.",
      },
    ],
    workflow: [
      {
        title: "Start with a public repo or existing brief",
        body: "Use the repository URL, README evidence, generated brief, visual explainer, or readiness score to scope what the launch package needs.",
      },
      {
        title: "Choose the launch surfaces",
        body: "Identify whether the pilot needs README patches, social posts, Product Hunt copy, deck outline, outreach sequence, visual directions, or measurement setup.",
      },
      {
        title: "Request a scoped package",
        body: "Send the request through the launch-package contact intent so QuickFork can qualify urgency, repo fit, review needs, and source evidence.",
      },
      {
        title: "Use the request as monetization evidence",
        body: "Compare pilot requests with route views, CTA clicks, artifact exports, generation starts, and interviews before treating this as validated demand.",
      },
    ],
    faqs: [
      {
        question: "What does the repository launch package pilot include?",
        answer:
          "The pilot request scopes a source-backed package for README, social, deck, outreach, visual explainer, review, and measurement work from one repository or generated brief.",
      },
      {
        question: "Who should request a full launch package?",
        answer:
          "Founders, maintainers, DevRel operators, and design/product leads should request it when they have a real launch deadline, repeated launch work, or a review need that the free repo brief cannot cover.",
      },
      {
        question: "Why not publish fixed pricing now?",
        answer:
          "QuickFork needs pricing research, pilot qualification, package scope, and willingness-to-pay interviews before public price points are credible.",
      },
      {
        question: "Does the pilot replace human review?",
        answer:
          "No. It packages source-backed launch materials for review. Humans still approve claims, visuals, examples, pricing language, and public publishing choices.",
      },
    ],
    lastUpdated: "June 2, 2026",
  },
  open_source_launch_checklist: {
    definition:
      "An open-source launch checklist helps maintainers turn a public GitHub repository into source-backed README, social preview, Product Hunt, deck, and outreach launch materials while keeping every claim tied to repo evidence, public context, or explicit human input.",
    targetUser: "Open-source maintainers and AI/devtool builders preparing a public repository launch.",
    jobToBeDone:
      "When a project is close to launch, help the maintainer check the README story, repository preview, audience language, launch-channel assets, and post-launch learning loop before asking people to try the repo.",
    evidenceBoundary:
      "This checklist uses public launch guidance as discovery evidence. It does not prove QuickFork demand, pricing, ranking lift, revenue, customer count, Product Hunt success, or conversion lift.",
    benefits: [
      {
        title: "README trust before launch assets",
        body: "Use the README as the source of truth for what the project does, who it serves, what proof exists, and which claims still need review.",
      },
      {
        title: "Repository preview is a real launch surface",
        body: "Treat GitHub social preview imagery as part of the launch package because shared repository links need a clear visual explanation.",
      },
      {
        title: "Audience language before scaled promotion",
        body: "Map the maintainer's target users, communities, feedback requests, and launch questions before publishing generic AI marketing copy.",
      },
      {
        title: "Channel assets from one repo brief",
        body: "Convert the same source-backed project story into Product Hunt copy, deck flow, outreach snippets, and social posts for review.",
      },
      {
        title: "Post-launch learning stays measurable",
        body: "Keep the checklist connected to CTA, resource request, repo brief generation, interviews, and follow-up evidence instead of assuming the page is validated.",
      },
    ],
    workflow: [
      {
        title: "README trust pass",
        body: "Confirm the README explains the problem, target user, workflow, setup path, proof limits, and source-backed claims before creating external assets.",
      },
      {
        title: "Repository preview pass",
        body: "Check whether the repo has a social preview, visible project identity, and a shareable explanation for people who first see the GitHub link.",
      },
      {
        title: "Audience and feedback pass",
        body: "Name the communities, likely users, buyer triggers, and questions to ask so the launch is a validation loop, not a one-way announcement.",
      },
      {
        title: "Launch asset pass",
        body: "Draft Product Hunt copy, README/social card direction, deck outline, outreach copy, and social posts from the same source-backed brief.",
      },
      {
        title: "Post-launch learning pass",
        body: "Track checklist requests, repo brief starts, generated packages, downloads, follow-up replies, and interviews before scaling the content program.",
      },
    ],
    faqs: [
      {
        question: "What is an open-source launch checklist?",
        answer:
          "It is a source-backed pre-launch review that checks README trust, repository preview, audience feedback, launch assets, and post-launch learning before an open-source or AI/devtool repo is promoted publicly.",
      },
      {
        question: "Who should use this checklist?",
        answer:
          "It is for open-source maintainers and AI/devtool builders preparing a public GitHub repository launch who need credible README, social preview, Product Hunt, deck, outreach, and follow-up materials.",
      },
      {
        question: "What can QuickFork generate from the checklist?",
        answer:
          "QuickFork can turn one repository URL into a source-backed launch brief, README checklist, social copy, deck outline, outreach draft, visual prompt, quality report, and artifact manifest for human review.",
      },
      {
        question: "What remains unvalidated on this page?",
        answer:
          "The page is still a hypothesis until production analytics, lead quality, checklist requests, repo brief generation, interviews, and AI-search visibility show which maintainers actually use it.",
      },
    ],
    sourceNotes: [
      {
        label: "Open Source Guides finding users",
        body: "Open Source Guides frames finding users as audience, messaging, community, and feedback work that starts before broad promotion.",
        url: "https://opensource.guide/finding-users/",
      },
      {
        label: "GitHub Docs About READMEs",
        body: "GitHub positions READMEs as the first place people look to understand a repository, making README trust the first launch-readiness pass.",
        url: "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      },
      {
        label: "GitHub Docs social preview",
        body: "GitHub documents repository social preview customization, which makes preview imagery a concrete launch surface for shared repo links.",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      },
      {
        label: "Product Hunt launch guide",
        body: "Product Hunt launch preparation depends on checklist steps, maker-facing copy, gallery assets, first-comment context, and launch-day choices.",
        url: "https://www.producthunt.com/launch/preparing-for-launch",
      },
    ],
    lastUpdated: "June 2, 2026",
  },
  github_repo_launch_demand_map: {
    definition:
      "A GitHub repo launch demand map turns public launch-prep sources into a priority map for source-backed launch packages. It links repository social previews, open-source audience work, Product Hunt assets, and community launch prep to QuickFork surfaces and paid-intent signals.",
    targetUser: "Open-source maintainers, AI project builders, indie founders, DevRel operators, and studios preparing repository launch assets.",
    jobToBeDone:
      "When a technical team is deciding what launch assets to build first, help them see which public launch requirements map to README, social, deck, outreach, and visual package work.",
    evidenceBoundary:
      "This page uses public sources as discovery evidence only. It does not prove QuickFork demand, pricing, ranking lift, revenue, customer count, or conversion lift.",
    benefits: [
      {
        title: "Product Hunt launch assets",
        body: "Map maker-facing launch requirements into a package that can include tagline, gallery image prompts, first-comment draft, pricing-status language, and launch checklist.",
      },
      {
        title: "GitHub social preview",
        body: "Treat repository preview images as a concrete visual asset need instead of a decorative afterthought.",
      },
      {
        title: "Open Source Guides",
        body: "Keep audience, messaging, and feedback loops ahead of scaled content so launch assets do not outrun source evidence.",
      },
      {
        title: "Community launch prep",
        body: "Use community language around checklists, screenshots, first comments, and concise positioning as interview prompts before public packaging decisions.",
      },
    ],
    workflow: [
      {
        title: "Collect public launch requirements",
        body: "Start with official platform guidance and recent community launch-prep language instead of broad AI marketing assumptions.",
      },
      {
        title: "Map each requirement to a QuickFork surface",
        body: "Connect demand signals to free repo brief, story map, README/social/deck/outreach exports, visual preview assets, or full launch package requests.",
      },
      {
        title: "Score paid-intent signals",
        body: "Prioritize export requests, launch deadlines, human review, batch packages, and white-label needs before publishing prices.",
      },
      {
        title: "Validate before scaling",
        body: "Use production CTA, contact, artifact export, and interview evidence before treating the demand map as a final product strategy.",
      },
    ],
    faqs: [
      {
        question: "What is a GitHub repo launch demand map?",
        answer:
          "It is a source-linked map that translates public launch-prep requirements into QuickFork product surfaces, lifecycle priorities, CTAs, metrics, guardrails, and paid-intent hypotheses.",
      },
      {
        question: "Does this prove people will pay for QuickFork?",
        answer:
          "No. It identifies where launch-package value may exist. Willingness to pay still needs full launch package requests, interviews, lead quality review, and repeat usage evidence.",
      },
      {
        question: "Which demand signals matter first?",
        answer:
          "The first signals are source-backed repository story, social preview visuals, Product Hunt launch assets, channel-specific copy, and reviewable claims from the repository.",
      },
      {
        question: "How should QuickFork use this map?",
        answer:
          "Use it to choose the next landing page, resource, feature, or package test while keeping the public page clear that every claim needs source evidence or explicit user input.",
      },
    ],
    sourceNotes: [
      {
        label: "GitHub Docs social preview",
        body: "GitHub documents repository social preview customization, which makes preview imagery a concrete launch asset for shared repo links.",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      },
      {
        label: "Open Source Guides finding users",
        body: "Open Source Guides frames audience discovery, messaging, and community feedback as early open-source growth work.",
        url: "https://opensource.guide/finding-users/",
      },
      {
        label: "Product Hunt launch guide",
        body: "Product Hunt launch preparation depends on maker-facing copy, gallery assets, video decisions, pricing status, and launch-day context.",
        url: "https://www.producthunt.com/launch/preparing-for-launch",
      },
      {
        label: "Reddit Product Hunt launch community",
        body: "Community launch-prep threads surface low-confidence language around checklists, screenshots, first comments, and concise positioning.",
        url: "https://www.reddit.com/r/ProductHuntLaunches/",
      },
    ],
  },
  launch_readiness_score: {
    definition:
      "A GitHub repo launch readiness score is a 100-point source-backed scorecard that checks README trust, repository preview, audience feedback, launch assets, and follow-up measurement before a team generates or publishes a cold-start launch package.",
    targetUser: "Founders, open-source maintainers, and AI/devtool builders preparing a public GitHub repository launch.",
    jobToBeDone:
      "When a project is close to launch, help the builder identify which repository signals are ready, which launch assets are missing, and whether QuickFork should generate a repo brief, visual explainer, and channel-specific launch package next.",
    evidenceBoundary:
      "This tool uses public launch guidance and QuickFork's own funnel contract as a planning rubric. It does not predict search performance, sales outcomes, launch results, or willingness to pay.",
    benefits: [
      {
        title: "Find launch gaps before generating assets",
        body: "Score the repository's README, preview, audience, launch assets, and measurement loop before asking a model to write public copy.",
      },
      {
        title: "Turn abstract launch readiness into a checklist",
        body: "Translate public launch guidance into concrete signals a builder can review inside a source-backed workflow.",
      },
      {
        title: "Route the visitor into one studio action",
        body: "Use the scorecard to explain why the next step is a free repo scan, not a generic content form.",
      },
      {
        title: "Keep the score honest",
        body: "Frame the score as a planning aid and activation signal, not a promise about traffic, sales, or launch success.",
      },
    ],
    workflow: [
      {
        title: "Check README trust",
        body: "Confirm the repo explains the problem, audience, workflow, evidence, setup path, and unsupported claims before creating launch copy.",
      },
      {
        title: "Check repository preview",
        body: "Review whether shared repo links have a clear visual identity and preview that helps strangers understand the project quickly.",
      },
      {
        title: "Check audience and feedback",
        body: "Name likely users, communities, and questions before turning launch assets into public distribution.",
      },
      {
        title: "Check launch assets",
        body: "Map the repo brief into README/social visuals, Product Hunt copy, deck outline, social posts, and outreach drafts.",
      },
      {
        title: "Check measurement and follow-up",
        body: "Tie the launch package to repo brief starts, artifact exports, checklist requests, and follow-up interviews.",
      },
    ],
    faqs: [
      {
        question: "What is a GitHub repo launch readiness score?",
        answer:
          "It is a 100-point source-backed scorecard that reviews README trust, repository preview, audience feedback, launch assets, and follow-up measurement before generating a launch package from one repository URL.",
      },
      {
        question: "Who should use the launch readiness score?",
        answer:
          "It is for founders, open-source maintainers, and AI/devtool builders preparing a public GitHub repository launch who need a quick pre-launch review before creating README, social, deck, and outreach assets.",
      },
      {
        question: "What happens after the scorecard?",
        answer:
          "The next action is to start the QuickFork studio, paste a public GitHub repo, and generate a source-backed brief, visual explainer, channel assets, quality report, and artifact manifest for review.",
      },
      {
        question: "Does the score prove launch success?",
        answer:
          "No. The score is a planning rubric. It should not be used as proof of search performance, sales outcomes, Product Hunt results, conversion lift, or willingness to pay.",
      },
    ],
    sourceNotes: [
      {
        label: "GitHub Docs About READMEs",
        body: "GitHub positions the README as a key repository explanation surface, so README trust is the first score category.",
        url: "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      },
      {
        label: "GitHub Docs social preview",
        body: "GitHub social preview customization makes shared repo previews a concrete visual launch-readiness signal.",
        url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      },
      {
        label: "Open Source Guides finding users",
        body: "Open Source Guides ties open-source growth to audience discovery, messaging, community feedback, and user finding.",
        url: "https://opensource.guide/finding-users/",
      },
      {
        label: "Product Hunt launch guide",
        body: "Product Hunt launch preparation turns launch assets, gallery decisions, maker context, and launch-day copy into concrete review work.",
        url: "https://www.producthunt.com/launch/preparing-for-launch",
      },
    ],
    lastUpdated: "June 2, 2026",
    scorecard: launchReadinessScorecard,
  },
};

export function getMarketingPageTitle(link: MarketingLink) {
  return `${formatMarketingLabel(link.primaryKeyword)} | QuickFork`;
}

export function getMarketingPageHeadline(link: MarketingLink) {
  if (link.intentCluster === "github_repo_to_launch_package") {
    return "GitHub Repo To Launch Package for cold-start technical launches.";
  }
  if (link.intentCluster === "ai_project_launch") {
    return "AI Project Launch for source-backed technical launches.";
  }
  if (link.intentCluster === "github_repo_visual_explainer") {
    return "GitHub Repo Visual Explainer for source-backed project understanding.";
  }
  if (link.intentCluster === "repository_launch_package_pilot") {
    return "Repository Launch Package Pilot for source-backed paid-intent learning.";
  }
  if (link.intentCluster === "open_source_launch_checklist") {
    return "Open Source Launch Checklist for source-backed repository launches.";
  }
  if (link.intentCluster === "github_repo_launch_demand_map") {
    return "GitHub Repo Launch Demand for source-backed package prioritization.";
  }
  if (link.intentCluster === "launch_readiness_score") {
    return "GitHub Repo Launch Readiness Score for source-backed pre-launch reviews.";
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
  if (link.intentCluster === "ai_project_launch") {
    return "QuickFork maps AI project launch demand into source-backed README, social, deck, outreach, and visual launch assets for cold-start AI repositories.";
  }
  if (link.intentCluster === "github_repo_visual_explainer") {
    return "QuickFork maps github repo visual explainer demand into source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets for technical repositories.";
  }
  if (link.intentCluster === "repository_launch_package_pilot") {
    return "QuickFork maps repository launch package pilot demand into a full launch package pilot for README, social, deck, outreach, visual explainer, review, and measurement work.";
  }
  if (link.intentCluster === "open_source_launch_checklist") {
    return "QuickFork maps open source launch checklist demand into source-backed README, social preview, Product Hunt, deck, outreach, and post-launch learning steps for public GitHub repository launches.";
  }
  if (link.intentCluster === "github_repo_launch_demand_map") {
    return "QuickFork maps github repo launch demand into public-source signals for README, social, Product Hunt, deck, outreach, and paid launch-package tests.";
  }
  if (link.intentCluster === "launch_readiness_score") {
    return "QuickFork maps github repo launch readiness score demand into a 100-point source-backed readiness score for README trust, repository preview, audience feedback, launch assets, and follow-up measurement.";
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
    .replace(/\bAi\b/g, "AI")
    .replace(/\bChatgpt\b/g, "ChatGPT")
    .replace(/\bDevrel\b/g, "DevRel")
    .replace(/\bReadme\b/g, "README")
    .replace(/\bQwenlm\b/g, "QwenLM")
    .replace(/\bFlashqla\b/g, "FlashQLA")
    .replace(/\bDeepseek\b/g, "DeepSeek")
    .replace(/\bTwvp\b/g, "TWVP")
    .replace(/\bCanva\b/g, "Canva");
}
