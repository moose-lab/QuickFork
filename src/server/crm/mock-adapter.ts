import type {
  CrmActivityInput,
  CrmActivityRecord,
  CrmAdapter,
  CrmLeadRecord,
  CrmLeadUpsertInput,
  CrmLifecycleUpdateInput,
  CrmOpportunityInput,
  CrmOpportunityRecord,
} from "./types.js";

interface MockCrmAdapterOptions {
  now?: () => string;
}

export class MockCrmAdapter implements CrmAdapter {
  private readonly now: () => string;
  private readonly leadsByEmail = new Map<string, CrmLeadRecord>();
  private readonly leadsById = new Map<string, CrmLeadRecord>();
  private readonly activities: CrmActivityRecord[] = [];
  private readonly opportunities: CrmOpportunityRecord[] = [];

  constructor(options: MockCrmAdapterOptions = {}) {
    this.now = options.now ?? (() => new Date().toISOString());
  }

  async upsertLead(input: CrmLeadUpsertInput) {
    const email = normalizeEmail(input.identity.email);
    const existingLead = this.leadsByEmail.get(email);
    const timestamp = this.now();

    if (existingLead) {
      const updatedLead: CrmLeadRecord = {
        ...existingLead,
        ...input,
        identity: {
          ...existingLead.identity,
          ...input.identity,
          email,
        },
        firstTouch: existingLead.firstTouch,
        lastTouch: input.lastTouch,
        fitScore: input.fitScore ?? existingLead.fitScore,
        engagementScore: input.engagementScore ?? existingLead.engagementScore,
        updatedAt: timestamp,
      };
      this.storeLead(updatedLead);
      return updatedLead;
    }

    const lead: CrmLeadRecord = {
      ...input,
      id: `lead_${this.leadsById.size + 1}`,
      identity: {
        ...input.identity,
        email,
      },
      fitScore: input.fitScore ?? 0,
      engagementScore: input.engagementScore ?? 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.storeLead(lead);
    return lead;
  }

  async createActivity(input: CrmActivityInput) {
    this.assertLeadExists(input.leadId);

    const activity: CrmActivityRecord = {
      ...input,
      id: `activity_${this.activities.length + 1}`,
      properties: { ...(input.properties ?? {}) },
      createdAt: this.now(),
    };
    this.activities.push(activity);
    return activity;
  }

  async updateLifecycleStage(input: CrmLifecycleUpdateInput) {
    const lead = this.assertLeadExists(input.leadId);
    const updatedLead: CrmLeadRecord = {
      ...lead,
      lifecycleStage: input.lifecycleStage,
      fitScore: input.fitScore ?? lead.fitScore,
      engagementScore: input.engagementScore ?? lead.engagementScore,
      qualificationReason: input.qualificationReason ?? lead.qualificationReason,
      updatedAt: this.now(),
    };

    this.storeLead(updatedLead);
    return updatedLead;
  }

  async createOpportunity(input: CrmOpportunityInput) {
    this.assertLeadExists(input.leadId);

    const timestamp = this.now();
    const opportunity: CrmOpportunityRecord = {
      ...input,
      id: `opportunity_${this.opportunities.length + 1}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.opportunities.push(opportunity);
    return opportunity;
  }

  listLeads() {
    return Array.from(this.leadsById.values());
  }

  listActivities() {
    return [...this.activities];
  }

  listOpportunities() {
    return [...this.opportunities];
  }

  private storeLead(lead: CrmLeadRecord) {
    this.leadsByEmail.set(lead.identity.email, lead);
    this.leadsById.set(lead.id, lead);
  }

  private assertLeadExists(leadId: string) {
    const lead = this.leadsById.get(leadId);
    if (!lead) {
      throw new Error(`CRM lead not found: ${leadId}`);
    }
    return lead;
  }
}

function normalizeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("CRM lead email is required.");
  }
  return normalizedEmail;
}
