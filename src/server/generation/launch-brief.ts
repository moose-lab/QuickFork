import type {
  GitHubRepoMetadata,
  LocalizedCardCopy,
  ProjectBrief,
  ReadmeContext,
  RepoLaunchBrief,
  RepoLaunchAudienceDiscovery,
  RepoLaunchBriefAngle,
  RepoLaunchBriefArtifact,
  RepoLaunchBriefChecklistItem,
  RepoLaunchStoryMap,
  VisualDirection,
} from "./types.js";

export function buildRepoLaunchBrief(input: {
  metadata: GitHubRepoMetadata;
  readme: ReadmeContext;
  brief: ProjectBrief;
  localizedCopy: LocalizedCardCopy;
  visualDirection: VisualDirection;
}): RepoLaunchBrief {
  const repoUrl = `github.com/${input.metadata.fullName}`;
  const sourceReferences = buildSourceReferences(input.brief);
  const insights = padItems(input.brief.keyInsights, [
    "Repository evidence is compressed into a clear launch story.",
    "Source-backed assets help reviewers separate facts from hypotheses.",
    "The launch package can be reused across README, social, deck, and outreach surfaces.",
  ]).slice(0, 3);
  const workflow = padItems(input.brief.workflowSteps, ["Brief", "Generate", "Review"]).slice(0, 3);
  const audience = audienceHypothesis(input.metadata);
  const readmeChecklist = [
    { item: "Lead with a one-sentence README value proposition.", source: "Derived from repository evidence and README positioning." },
    { item: "Show the top source-backed features before implementation detail.", source: sourceReferences[0] ?? "Repository evidence is thin; review before publishing." },
    { item: "Add a visual project explainer near the top of the README.", source: `${input.visualDirection.category} visual direction from repository signals.` },
    { item: "Keep metrics and claims tied to README or repo metadata.", source: sourceReferences[1] ?? "No strong metric evidence found; avoid invented proof." },
  ];
  const launchAngles = insights.map((insight, index) => ({
    title: `Launch angle ${index + 1}`,
    body: insight,
    source: sourceReferences[index] ?? "Source evidence is limited; validate this angle manually.",
  }));
  const socialPost = `${input.localizedCopy.hook}\n\n${input.localizedCopy.valueProposition}\n\n${repoUrl}`;
  const deckOutline = [
    `Problem: ${input.brief.title} is hard to understand from raw repository context.`,
    `What it does: ${input.brief.subtitle}`,
    `Why it matters: ${insights[0]}`,
    `Workflow: ${workflow.join(" -> ")}`,
  ];
  const outreachDraft = `Hi, I found ${input.brief.title} and put together a source-backed launch brief from ${repoUrl}. The draft focuses on ${insights[0]}.`;
  const visualExplainerPrompt = `Create a ${input.visualDirection.category} visual explainer as a workflow_diagram. Use ${input.visualDirection.layout.join(", ")} and keep the GitHub strip as ${repoUrl}.`;
  const audienceDiscovery = buildAudienceDiscovery({
    repoFullName: input.metadata.fullName,
    audience,
    summary: input.brief.subtitle,
    sourceReferences,
    topics: input.metadata.topics,
    language: input.metadata.language,
  });
  const storyMap = buildStoryMap({
    repoFullName: input.metadata.fullName,
    summary: input.brief.subtitle,
    audience,
    workflow,
    insights,
    sourceReferences,
    visualCategory: input.visualDirection.category,
  });

  return {
    summary: input.brief.subtitle,
    audienceHypothesis: audience,
    audienceDiscovery,
    storyMap,
    readmeChecklist,
    launchAngles,
    socialPost,
    deckOutline,
    outreachDraft,
    visualExplainerPrompt,
    sourceReferences,
    artifacts: buildLaunchBriefArtifacts({
      repoFullName: input.metadata.fullName,
      summary: input.brief.subtitle,
      audienceHypothesis: audience,
      audienceDiscovery,
      storyMap,
      readmeChecklist,
      launchAngles,
      socialPost,
      deckOutline,
      outreachDraft,
      visualExplainerPrompt,
      sourceReferences,
    }),
  };
}

function buildLaunchBriefArtifacts(input: {
  repoFullName: string;
  summary: string;
  audienceHypothesis: string;
  audienceDiscovery: RepoLaunchAudienceDiscovery;
  storyMap: RepoLaunchStoryMap;
  readmeChecklist: RepoLaunchBriefChecklistItem[];
  launchAngles: RepoLaunchBriefAngle[];
  socialPost: string;
  deckOutline: string[];
  outreachDraft: string;
  visualExplainerPrompt: string;
  sourceReferences: string[];
}): RepoLaunchBriefArtifact[] {
  const slug = slugifyRepo(input.repoFullName);
  const sourceBlock = formatSourceReferences(input.sourceReferences);

  return [
    {
      type: "audience",
      label: "Target user discovery map",
      fileName: `${slug}-target-user-discovery.md`,
      body: formatAudienceDiscovery(input.audienceDiscovery, sourceBlock),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "story_map",
      label: "Project story map",
      fileName: `${slug}-project-story-map.md`,
      body: formatStoryMap(input.storyMap, sourceBlock),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "readme",
      label: "README launch brief",
      fileName: `${slug}-readme-launch-brief.md`,
      body: [
        `# README launch brief for ${input.repoFullName}`,
        "",
        `Summary: ${input.summary}`,
        `Audience hypothesis: ${input.audienceHypothesis}`,
        "",
        "## README checklist",
        ...input.readmeChecklist.map((item) => `- ${item.item}\n  Source: ${item.source}`),
        "",
        "## Launch angles",
        ...input.launchAngles.map((angle) => `- ${angle.title}: ${angle.body}\n  Source: ${angle.source}`),
        "",
        sourceBlock,
      ].join("\n"),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "social",
      label: "Social launch post",
      fileName: `${slug}-social-launch-post.txt`,
      body: [input.socialPost, "", sourceBlock].join("\n"),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "deck",
      label: "Pitch deck outline",
      fileName: `${slug}-deck-outline.md`,
      body: [
        `# Pitch deck outline for ${input.repoFullName}`,
        "",
        ...input.deckOutline.map((item, index) => `${index + 1}. ${item}`),
        "",
        sourceBlock,
      ].join("\n"),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "outreach",
      label: "Product outreach draft",
      fileName: `${slug}-outreach-draft.txt`,
      body: [input.outreachDraft, "", sourceBlock].join("\n"),
      sourceReferences: input.sourceReferences,
    },
    {
      type: "visual",
      label: "Visual explainer prompt",
      fileName: `${slug}-visual-explainer-prompt.txt`,
      body: [input.visualExplainerPrompt, "", sourceBlock].join("\n"),
      sourceReferences: input.sourceReferences,
    },
  ];
}

function buildAudienceDiscovery(input: {
  repoFullName: string;
  audience: string;
  summary: string;
  sourceReferences: string[];
  topics: string[];
  language: string | null;
}): RepoLaunchAudienceDiscovery {
  const primarySource = input.sourceReferences[0] ?? "Repository evidence is limited; validate the target users before publishing.";
  const secondarySource = input.sourceReferences[1] ?? primarySource;
  const topicSummary = input.topics.length ? input.topics.slice(0, 4).join(", ") : input.language ?? "repository signals";
  const isAiProject = /ai|agent|model|llm|inference|cuda/i.test(`${input.summary} ${topicSummary}`);
  const technicalSegment = isAiProject ? "AI project builders" : input.audience.split(",")[0]?.trim() || "Technical builders";

  return {
    title: `${input.repoFullName} target user discovery map`,
    summary: `Source-backed target user discovery for ${input.summary}`,
    signals: [
      {
        id: "technical_builders",
        segment: input.audience,
        jobToBeDone: `Understand whether ${input.repoFullName} is useful before reading the full repository.`,
        trigger: "Preparing a launch, README rewrite, benchmark post, demo day, or technical community share.",
        whereToFind: `GitHub README, release notes, issues, and communities around ${topicSummary}.`,
        validationQuestion: "Which repository evidence would make this target user trust the project enough to try it?",
        source: primarySource,
        priority: "high",
      },
      {
        id: "open_source_adopters",
        segment: "Open-source adopters and maintainers",
        jobToBeDone: "Decide whether the project is credible, usable, and worth sharing with a technical audience.",
        trigger: "A visitor lands on the repo, compares alternatives, or asks whether the project is ready for adoption.",
        whereToFind: "GitHub stars/watchers, README readers, issue discussions, docs pages, and open-source launch communities.",
        validationQuestion: "What setup path, example, or proof boundary would help adopters understand the project faster?",
        source: secondarySource,
        priority: "medium",
      },
      {
        id: "launch_reviewers",
        segment: `${technicalSegment}, founders, DevRel operators, and launch reviewers`,
        jobToBeDone: "Turn the repository story into channel-ready launch material without unsupported claims.",
        trigger: "Product Hunt preparation, funding/demo update, partner outreach, newsletter mention, or first public showcase.",
        whereToFind: "Product Hunt launch prep, founder communities, DevRel newsletters, technical social posts, and partner channels.",
        validationQuestion: "Which launch channel needs the clearest source-backed proof before the team should scale distribution?",
        source: primarySource,
        priority: "medium",
      },
    ],
  };
}

function buildStoryMap(input: {
  repoFullName: string;
  summary: string;
  audience: string;
  workflow: string[];
  insights: string[];
  sourceReferences: string[];
  visualCategory: VisualDirection["category"];
}): RepoLaunchStoryMap {
  const primarySource = input.sourceReferences[0] ?? "Repository evidence is limited; review generated claims before publishing.";
  const secondarySource = input.sourceReferences[1] ?? primarySource;
  const workflowDetail = input.workflow.join(" -> ");

  return {
    title: `${input.repoFullName} launch story map`,
    summary: `Source-backed visual interpretation for ${input.summary}`,
    nodes: [
      {
        id: "source",
        label: "Source",
        title: "Repository evidence",
        detail: primarySource,
        source: primarySource,
      },
      {
        id: "audience",
        label: "Audience",
        title: "Audience hypothesis",
        detail: input.audience,
        source: "Audience hypothesis from repository metadata and README topics.",
      },
      {
        id: "workflow",
        label: "Workflow",
        title: "Workflow spine",
        detail: workflowDetail,
        source: secondarySource,
      },
      {
        id: "proof",
        label: "Proof",
        title: "Reviewable claim",
        detail: input.insights[0] ?? primarySource,
        source: primarySource,
      },
      {
        id: "launch",
        label: "Launch",
        title: "Channel package",
        detail: `Package README, social, deck, outreach, and visual assets using the ${input.visualCategory} direction.`,
        source: "Launch package channels from the QuickFork generation workflow.",
      },
    ],
  };
}

function formatAudienceDiscovery(audienceDiscovery: RepoLaunchAudienceDiscovery, sourceBlock: string) {
  return [
    `# ${audienceDiscovery.title}`,
    "",
    "## Target user discovery map",
    "",
    audienceDiscovery.summary,
    "",
    ...audienceDiscovery.signals.map((signal, index) =>
      [
        `${index + 1}. ${signal.segment}`,
        `   Priority: ${signal.priority}`,
        `   Job to be done: ${signal.jobToBeDone}`,
        `   Trigger: ${signal.trigger}`,
        `   Where to find: ${signal.whereToFind}`,
        `   Validation question: ${signal.validationQuestion}`,
        `   Source: ${signal.source}`,
      ].join("\n"),
    ),
    "",
    sourceBlock,
  ].join("\n");
}

function formatStoryMap(storyMap: RepoLaunchStoryMap, sourceBlock: string) {
  return [
    `# ${storyMap.title}`,
    "",
    `## Project story map`,
    "",
    storyMap.summary,
    "",
    ...storyMap.nodes.map((node, index) => [`${index + 1}. ${node.label}: ${node.title}`, `   Detail: ${node.detail}`, `   Source: ${node.source}`].join("\n")),
    "",
    sourceBlock,
  ].join("\n");
}

function formatSourceReferences(sourceReferences: string[]) {
  return ["## Source references", ...sourceReferences.map((source) => `- ${source}`)].join("\n");
}

function slugifyRepo(repoFullName: string) {
  return repoFullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildSourceReferences(brief: ProjectBrief) {
  const references = brief.sourceSignals.readmeEvidence.slice(0, 6);
  if (references.length > 0) return references;

  return [
    brief.sourceSignals.repoDescription
      ? `Repository description includes: ${brief.sourceSignals.repoDescription}`
      : "Repository evidence is limited; review generated claims before publishing.",
  ];
}

function padItems(items: string[], fallback: string[]) {
  return [...items, ...fallback].filter(Boolean);
}

function audienceHypothesis(metadata: GitHubRepoMetadata) {
  const corpus = [metadata.description ?? "", metadata.language ?? "", ...metadata.topics].join(" ").toLowerCase();
  if (/agent|ai|model|llm|inference|cuda/.test(corpus)) {
    return "AI project builders, Open-source maintainers, and technical founders evaluating launch readiness.";
  }
  if (/design|creative|visual/.test(corpus)) {
    return "Open-source maintainers, design tool builders, and product teams packaging a technical launch.";
  }
  return "Open-source maintainers, DevRel teams, and indie technical founders preparing a public launch.";
}
