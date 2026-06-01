import type { GitHubRepoMetadata, LocalizedCardCopy, ProjectBrief, ReadmeContext, RepoLaunchBrief, VisualDirection } from "./types.js";

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

  return {
    summary: input.brief.subtitle,
    audienceHypothesis: audienceHypothesis(input.metadata),
    readmeChecklist: [
      { item: "Lead with a one-sentence README value proposition.", source: "Derived from repository evidence and README positioning." },
      { item: "Show the top source-backed features before implementation detail.", source: sourceReferences[0] ?? "Repository evidence is thin; review before publishing." },
      { item: "Add a visual project explainer near the top of the README.", source: `${input.visualDirection.category} visual direction from repository signals.` },
      { item: "Keep metrics and claims tied to README or repo metadata.", source: sourceReferences[1] ?? "No strong metric evidence found; avoid invented proof." },
    ],
    launchAngles: insights.map((insight, index) => ({
      title: `Launch angle ${index + 1}`,
      body: insight,
      source: sourceReferences[index] ?? "Source evidence is limited; validate this angle manually.",
    })),
    socialPost: `${input.localizedCopy.hook}\n\n${input.localizedCopy.valueProposition}\n\n${repoUrl}`,
    deckOutline: [
      `Problem: ${input.brief.title} is hard to understand from raw repository context.`,
      `What it does: ${input.brief.subtitle}`,
      `Why it matters: ${insights[0]}`,
      `Workflow: ${workflow.join(" -> ")}`,
    ],
    outreachDraft: `Hi, I found ${input.brief.title} and put together a source-backed launch brief from ${repoUrl}. The draft focuses on ${insights[0]}.`,
    visualExplainerPrompt: `Create a ${input.visualDirection.category} visual explainer as a workflow_diagram. Use ${input.visualDirection.layout.join(", ")} and keep the GitHub strip as ${repoUrl}.`,
    sourceReferences,
  };
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
