import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { GeneratedImageResult, ImagePromptResult, LocaleCode } from "./types.js";
import { OPENAI_API_KEY_ENV, WAVESPEED_API_KEY_ENV, normalizeOpenAIApiKey, normalizeWavespeedApiKey } from "./llm.js";
import { WAVESPEED_PREDICTIONS_ENDPOINT, buildOpenAIImageRequest, buildWavespeedImageRequest } from "./prompt.js";

const WAVESPEED_IMAGE_POLL_INTERVAL_MS = 1000;
const WAVESPEED_IMAGE_MAX_POLLS = 120;

type WavespeedImageResponse = {
  id?: string;
  requestId?: string;
  request_id?: string;
  outputs?: string[];
  status?: string;
  urls?: Record<string, unknown>;
  data?: unknown;
  error?: unknown;
};

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: unknown;
    url?: unknown;
  }>;
  error?: unknown;
};

export async function generateMockImage(localeDir: string, locale: LocaleCode, prompt: ImagePromptResult): Promise<GeneratedImageResult> {
  await mkdir(localeDir, { recursive: true });
  const promptPath = join(localeDir, "marketing_card_prompt.txt");
  const imagePath = join(localeDir, "marketing-card.png");
  await writeFile(promptPath, prompt.prompt, "utf8");
  await writeFile(imagePath, `Mock QuickFork image\nlocale=${locale}\nmodel=${prompt.model}\nsize=${prompt.size}\n`, "utf8");

  return {
    provider: "mock",
    model: prompt.model,
    status: "completed",
    imagePath,
    promptPath,
    assetPaths: prompt.referencedAssets.map((asset) => asset.localPath),
    warnings: [],
  };
}

export async function generateOpenAIImage(
  localeDir: string,
  locale: LocaleCode,
  prompt: ImagePromptResult,
  input: {
    preset: Parameters<typeof buildOpenAIImageRequest>[0]["preset"];
    apiKey?: string;
    fetchImpl?: typeof fetch;
  },
): Promise<GeneratedImageResult> {
  const apiKey = input.apiKey ?? process.env[OPENAI_API_KEY_ENV];
  if (!apiKey) {
    throw new Error(`${OPENAI_API_KEY_ENV} is required to call OpenAI image generation.`);
  }
  const normalizedApiKey = normalizeOpenAIApiKey(apiKey);

  await mkdir(localeDir, { recursive: true });
  const promptPath = join(localeDir, "marketing_card_prompt.txt");
  const imagePath = join(localeDir, "marketing-card.png");
  await writeFile(promptPath, prompt.prompt, "utf8");

  const request = buildOpenAIImageRequest({
    model: prompt.model,
    prompt: prompt.prompt,
    preset: input.preset,
    quality: prompt.quality,
  });
  const response = await (input.fetchImpl ?? fetch)(request.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${normalizedApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) {
    return writeFailedOpenAIImage({
      imagePath,
      prompt,
      promptPath,
      model: request.model,
      message: `OpenAI image generation failed with ${response.status}.`,
    });
  }

  const body = (await response.json()) as OpenAIImageResponse;
  const firstImage = body.data?.[0];
  if (typeof firstImage?.b64_json === "string" && firstImage.b64_json.trim()) {
    await writeFile(imagePath, Buffer.from(firstImage.b64_json, "base64"));
    return {
      provider: "openai",
      model: request.model,
      status: "completed",
      imagePath,
      imageUrl: `data:image/png;base64,${firstImage.b64_json}`,
      promptPath,
      assetPaths: prompt.referencedAssets.map((asset) => asset.localPath),
      warnings: [],
    };
  }
  if (typeof firstImage?.url === "string" && firstImage.url.trim()) {
    await writeFile(imagePath, `OpenAI image URL\n${firstImage.url}\n`, "utf8");
    return {
      provider: "openai",
      model: request.model,
      status: "completed",
      imagePath,
      imageUrl: firstImage.url,
      promptPath,
      assetPaths: prompt.referencedAssets.map((asset) => asset.localPath),
      warnings: ["Stored the OpenAI output URL in the image artifact placeholder. Replace with binary download when production storage is selected."],
    };
  }

  return writeFailedOpenAIImage({
    imagePath,
    prompt,
    promptPath,
    model: request.model,
    message: `OpenAI image generation returned no image for ${locale}. error=${formatProviderError(body.error)}`,
  });
}

export async function generateWavespeedImage(
  localeDir: string,
  locale: LocaleCode,
  prompt: ImagePromptResult,
  input: {
    preset: Parameters<typeof buildWavespeedImageRequest>[0]["preset"];
    apiKey?: string;
    fetchImpl?: typeof fetch;
    pollIntervalMs?: number;
    maxPolls?: number;
  },
): Promise<GeneratedImageResult> {
  const apiKey = input.apiKey ?? process.env[WAVESPEED_API_KEY_ENV];
  if (!apiKey) {
    throw new Error(`${WAVESPEED_API_KEY_ENV} is required to call Wavespeed gpt-image-2.`);
  }
  const normalizedApiKey = normalizeWavespeedApiKey(apiKey);

  await mkdir(localeDir, { recursive: true });
  const promptPath = join(localeDir, "marketing_card_prompt.txt");
  const imagePath = join(localeDir, "marketing-card.png");
  await writeFile(promptPath, prompt.prompt, "utf8");

  const request = buildWavespeedImageRequest({
    model: prompt.model,
    prompt: prompt.prompt,
    preset: input.preset,
    quality: prompt.quality,
  });
  const response = await (input.fetchImpl ?? fetch)(request.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${normalizedApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) {
    return writeFailedWavespeedImage({
      imagePath,
      prompt,
      promptPath,
      model: request.model,
      message: `Wavespeed image generation failed with ${response.status}.`,
    });
  }
  let body: WavespeedImageResponse;
  try {
    body = await resolveWavespeedImageResponse({
      initialResponse: normalizeWavespeedImageResponse((await response.json()) as WavespeedImageResponse),
      fetchImpl: input.fetchImpl ?? fetch,
      authorization: `Bearer ${normalizedApiKey}`,
      pollIntervalMs: input.pollIntervalMs ?? WAVESPEED_IMAGE_POLL_INTERVAL_MS,
      maxPolls: input.maxPolls ?? WAVESPEED_IMAGE_MAX_POLLS,
    });
  } catch (error) {
    return writeFailedWavespeedImage({
      imagePath,
      prompt,
      promptPath,
      model: request.model,
      message: error instanceof Error ? error.message : "Wavespeed image result polling failed.",
    });
  }
  const outputUrl = body.outputs?.[0];
  if (!outputUrl) {
    if (body.status === "failed") {
      return writeFailedWavespeedImage({
        imagePath,
        prompt,
        promptPath,
        model: request.model,
        message: `Wavespeed image generation failed for ${locale}. id=${body.id ?? "unknown"} error=${formatProviderError(body.error)}`,
      });
    }
    return writeFailedWavespeedImage({
      imagePath,
      prompt,
      promptPath,
      model: request.model,
      message: `Wavespeed image generation timed out after ${((input.pollIntervalMs ?? WAVESPEED_IMAGE_POLL_INTERVAL_MS) * (input.maxPolls ?? WAVESPEED_IMAGE_MAX_POLLS)) / 1000}s for ${locale}. status=${body.status ?? "unknown"} id=${body.id ?? "unknown"}`,
    });
  }

  await writeFile(imagePath, `Wavespeed image URL\n${outputUrl}\n`, "utf8");

  return {
    provider: "wavespeed",
    model: request.model,
    status: body.status === "failed" ? "failed" : "completed",
    imagePath,
    imageUrl: outputUrl,
    promptPath,
    assetPaths: prompt.referencedAssets.map((asset) => asset.localPath),
    warnings: ["Stored the Wavespeed output URL in the image artifact placeholder. Replace with binary download when production storage is selected."],
  };
}

async function writeFailedWavespeedImage(input: {
  imagePath: string;
  prompt: ImagePromptResult;
  promptPath: string;
  model: string;
  message: string;
}): Promise<GeneratedImageResult> {
  await writeFile(input.imagePath, `Wavespeed image generation failed\n${input.message}\n`, "utf8");
  return {
    provider: "wavespeed",
    model: input.model,
    status: "failed",
    imagePath: input.imagePath,
    promptPath: input.promptPath,
    assetPaths: input.prompt.referencedAssets.map((asset) => asset.localPath),
    warnings: [input.message],
  };
}

async function writeFailedOpenAIImage(input: {
  imagePath: string;
  prompt: ImagePromptResult;
  promptPath: string;
  model: string;
  message: string;
}): Promise<GeneratedImageResult> {
  await writeFile(input.imagePath, `OpenAI image generation failed\n${input.message}\n`, "utf8");
  return {
    provider: "openai",
    model: input.model,
    status: "failed",
    imagePath: input.imagePath,
    promptPath: input.promptPath,
    assetPaths: input.prompt.referencedAssets.map((asset) => asset.localPath),
    warnings: [input.message],
  };
}

function imageResultUrls(response: WavespeedImageResponse) {
  const urls = response.urls ?? {};
  const preferred = urls.get ?? urls.result;
  const resultUrls: string[] = [];
  if (typeof preferred === "string" && preferred) resultUrls.push(preferred);
  resultUrls.push(...Object.values(urls).filter((value): value is string => typeof value === "string" && value.length > 0));
  const requestId = response.id ?? response.requestId ?? response.request_id;
  if (requestId) {
    resultUrls.push(`${WAVESPEED_PREDICTIONS_ENDPOINT}/${requestId}`);
    resultUrls.push(`${WAVESPEED_PREDICTIONS_ENDPOINT}/${requestId}/result`);
  }
  return [...new Set(resultUrls)];
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveWavespeedImageResponse(input: {
  initialResponse: WavespeedImageResponse;
  fetchImpl: typeof fetch;
  authorization: string;
  pollIntervalMs: number;
  maxPolls: number;
}) {
  let current = input.initialResponse;
  for (let attempt = 0; attempt < input.maxPolls; attempt += 1) {
    if (current.outputs?.[0] || current.status === "failed") return current;
    const resultUrls = imageResultUrls(current);
    if (!resultUrls.length) return current;
    if (attempt > 0 && input.pollIntervalMs > 0) await wait(input.pollIntervalMs);
    let next: WavespeedImageResponse | undefined;
    let lastStatus: number | undefined;
    for (const resultUrl of resultUrls) {
      const response = await input.fetchImpl(resultUrl, {
        method: "GET",
        headers: {
          Authorization: input.authorization,
        },
      });
      lastStatus = response.status;
      if (!response.ok) continue;
      next = normalizeWavespeedImageResponse((await response.json()) as WavespeedImageResponse);
      break;
    }
    if (!next) {
      throw new Error(`Wavespeed image result polling failed with ${lastStatus ?? "unknown"}.`);
    }
    current = next;
  }
  return current;
}

function normalizeWavespeedImageResponse(response: WavespeedImageResponse): WavespeedImageResponse {
  if (response.data && typeof response.data === "object") {
    return response.data as WavespeedImageResponse;
  }
  return response;
}

function formatProviderError(error: unknown) {
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") return JSON.stringify(error);
  return "unknown";
}
