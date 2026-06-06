import { ShieldCheck } from "lucide-react";

import type { FooterPageContent } from "./types";

export const privacyPage: FooterPageContent = {
  title: "Privacy Policy",
  kicker: "Legal / Data handling",
  description:
    "QuickFork is built around public repository evidence and explicit user input. This page explains the current privacy posture for the public site.",
  canonicalUrl: "https://seekersai.com/privacy",
  metaDescription:
    "QuickFork privacy policy for public repository input, generated launch assets, analytics, and contact forms.",
  icon: ShieldCheck,
  sections: [
    {
      title: "Effective date: June 6, 2026",
      copy: "This policy covers the QuickFork public website, repository launch generator, contact forms, and generated launch-asset review workflow.",
      items: [
        "QuickFork is designed for public repositories and explicit user-submitted launch context.",
        "The product should avoid storing secrets, private customer records, or sensitive unreleased claims in browser analytics.",
        "Legal and support requests can be sent through the contact route when a correction or removal is needed.",
      ],
    },
    {
      title: "Public repository inputs.",
      copy: "QuickFork uses public repository evidence, official project assets, README content, public metadata, and details users intentionally submit.",
      items: [
        "Repository URLs and public repo content may be used to prepare briefs, visuals, prompts, copy, and quality reports.",
        "Generated drafts are review artifacts; users should confirm the source facts before publishing them.",
        "Private repositories and confidential launch claims should not be submitted through the public site.",
      ],
    },
    {
      title: "Contact forms and analytics.",
      copy: "Forms collect the business details needed to reply, while browser analytics should stay limited to privacy-safe product events.",
      items: [
        "Contact requests may include name, email, company, website, launch timing, and a short project description.",
        "Analytics events should describe actions such as page views, CTA clicks, generation starts, and form completion without raw form contents.",
        "Server-side systems may keep qualified contact records so the team can respond and maintain audit context.",
      ],
    },
    {
      title: "What not to submit.",
      copy: "Do not submit credentials, API keys, unreleased financials, customer data, private source code, or claims that should not appear in drafts.",
      items: [
        "Remove sensitive files, tokens, and private data from public repositories before using them as launch inputs.",
        "Use official assets or approved brand materials when a generated asset references a logo, partner, or affiliation.",
        "Review generated content before sharing it with customers, investors, partners, or public channels.",
      ],
    },
  ],
  cta: {
    label: "Contact the team",
    href: "/contact",
  },
};
