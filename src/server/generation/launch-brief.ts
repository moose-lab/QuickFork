import type {
  GitHubRepoMetadata,
  LocalizedCardCopy,
  ProjectBrief,
  ReadmeContext,
  RepoLaunchBrief,
  RepoLaunchBriefAngle,
  RepoLaunchBriefArtifact,
  RepoLaunchBriefChecklistItem,
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

  return {
    summary: input.brief.subtitle,
    audienceHypothesis: audience,
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
