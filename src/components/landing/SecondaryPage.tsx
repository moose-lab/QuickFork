import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { footerPageKeys, footerPages, type FooterPageContent, type FooterPageKey } from "../../content/footer-pages";
import { LandingFooter } from "./LandingSections";
import { LandingNav } from "./LandingNav";

export function getSecondaryPage(pathname: string) {
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  if (!isFooterPageKey(normalized)) return undefined;
  return footerPages[normalized];
}

export function SecondaryPage({ page }: { page: FooterPageContent }) {
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

function applySecondaryPageMetadata(page: FooterPageContent) {
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

function isFooterPageKey(value: string): value is FooterPageKey {
  return footerPageKeys.includes(value as FooterPageKey);
}
