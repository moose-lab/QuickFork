export type ProductOutreachOutputId =
  | "launch_email_draft"
  | "community_feedback_post"
  | "partner_newsletter_note"
  | "product_hunt_first_comment"
  | "human_review_checklist";

export interface ProductOutreachOutput {
  id: ProductOutreachOutputId;
  title: string;
  channel: string;
  sourceLabel: string;
  sourceUrl: string;
  projectQuestion: string;
  quickForkSurface: string;
  activationMetric: string;
  guardrail: string;
}

export interface ProductOutreachPackage {
  title: string;
  claimBoundary: string;
  outputs: ProductOutreachOutput[];
}

export const productOutreachPackage: ProductOutreachPackage = {
  title: "Product outreach outputs",
  claimBoundary:
    "This source-backed outreach package creates human-reviewed drafts for launch follow-up. It does not send messages, collect leads, promise replies, or replace platform and legal review.",
  outputs: [
    {
      id: "launch_email_draft",
      title: "Launch email draft",
      channel: "Owned email or direct founder follow-up",
      sourceLabel: "FTC CAN-SPAM compliance guide",
      sourceUrl: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      projectQuestion: "What repo-backed value can be shared in one short, truthful follow-up note?",
      quickForkSurface: "A source-backed outreach draft that reuses the launch brief, repo URL, and human-approved ask.",
      activationMetric: "launch_artifact_copied:outreach",
      guardrail: "Keep identity, subject, opt-out, and contact context under human review before any commercial email is sent.",
    },
    {
      id: "community_feedback_post",
      title: "Community feedback post",
      channel: "Open-source communities, forums, and technical discussion spaces",
      sourceLabel: "Open Source Guides finding users",
      sourceUrl: "https://opensource.guide/finding-users/",
      projectQuestion: "Which audience should be asked for feedback, and what question helps them evaluate the repo?",
      quickForkSurface: "A feedback-oriented community post angle tied to audience hypothesis, README evidence, and setup path.",
      activationMetric: "launch_artifact_downloaded:outreach",
      guardrail: "Ask for feedback in the right community and keep the post useful even if nobody clicks through.",
    },
    {
      id: "partner_newsletter_note",
      title: "Partner or newsletter note",
      channel: "Borrowed audiences, partner newsletters, and DevRel roundups",
      sourceLabel: "coreyhaines31/marketingskills",
      sourceUrl: "https://github.com/coreyhaines31/marketingskills",
      projectQuestion: "Which borrowed or owned channel can reuse the repo story without turning it into generic promotion?",
      quickForkSurface: "A short partner-ready note that explains the repository, target user, proof boundary, and review ask.",
      activationMetric: "cta_clicked:request_launch_package",
      guardrail: "Keep the note source-backed and scoped to a specific audience instead of broad mass promotion.",
    },
    {
      id: "product_hunt_first_comment",
      title: "Product Hunt first comment",
      channel: "Product Hunt launch day",
      sourceLabel: "Product Hunt launch guide",
      sourceUrl: "https://www.producthunt.com/launch/preparing-for-launch",
      projectQuestion: "What launch-day context should the maker explain after the tagline and gallery assets are ready?",
      quickForkSurface: "A first-comment outline that aligns product story, repo evidence, launch ask, and human response plan.",
      activationMetric: "cta_clicked:generate_launch_card",
      guardrail: "Do not ask for votes or imply launch outcomes; keep the comment focused on context and questions.",
    },
    {
      id: "human_review_checklist",
      title: "Human review checklist",
      channel: "Pre-send review across email, community, partner, and launch platforms",
      sourceLabel: "Hacker News guidelines",
      sourceUrl: "https://news.ycombinator.com/newsguidelines.html",
      projectQuestion: "Which claims, links, and asks need a human check before public follow-up?",
      quickForkSurface: "A review checklist for source references, platform tone, contact context, unsupported claims, and next-step clarity.",
      activationMetric: "launch_artifact_copied:story_map",
      guardrail: "Respect community norms, avoid salesy framing in discussion spaces, and make the human reviewer accountable.",
    },
  ],
};
