import type { IncomingMessage, ServerResponse } from "node:http";

import { runProjectLaunchGeneration } from "../src/server/generation/orchestrator.js";
import type { CreateGenerationInput } from "../src/server/generation/types.js";
import { GenerationError } from "../src/server/generation/types.js";

type ApiErrorCode = "VALIDATION_ERROR" | "METHOD_NOT_ALLOWED" | "GENERATION_FAILED";

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, statusCode: number, code: ApiErrorCode, message: string, details?: unknown) {
  sendJson(res, statusCode, {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new GenerationError("VALIDATION_ERROR", "Request body must be valid JSON.");
  }
}

function normalizeCreateGenerationInput(body: unknown): CreateGenerationInput {
  if (!body || typeof body !== "object") {
    throw new GenerationError("VALIDATION_ERROR", "Request body must be a JSON object.");
  }
  const value = body as Partial<CreateGenerationInput>;
  if (typeof value.repoUrl !== "string" || !value.repoUrl.trim()) {
    throw new GenerationError("VALIDATION_ERROR", "repoUrl is required.");
  }
  return value as CreateGenerationInput;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Use POST /api/generations.");
    return;
  }

  try {
    const body = await readJsonBody(req);
    const input = normalizeCreateGenerationInput(body);
    const result = await runProjectLaunchGeneration(input);
    sendJson(res, 201, result);
  } catch (error) {
    if (error instanceof GenerationError) {
      const statusCode = error.code === "VALIDATION_ERROR" ? 422 : error.code === "METHOD_NOT_ALLOWED" ? 405 : 500;
      sendError(res, statusCode, error.code, error.message, error.details);
      return;
    }
    sendError(res, 500, "GENERATION_FAILED", "Failed to generate QuickFork marketing card package.");
  }
}
