import { helpPage } from "./help";
import { privacyPage } from "./privacy";
import { termsPage } from "./terms";
import type { FooterPageContent, FooterPageKey } from "./types";

export type { FooterPageContent, FooterPageKey };

export const footerPageKeys = ["help", "privacy", "terms"] as const satisfies readonly FooterPageKey[];

export const footerPages: Record<FooterPageKey, FooterPageContent> = {
  help: helpPage,
  privacy: privacyPage,
  terms: termsPage,
};
