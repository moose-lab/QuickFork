import type { ImagePromptResult, ImageQuality, LocalizedCardCopy, MarketingCardLayoutSpec, ProjectBrief, StoredReferenceAsset, VisualDirection } from "./types.js";
import { DEFAULT_GENERATION_MODELS } from "./llm.js";

const PRESET_SIZES = {
  "1:1": "1200x1200",
  "3:2": "1536x1024",
  "2:3": "1024x1536",
  "3:4": "1200x1600",
  "4:3": "1600x1200",
  "4:5": "1200x1500",
  "5:4": "1500x1200",
  "9:16": "1080x1920",
  "16:9": "1920x1080",
  "21:9": "2100x900",
} as const;

const PRESET_ASPECT_RATIOS = {
  "1:1": "1:1",
  "3:2": "3:2",
  "2:3": "2:3",
  "3:4": "3:4",
  "4:3": "4:3",
  "4:5": "4:5",
  "5:4": "5:4",
  "9:16": "9:16",
  "16:9": "16:9",
  "21:9": "21:9",
} as const;

export const WAVESPEED_IMAGE_ENDPOINT = "https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image";
export const WAVESPEED_PREDICTIONS_ENDPOINT = "https://api.wavespeed.ai/api/v3/predictions";

export function imageSizeForPreset(preset: keyof typeof PRESET_SIZES) {
  return PRESET_SIZES[preset];
}

export function imageAspectRatioForPreset(preset: keyof typeof PRESET_ASPECT_RATIOS) {
  return PRESET_ASPECT_RATIOS[preset];
}

export function normalizeWavespeedImageQuality(_quality: ImageQuality) {
  return "low";
}

export function buildWavespeedImageRequest(input: {
  model?: string;
  prompt: string;
  preset: keyof typeof PRESET_ASPECT_RATIOS;
  quality: ImageQuality;
}) {
  return {
    url: WAVESPEED_IMAGE_ENDPOINT,
    model: input.model?.trim() || DEFAULT_GENERATION_MODELS.image,
    body: {
      prompt: input.prompt,
      aspect_ratio: imageAspectRatioForPreset(input.preset),
      resolution: "1k",
      quality: normalizeWavespeedImageQuality(input.quality),
      output_format: "png",
      enable_sync_mode: false,
      enable_base64_output: false,
    },
  };
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
    "Use case:",
    "infographic-diagram",
    "",
    "Asset type:",
    `Create a polished open-source project marketing card, ${imageSizeForPreset(input.preset)}, suitable for GitHub README, launch posts, slide decks, and social platforms.`,
    "",
    "Identity rule:",
    "Use the official brand logo if a real logo source asset is supplied.",
    "Use the official logo asset if available.",
    `Primary identity asset path: ${primaryAsset.localPath}`,
    `Primary identity asset source: ${primaryAsset.source}`,
    "If no official brand logo source is supplied, use the real GitHub account avatar.",
    "If no official logo asset is provided, use the saved GitHub owner avatar.",
    "Do not redraw it as a new symbol.",
    "Do not stylize it into a different mark.",
    "Do not invent random logos.",
    "Do not create abstract brand marks, mascots, badges, or unsourced symbols.",
    "Never synthesize random logos, abstract brand marks, mascots, badges, or unrelated symbols.",
    "The GitHub logo is only for the bottom GitHub strip, not the project identity slot.",
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
