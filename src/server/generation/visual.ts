import type { GitHubRepoMetadata, ProjectBrief, VisualDirection } from "./types.js";

function signals(metadata: GitHubRepoMetadata, brief: ProjectBrief) {
  return [metadata.name, metadata.description ?? "", metadata.language ?? "", ...metadata.topics, brief.subtitle, ...brief.keyInsights].join(" ").toLowerCase();
}

export function selectVisualDirection(metadata: GitHubRepoMetadata, brief: ProjectBrief): VisualDirection {
  const text = signals(metadata, brief);

  if (/design|editor|canvas|artifact|brand|presentation/.test(text)) {
    return {
      category: "design_tool",
      mood: ["editorial", "manifesto-like", "premium product showcase", "local-first creative system"],
      palette: { background: "black-brown", text: "cream", accent: "orange", secondaryAccent: "muted tan" },
      typography: ["large editorial headline", "compact sans-serif labels", "high-contrast manifesto copy"],
      layout: ["left-side strong title and thesis", "right-side floating artifact cards", "bottom GitHub link strip", "clear metric row"],
      visualMotifs: ["floating product output cards", "design system swatches", "artifact preview panels", "subtle canvas/editor references"],
      avoid: ["generic SaaS gradient", "random abstract logo", "unrelated mascot", "overly technical blue-white kernel diagram"],
    };
  }

  if (/kernel|cuda|inference|kv-cache|runtime|performance/.test(text)) {
    return {
      category: "ai_kernel_infra",
      mood: ["technical", "precise", "infrastructure-grade"],
      palette: { background: "white", text: "deep navy", accent: "electric blue" },
      typography: ["clean technical sans-serif", "dense metric labels"],
      layout: ["diagram-led", "metric-first", "structured panels"],
      visualMotifs: ["system blocks", "throughput arrows", "memory tiles"],
      avoid: ["decorative editorial collage", "random logos"],
    };
  }

  if (/benchmark|paper|dataset|evaluation|model/.test(text)) {
    return {
      category: "model_benchmark",
      mood: ["research launch", "measured", "credible"],
      palette: { background: "off-white", text: "charcoal", accent: "blue" },
      typography: ["paper-inspired headings", "compact annotation labels"],
      layout: ["results panel", "method summary", "metric row"],
      visualMotifs: ["benchmark cards", "axis labels", "model comparison tiles"],
      avoid: ["unverified claims", "random badges"],
    };
  }

  if (/cli|sdk|developer|terminal|workflow|automation/.test(text)) {
    return {
      category: "devtool",
      mood: ["developer-focused", "terminal-like", "systematic"],
      palette: { background: "near black", text: "soft white", accent: "green" },
      typography: ["monospace accents", "compact UI labels"],
      layout: ["command panel", "system diagram", "workflow strip"],
      visualMotifs: ["terminal panes", "code snippets", "dependency graph"],
      avoid: ["marketing fluff", "unrelated product logos"],
    };
  }

  return {
    category: "generic_open_source",
    mood: ["clear", "credible", "shareable"],
    palette: { background: "white", text: "charcoal", accent: "blue" },
    typography: ["modern sans-serif", "readable labels"],
    layout: ["identity top", "headline left", "visual panel right", "GitHub strip bottom"],
    visualMotifs: ["feature cards", "workflow blocks"],
    avoid: ["random logos", "fake badges"],
  };
}
