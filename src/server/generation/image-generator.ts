import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { GeneratedImageResult, ImagePromptResult, LocaleCode } from "./types.js";

export async function generateMockImage(localeDir: string, locale: LocaleCode, prompt: ImagePromptResult): Promise<GeneratedImageResult> {
  await mkdir(localeDir, { recursive: true });
  const promptPath = join(localeDir, "marketing_card_prompt.txt");
  const imagePath = join(localeDir, "marketing-card.png");
  await writeFile(promptPath, prompt.prompt, "utf8");
  await writeFile(imagePath, `Mock QuickFork image\nlocale=${locale}\nmodel=${prompt.model}\nsize=${prompt.size}\n`, "utf8");

  return {
    provider: "mock",
    model: "gpt-image-2",
    status: "completed",
    imagePath,
    promptPath,
    assetPaths: prompt.referencedAssets.map((asset) => asset.localPath),
    warnings: [],
  };
}
