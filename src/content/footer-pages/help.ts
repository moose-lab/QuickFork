import { BookOpen } from "lucide-react";

import type { FooterPageContent } from "./types";

export const helpPage: FooterPageContent = {
  title: "Help Center",
  kicker: "Support / Launch workflow",
  description:
    "Get the shortest path from repository URL to a reviewable launch package, with guidance for inputs, generated outputs, and team handoff.",
  canonicalUrl: "https://seekersai.com/help",
  metaDescription:
    "QuickFork help for generating source-backed launch assets, reviewing artifacts, and contacting the team.",
  icon: BookOpen,
  sections: [
    {
      title: "Start with a public repository.",
      copy: "QuickFork works best when the repo has a README, project metadata, topics, links, or referenced identity assets.",
      items: [
        "Paste a GitHub repository URL into the homepage generator.",
        "Keep English selected first, then add Chinese or Japanese when the source story is stable.",
        "Use the generated image, prompt, and quality paths as review artifacts before publishing.",
      ],
    },
    {
      title: "Review the output before using it.",
      copy: "The product is designed for launch preparation, not one-click publishing.",
      items: [
        "Check that claims come from repository evidence or explicit user input.",
        "Replace weak project descriptions in the repo before regenerating the launch package.",
        "Use the contact route when you need founder-led help or partner follow-up.",
      ],
    },
    {
      title: "Escalate when the launch needs judgment.",
      copy: "Use the contact route when the repo has commercial claims, partner language, or team review needs.",
      items: [
        "Share the public repo and launch deadline in the request.",
        "Keep private customer data, credentials, and unreleased claims out of the form.",
        "Ask for a launch-package review when you need a human source check before distribution.",
      ],
    },
  ],
  cta: {
    label: "Contact the team",
    href: "/contact",
  },
};
