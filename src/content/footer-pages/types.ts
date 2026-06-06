import type { LucideIcon } from "lucide-react";

export type FooterPageKey = "help" | "privacy" | "terms";

export type FooterPageContent = {
  title: string;
  kicker: string;
  description: string;
  canonicalUrl: string;
  metaDescription: string;
  icon: LucideIcon;
  sections: readonly FooterPageSection[];
  cta?: {
    label: string;
    href: string;
  };
};

type FooterPageSection = {
  title: string;
  copy: string;
  items: readonly string[];
};
