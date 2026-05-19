import { ArrowRight, BookOpen, FileCheck, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

import { LandingFooter } from "./LandingSections";
import { LandingNav } from "./LandingNav";

type SecondaryPageKey = "help" | "privacy" | "terms";

type SecondaryPageContent = {
  title: string;
  kicker: string;
  description: string;
  canonicalUrl: string;
  metaDescription: string;
  icon: typeof BookOpen;
  sections: Array<{
    title: string;
    copy: string;
    items: string[];
  }>;
  cta?: {
    label: string;
    href: string;
  };
};

const secondaryPages: Record<SecondaryPageKey, SecondaryPageContent> = {
  help: {
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
    ],
    cta: {
      label: "Contact the team",
      href: "/contact",
    },
  },
  privacy: {
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
        title: "What data is used.",
        copy: "QuickFork should only use repository evidence, official project assets, README content, public metadata, or explicit user input.",
        items: [
          "Repository URLs and public repo content can be used to prepare launch assets.",
          "Contact and resource forms ask for business contact details needed to reply.",
          "Analytics events should describe product actions without storing sensitive form contents.",
        ],
      },
      {
        title: "What not to submit.",
        copy: "Do not submit secrets, credentials, private customer data, or unreleased claims that should not appear in generated drafts.",
        items: [
          "Use public repos when you need traceable launch materials.",
          "Review generated copy before sharing it outside your team.",
          "Contact the team for removal or correction requests.",
        ],
      },
    ],
    cta: {
      label: "Contact the team",
      href: "/contact",
    },
  },
  terms: {
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
        title: "Use the product responsibly.",
        copy: "Do not use QuickFork to publish unsupported claims, invented metrics, fake logos, or misleading project proof.",
        items: [
          "You are responsible for reviewing generated launch assets before publication.",
          "Generated drafts should be checked against the source repository and your project facts.",
          "Do not use the service to misrepresent ownership, affiliation, benchmarks, or endorsements.",
        ],
      },
      {
        title: "Keep the workflow source-backed.",
        copy: "QuickFork helps turn repository context into launch materials, but final editorial judgment stays with the user.",
        items: [
          "Use official assets or repo evidence when possible.",
          "Remove private or sensitive information before submitting a repository or form.",
          "Contact the team when a use case needs a written agreement or partnership review.",
        ],
      },
    ],
    cta: {
      label: "Contact the team",
      href: "/contact",
    },
  },
};

export function getSecondaryPage(pathname: string) {
  const normalized = pathname.replace(/^\/+|\/+$/g, "") as SecondaryPageKey;
  return secondaryPages[normalized];
}

export function SecondaryPage({ page }: { page: SecondaryPageContent }) {
  const Icon = page.icon;

  useEffect(() => applySecondaryPageMetadata(page), [page]);

  return (
    <div className="siteShell">
      <LandingNav />
      <main className="secondaryPage">
        <section className="secondaryHero" aria-labelledby="secondary-page-title">
          <div className="secondaryHeroCopy">
            <span className="monoLabel">{page.kicker}</span>
            <h1 id="secondary-page-title">{page.title}</h1>
            <p>{page.description}</p>
            {page.cta ? (
              <a className="primaryButton" href={page.cta.href}>
                {page.cta.label}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <aside className="secondarySignalPanel" aria-label={`${page.title} route details`}>
            <Icon size={32} aria-hidden="true" />
            <span>{page.canonicalUrl}</span>
          </aside>
        </section>

        <section className="secondaryBody" aria-label={`${page.title} details`}>
          {page.sections.map((section) => (
            <article className="secondaryArticle" key={section.title}>
              <div>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

function applySecondaryPageMetadata(page: SecondaryPageContent) {
  const previousTitle = document.title;
  const descriptionMeta = getOrCreateMetaDescription();
  const canonicalLink = getOrCreateCanonicalLink();
  const previousDescription = descriptionMeta.getAttribute("content");
  const previousCanonical = canonicalLink.getAttribute("href");

  document.title = `${page.title} | QuickFork`;
  descriptionMeta.setAttribute("content", page.metaDescription);
  canonicalLink.setAttribute("href", page.canonicalUrl);

  return () => {
    document.title = previousTitle;
    if (previousDescription === null) {
      descriptionMeta.removeAttribute("content");
    } else {
      descriptionMeta.setAttribute("content", previousDescription);
    }
    if (previousCanonical === null) {
      canonicalLink.removeAttribute("href");
    } else {
      canonicalLink.setAttribute("href", previousCanonical);
    }
  };
}

function getOrCreateMetaDescription() {
  const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (existing) return existing;

  const meta = document.createElement("meta");
  meta.name = "description";
  document.head.appendChild(meta);
  return meta;
}

function getOrCreateCanonicalLink() {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "canonical";
  document.head.appendChild(link);
  return link;
}
