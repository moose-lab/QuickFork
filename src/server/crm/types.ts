export type CrmLifecycleStage =
  | "subscriber"
  | "lead"
  | "product_qualified_lead"
  | "marketing_qualified_lead"
  | "sales_qualified_lead"
  | "opportunity"
  | "customer"
  | "partner_qualified";

export type CrmActivityType =
  | "page_view"
  | "lead_magnet_requested"
  | "lead_magnet_delivered"
  | "generation_started"
  | "generation_completed"
  | "generated_image_downloaded"
  | "signup_completed"
  | "demo_requested"
  | "sales_contact_requested"
  | "showcase_published"
  | "manual_note";

export type CrmOpportunityStage =
  | "qualified"
  | "discovery"
  | "demo_evaluation"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export interface CrmAttributionTouch {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  referrer?: string;
  capturedAt: string;
}

export interface CrmLeadIdentity {
  email: string;
  name?: string;
  companyDomain?: string;
  roleSegment?: string;
}

export interface CrmLeadUpsertInput {
  identity: CrmLeadIdentity;
  lifecycleStage: CrmLifecycleStage;
  firstTouch: CrmAttributionTouch;
  lastTouch: CrmAttributionTouch;
  fitScore?: number;
  engagementScore?: number;
  sourcePage?: string;
  qualificationReason?: string;
}

export interface CrmLeadRecord extends CrmLeadUpsertInput {
  id: string;
  identity: CrmLeadIdentity;
  fitScore: number;
  engagementScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CrmActivityInput {
  leadId: string;
  type: CrmActivityType;
  occurredAt: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export interface CrmActivityRecord extends CrmActivityInput {
  id: string;
  createdAt: string;
}

export interface CrmLifecycleUpdateInput {
  leadId: string;
  lifecycleStage: CrmLifecycleStage;
  fitScore?: number;
  engagementScore?: number;
  qualificationReason?: string;
}

export interface CrmOpportunityInput {
  leadId: string;
  name: string;
  estimatedValue: number;
  currency: string;
  sourceCampaign: string;
  stage: CrmOpportunityStage;
}

export interface CrmOpportunityRecord extends CrmOpportunityInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmAdapter {
  upsertLead(input: CrmLeadUpsertInput): Promise<CrmLeadRecord>;
  createActivity(input: CrmActivityInput): Promise<CrmActivityRecord>;
  updateLifecycleStage(input: CrmLifecycleUpdateInput): Promise<CrmLeadRecord>;
  createOpportunity(input: CrmOpportunityInput): Promise<CrmOpportunityRecord>;
}
