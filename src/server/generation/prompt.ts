import type { ImagePromptResult, ImageQuality, LocalizedCardCopy, MarketingCardLayoutSpec, ProjectBrief, StoredReferenceAsset, VisualDirection } from "./types.js";
import { DEFAULT_GENERATION_MODELS, OPENAI_API_BASE_URL, OPENAI_BASE_URL_ENV, OPENAI_GENERATION_MODELS } from "./llm.js";

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
export const OPENAI_IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";

export function openAIImageEndpoint() {
  return `${(process.env[OPENAI_BASE_URL_ENV] ?? OPENAI_API_BASE_URL).replace(/\/+$/, "")}/images/generations`;
}

export function imageSizeForPreset(preset: keyof typeof PRESET_SIZES) {
  return PRESET_SIZES[preset];
}

export function imageAspectRatioForPreset(preset: keyof typeof PRESET_ASPECT_RATIOS) {
  return PRESET_ASPECT_RATIOS[preset];
}

export function normalizeWavespeedImageQuality(_quality: ImageQuality) {
  return "low";
}

export function openAIImageSizeForPreset(preset: keyof typeof PRESET_ASPECT_RATIOS) {
  if (preset === "1:1") return "1024x1024";
  if (["2:3", "3:4", "4:5", "9:16"].includes(preset)) return "1024x1536";
  return "1536x1024";
}

export function normalizeOpenAIImageQuality(_quality: ImageQuality) {
  return "low";
}

export function buildOpenAIImageRequest(input: {
  model?: string;
  prompt: string;
  preset: keyof typeof PRESET_ASPECT_RATIOS;
  quality: ImageQuality;
}) {
  const model = input.model?.trim() || OPENAI_GENERATION_MODELS.image;
  return {
    url: openAIImageEndpoint(),
    model,
    body: {
      model,
      prompt: input.prompt,
      size: openAIImageSizeForPreset(input.preset),
      quality: normalizeOpenAIImageQuality(input.quality),
      n: 1,
      output_format: "png",
    },
  };
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
  const visibleMetrics = copy.metricLabels.slice(0, 2);
  const visibleFeatures = copy.featureBullets.slice(0, 2);
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
    `Optional top tags: ${layout.tags.join(", ")}. Render only if they do not crowd the headline.`,
    "Main headline: large, editorial, left aligned.",
    "Subcopy: short value statement under headline.",
    "Metrics: 2 compact metric chips maximum.",
    "Features: 2 short feature chips maximum.",
    "Workflow: show as visual steps, arrows, or nodes without extra paragraph text.",
    `Right visual panel: ${layout.visualPanel.type}, containing ${layout.visualPanel.elements.join(", ")}.`,
    "Bottom GitHub strip: GitHub icon + exact repo URL.",
    "",
    "Text budget:",
    "Render at most 2 metric chips and 2 short feature chips.",
    "Do not render subtitle text, workflow labels, explanatory paragraphs, or extra captions.",
    "Leave generous whitespace around the headline and visual panel.",
    "",
    "Exact text:",
    `Brand: "${layout.identity.brandName}"`,
    `Headline: "${copy.hook}"`,
    `Value proposition: "${copy.valueProposition}"`,
    "Metric chips:",
    ...visibleMetrics.map((metric, index) => `${index + 1}. "${metric}"`),
    "Feature chips:",
    ...visibleFeatures.map((feature, index) => `${index + 1}. "${feature}"`),
    `GitHub strip: "${copy.ctaOrStripText}"`,
    "",
    "Hard constraints:",
    "Keep all text legible.",
    "Do not change the exact wording.",
    "Do not add any visible text beyond the exact text list.",
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
