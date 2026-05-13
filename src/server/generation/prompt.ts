import type { ImagePromptResult, ImageQuality, LocalizedCardCopy, MarketingCardLayoutSpec, ProjectBrief, StoredReferenceAsset, VisualDirection } from "./types.js";
import { DEFAULT_GENERATION_MODELS } from "./llm.js";

const PRESET_SIZES = {
  "github-readme": "1536x1024",
  "ppt-wide": "1920x1080",
  "x-linkedin-landscape": "1600x900",
  "square-social": "1200x1200",
} as const;

export function imageSizeForPreset(preset: keyof typeof PRESET_SIZES) {
  return PRESET_SIZES[preset];
}

export function buildImagePrompt(input: {
  brief: ProjectBrief;
  visualDirection: VisualDirection;
  layout: MarketingCardLayoutSpec;
  copy: LocalizedCardCopy;
  primaryAsset: StoredReferenceAsset;
  quality: ImageQuality;
  preset: keyof typeof PRESET_SIZES;
  model?: string;
}): ImagePromptResult {
  const { visualDirection, layout, copy, primaryAsset } = input;
  const prompt = [
    "Asset type:",
    `Create a polished open-source project marketing card, ${imageSizeForPreset(input.preset)}, suitable for GitHub README, launch posts, slide decks, and social platforms.`,
    "",
    "Identity rule:",
    "Use the official logo asset if available.",
    `Primary identity asset path: ${primaryAsset.localPath}`,
    `Primary identity asset source: ${primaryAsset.source}`,
    "If no official logo asset is provided, use the saved GitHub owner avatar.",
    "Do not redraw it as a new symbol.",
    "Do not stylize it into a different mark.",
    "Do not invent random logos.",
    "Do not create abstract brand marks, mascots, badges, or unsourced symbols.",
    "The GitHub logo may appear only in the bottom GitHub link strip.",
    "",
    "Reference visual style:",
    `Mood: ${visualDirection.mood.join(", ")}`,
    `Palette: background ${visualDirection.palette.background}; text ${visualDirection.palette.text}; accent ${visualDirection.palette.accent}`,
    `Typography: ${visualDirection.typography.join(", ")}`,
    `Visual motifs: ${visualDirection.visualMotifs.join(", ")}`,
    "",
    "Layout:",
    "Top identity area: logo/avatar + brand name.",
    `Top tags: ${layout.tags.join(", ")}`,
    "Main headline: large, editorial, left aligned.",
    "Subcopy: short value statement under headline.",
    "Metrics: 3-4 compact metric blocks.",
    "Features: 3 feature callouts.",
    "Workflow: 3-step strip.",
    `Right visual panel: ${layout.visualPanel.type}, containing ${layout.visualPanel.elements.join(", ")}.`,
    "Bottom GitHub strip: GitHub icon + exact repo URL.",
    "",
    "Exact text:",
    `Brand: "${layout.identity.brandName}"`,
    `Tags: ${layout.tags.map((tag) => `"${tag}"`).join(", ")}`,
    `Headline: "${copy.hook}"`,
    `Subtitle: "${copy.subtitle}"`,
    `Value proposition: "${copy.valueProposition}"`,
    "Metrics:",
    ...copy.metricLabels.map((metric, index) => `${index + 1}. "${metric}"`),
    "Features:",
    ...copy.featureBullets.map((feature, index) => `${index + 1}. "${feature}"`),
    "Workflow:",
    ...copy.workflowLabels.map((step, index) => `${index + 1}. "${step}"`),
    `GitHub strip: "${copy.ctaOrStripText}"`,
    "",
    "Hard constraints:",
    "Keep all text legible.",
    "Do not change the exact wording.",
    "Do not translate the GitHub URL.",
    "Do not add extra logos.",
    "Do not add fake badges.",
    "Do not use the GitHub logo as the project identity.",
    "Do not hallucinate product screenshots not described in the visual panel.",
  ].join("\n");

  return {
    model: input.model?.trim() || DEFAULT_GENERATION_MODELS.image,
    size: imageSizeForPreset(input.preset),
    quality: input.quality,
    prompt,
    referencedAssets: [primaryAsset],
  };
}
