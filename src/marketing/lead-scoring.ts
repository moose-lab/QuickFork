import type { CrmLifecycleStage } from "../server/crm/types";

export type LeadActivityType =
  | "resource_page_viewed"
  | "example_page_viewed"
  | "lead_magnet_requested"
  | "signup_completed"
  | "generation_started"
  | "generation_completed"
  | "generated_image_downloaded"
  | "demo_requested"
  | "sales_contact_requested";

export interface LeadActivitySignal {
  type: LeadActivityType;
  count?: number;
}

export interface LeadScoringInput {
  roleSegment?: string;
  companyDomain?: string;
  emailDomain?: string;
  activities: LeadActivitySignal[];
}

export interface LeadScoringResult {
  fitScore: number;
  engagementScore: number;
  recommendedLifecycleStage: CrmLifecycleStage;
  reasonCodes: string[];
}

const fitScoresByRole: Record<string, number> = {
  founder: 30,
  open_source_maintainer: 28,
  developer_advocate: 26,
  product_marketer: 24,
  design_lead: 20,
  research_engineer: 18,
};

const engagementScoresByActivity: Record<LeadActivityType, number> = {
  resource_page_viewed: 6,
  example_page_viewed: 8,
  lead_magnet_requested: 15,
  signup_completed: 25,
  generation_started: 25,
  generation_completed: 35,
  generated_image_downloaded: 20,
  demo_requested: 45,
  sales_contact_requested: 40,
};

const personalEmailDomains = new Set(["gmail.com", "outlook.com", "hotmail.com", "icloud.com", "yahoo.com"]);

export function scoreLead(input: LeadScoringInput): LeadScoringResult {
  const reasonCodes: string[] = [];
  const roleSegment = input.roleSegment?.trim().toLowerCase();
  const roleFitScore = roleSegment ? fitScoresByRole[roleSegment] ?? 0 : 0;
  if (roleSegment && roleFitScore > 0) {
    reasonCodes.push(`fit:${roleSegment}`);
  }

  const emailDomain = input.emailDomain?.trim().toLowerCase();
  const hasCompanyDomain = Boolean(input.companyDomain?.trim());
  const hasPersonalEmailDomain = Boolean(emailDomain && personalEmailDomains.has(emailDomain));
  const domainFitScore = hasCompanyDomain ? 15 : hasPersonalEmailDomain ? -10 : 0;
  if (hasCompanyDomain) {
    reasonCodes.push("fit:company_domain");
  }
  if (hasPersonalEmailDomain) {
    reasonCodes.push("negative:personal_email_domain");
  }

  const fitScore = clampScore(roleFitScore + domainFitScore);
  const engagementScore = clampScore(
    input.activities.reduce((total, activity) => {
      const count = Math.max(1, activity.count ?? 1);
      const activityScore = engagementScoresByActivity[activity.type] * count;
      if (activityScore > 0) {
        reasonCodes.push(`engagement:${activity.type}`);
      }
      return total + activityScore;
    }, 0),
  );

  const activityTypes = new Set(input.activities.map((activity) => activity.type));
  const hasProductQualification = activityTypes.has("generation_completed");
  const hasSalesRequest = activityTypes.has("demo_requested") || activityTypes.has("sales_contact_requested");
  const recommendedLifecycleStage = getRecommendedLifecycleStage({
    fitScore,
    engagementScore,
    hasProductQualification,
    hasSalesRequest,
  });
  reasonCodes.push(getStageReasonCode(recommendedLifecycleStage));

  return {
    fitScore,
    engagementScore,
    recommendedLifecycleStage,
    reasonCodes,
  };
}

function getRecommendedLifecycleStage(input: {
  fitScore: number;
  engagementScore: number;
  hasProductQualification: boolean;
  hasSalesRequest: boolean;
}): CrmLifecycleStage {
  if (input.hasSalesRequest && input.fitScore >= 45) {
    return "sales_qualified_lead";
  }
  if (input.hasProductQualification) {
    return "product_qualified_lead";
  }
  if (input.fitScore >= 40 && input.engagementScore >= 60) {
    return "marketing_qualified_lead";
  }
  return "lead";
}

function getStageReasonCode(stage: CrmLifecycleStage) {
  switch (stage) {
    case "sales_qualified_lead":
      return "stage:sql";
    case "product_qualified_lead":
      return "stage:pql";
    case "marketing_qualified_lead":
      return "stage:mql";
    default:
      return "stage:lead";
  }
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}
