import type { IncomingMessage, ServerResponse } from "node:http";

import { MockCrmAdapter } from "../crm/mock-adapter.js";
import type {
  CrmActivityType,
  CrmAdapter,
  CrmAttributionTouch,
  CrmLifecycleStage,
} from "../crm/types.js";

type LeadCaptureIntent = "resource" | "demo" | "sales_contact" | "partnership";

interface LeadCaptureInput {
  intent: LeadCaptureIntent;
  email: string;
  name?: string;
  companyDomain?: string;
  roleSegment?: string;
  resourceSlug?: string;
  captureLocation?: string;
  requestType?: string;
  contactReason?: string;
  crmCampaign?: string;
  firstTouch: CrmAttributionTouch;
  lastTouch: CrmAttributionTouch;
}

interface LeadCaptureOptions {
  crm?: CrmAdapter;
  now?: () => string;
}

type LeadCaptureErrorCode = "VALIDATION_ERROR" | "METHOD_NOT_ALLOWED" | "CRM_SYNC_FAILED";

const defaultCrmAdapter = new MockCrmAdapter();
const supportedIntents = ["resource", "demo", "sales_contact", "partnership"] as const;

export class LeadCaptureError extends Error {
  constructor(
    readonly code: LeadCaptureErrorCode,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "LeadCaptureError";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export async function captureLead(body: unknown, options: LeadCaptureOptions = {}) {
  const now = options.now ?? (() => new Date().toISOString());
  const input = normalizeLeadCaptureInput(body, now);
  const crm = options.crm ?? defaultCrmAdapter;
  const lifecycleStage = getLifecycleStage(input.intent);

  try {
    const lead = await crm.upsertLead({
      identity: {
        email: input.email,
        name: input.name,
        companyDomain: input.companyDomain,
        roleSegment: input.roleSegment,
      },
      lifecycleStage,
      firstTouch: input.firstTouch,
      lastTouch: input.lastTouch,
      fitScore: getDefaultFitScore(input.intent),
      engagementScore: getDefaultEngagementScore(input.intent),
      sourcePage: input.firstTouch.landingPage ?? input.lastTouch.landingPage,
    });
    const activity = await crm.createActivity({
      leadId: lead.id,
      type: getActivityType(input.intent),
      occurredAt: input.lastTouch.capturedAt,
      properties: {
        intent: input.intent,
        resourceSlug: input.resourceSlug,
        captureLocation: input.captureLocation,
        requestType: input.requestType,
        contactReason: input.contactReason,
        crmCampaign: input.crmCampaign,
        sourcePage: input.firstTouch.landingPage ?? input.lastTouch.landingPage,
      },
    });

    return {
      leadId: lead.id,
      lifecycleStage: lead.lifecycleStage,
      activityId: activity.id,
    };
  } catch (error) {
    if (error instanceof LeadCaptureError) throw error;
    throw new LeadCaptureError("CRM_SYNC_FAILED", "Lead capture could not be completed.", 502);
  }
}

export function normalizeLeadCaptureInput(body: unknown, now: () => string = () => new Date().toISOString()) {
  if (!body || typeof body !== "object") {
    throw new LeadCaptureError("VALIDATION_ERROR", "Request body must be a JSON object.", 422);
  }

  const value = body as Record<string, unknown>;
  const intent = normalizeIntent(value.intent);
  const email = normalizeEmail(value.email);
  const resourceSlug = normalizeOptionalString(value.resourceSlug, "resourceSlug");
  if (intent === "resource" && !resourceSlug) {
    throw new LeadCaptureError("VALIDATION_ERROR", "resourceSlug is required for resource lead capture.", 422);
  }

  return {
    intent,
    email,
    name: normalizeOptionalString(value.name, "name"),
    companyDomain: normalizeOptionalString(value.companyDomain, "companyDomain"),
    roleSegment: normalizeOptionalString(value.roleSegment, "roleSegment"),
    resourceSlug,
    captureLocation: normalizeOptionalString(value.captureLocation, "captureLocation"),
    requestType: normalizeOptionalString(value.requestType, "requestType"),
    contactReason: normalizeOptionalString(value.contactReason, "contactReason"),
    crmCampaign: normalizeOptionalString(value.crmCampaign, "crmCampaign"),
    firstTouch: normalizeAttributionTouch(value.firstTouch, now),
    lastTouch: normalizeAttributionTouch(value.lastTouch, now),
  } satisfies LeadCaptureInput;
}

export function createLeadCaptureHandler(options: LeadCaptureOptions = {}) {
  return async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      sendError(res, 405, "METHOD_NOT_ALLOWED", "Use POST /api/lead-capture.");
      return;
    }

    try {
      const body = await readJsonBody(req);
      const result = await captureLead(body, options);
      sendJson(res, 201, result);
    } catch (error) {
      if (error instanceof LeadCaptureError) {
        sendError(res, error.statusCode, error.code, error.message);
        return;
      }

      sendError(res, 500, "CRM_SYNC_FAILED", "Lead capture could not be completed.");
    }
  };
}

function normalizeIntent(value: unknown): LeadCaptureIntent {
  if (typeof value !== "string" || !supportedIntents.includes(value as LeadCaptureIntent)) {
    throw new LeadCaptureError("VALIDATION_ERROR", "intent is not supported.", 422);
  }
  return value as LeadCaptureIntent;
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") {
    throw new LeadCaptureError("VALIDATION_ERROR", "email must be a valid email address.", 422);
  }

  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new LeadCaptureError("VALIDATION_ERROR", "email must be a valid email address.", 422);
  }
  return email;
}

function normalizeOptionalString(value: unknown, fieldName: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    throw new LeadCaptureError("VALIDATION_ERROR", `${fieldName} must be a non-empty string.`, 422);
  }
  return value.trim().slice(0, 240);
}

function normalizeAttributionTouch(value: unknown, now: () => string): CrmAttributionTouch {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    source: normalizeOptionalString(source.source, "source"),
    medium: normalizeOptionalString(source.medium, "medium"),
    campaign: normalizeOptionalString(source.campaign, "campaign"),
    content: normalizeOptionalString(source.content, "content"),
    term: normalizeOptionalString(source.term, "term"),
    landingPage: normalizeOptionalString(source.landingPage, "landingPage"),
    referrer: normalizeOptionalString(source.referrer, "referrer"),
    capturedAt: normalizeOptionalString(source.capturedAt, "capturedAt") ?? now(),
  };
}

function getLifecycleStage(intent: LeadCaptureIntent): CrmLifecycleStage {
  switch (intent) {
    case "resource":
      return "lead";
    case "demo":
    case "sales_contact":
      return "sales_qualified_lead";
    case "partnership":
      return "partner_qualified";
  }
}

function getActivityType(intent: LeadCaptureIntent): CrmActivityType {
  switch (intent) {
    case "resource":
      return "lead_magnet_requested";
    case "demo":
      return "demo_requested";
    case "sales_contact":
    case "partnership":
      return "sales_contact_requested";
  }
}

function getDefaultFitScore(intent: LeadCaptureIntent) {
  switch (intent) {
    case "resource":
      return 35;
    case "demo":
      return 70;
    case "sales_contact":
      return 60;
    case "partnership":
      return 55;
  }
}

function getDefaultEngagementScore(intent: LeadCaptureIntent) {
  switch (intent) {
    case "resource":
      return 45;
    case "demo":
      return 80;
    case "sales_contact":
      return 70;
    case "partnership":
      return 65;
  }
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
    throw new LeadCaptureError("VALIDATION_ERROR", "Request body must be valid JSON.", 422);
  }
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function sendError(
  res: ServerResponse,
  statusCode: number,
  code: LeadCaptureErrorCode,
  message: string,
) {
  sendJson(res, statusCode, {
    error: {
      code,
      message,
    },
  });
}
