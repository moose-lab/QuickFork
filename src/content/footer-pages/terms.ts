import { FileCheck } from "lucide-react";

import type { FooterPageContent } from "./types";

export const termsPage: FooterPageContent = {
  title: "Terms of Service",
  kicker: "Legal / Usage terms",
  description:
    "These terms define the practical rules for using QuickFork to prepare source-backed repository launch assets.",
  canonicalUrl: "https://seekersai.com/terms",
  metaDescription:
    "QuickFork terms of service for source-backed launch copy, generated images, contact forms, and responsible use.",
  icon: FileCheck,
  sections: [
    {
      title: "Effective date: June 6, 2026",
      copy: "These terms apply when you browse QuickFork, submit a repository, request a launch package, or use generated launch materials.",
      items: [
        "By using the public site, you agree to use generated assets only after reviewing them against your project facts.",
        "If you are using QuickFork for a company or client, you are responsible for having permission to submit the relevant project information.",
        "Additional written terms may apply to paid, partner, agency, or human-review engagements.",
      ],
    },
    {
      title: "Source-backed use.",
      copy: "QuickFork helps turn public repository context into launch materials, but final editorial judgment stays with the user.",
      items: [
        "Use repository evidence, official assets, README content, and approved user input as the basis for launch claims.",
        "Do not use QuickFork to invent customer counts, benchmarks, endorsements, logos, rankings, or commercial proof.",
        "Do not misrepresent ownership, affiliation, security posture, regulatory status, or partner approval.",
      ],
    },
    {
      title: "Review before publishing.",
      copy: "You are responsible for reviewing generated launch assets before publication or commercial use.",
      items: [
        "Check generated copy, visuals, prompts, and manifests against your source repository and approved project facts.",
        "Remove private, sensitive, incorrect, or unsupported material before sharing drafts externally.",
        "Keep a human review step for legal, pricing, partnership, and performance claims.",
      ],
    },
    {
      title: "Responsible service use.",
      copy: "Use the site in a way that protects the service, other users, and the accuracy of public launch materials.",
      items: [
        "Do not submit malicious content, attempt to disrupt the service, or bypass access controls.",
        "Do not use generated materials for deceptive outreach, impersonation, spam, or unsupported commercial claims.",
        "Contact the team when a use case needs a written agreement, correction, or removal review.",
      ],
    },
  ],
  cta: {
    label: "Contact the team",
    href: "/contact",
  },
};
