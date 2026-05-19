import { ArrowRight, ExternalLink, Route, Search, Target } from "lucide-react";
import { useEffect } from "react";

import { LandingFooter } from "../landing/LandingSections";
import { LandingNav } from "../landing/LandingNav";
import { trackEvent } from "../../lib/analytics";
import { marketingPageLinks, type MarketingLink } from "../../marketing/link-catalog";
import {
  formatMarketingLabel,
  getMarketingPageDescription,
  getMarketingPageHeadline,
  getMarketingPageKicker,
  getMarketingPageTitle,
  getMarketingPageTypeLabel,
  getMarketingPrimaryCtaHref,
  getMarketingPrimaryCtaLabel,
} from "../../marketing/page-content";
import { LeadCaptureForm } from "./LeadCaptureForm";

interface MarketingPageProps {
  link: MarketingLink;
}

export function MarketingPage({ link }: MarketingPageProps) {
  const ctaLabel = getMarketingPrimaryCtaLabel(link);
  const ctaHref = getMarketingPrimaryCtaHref(link);
  const headline = getMarketingPageHeadline(link);
  const description = getMarketingPageDescription(link);
  const relatedLinks = getRelatedLinks(link);

  useEffect(() => applyRouteMetadata(link), [link]);

  useEffect(() => {
    if (link.pageType === "resource") {
      trackEvent("resource_page_viewed", {
        resource_slug: link.slug,
        resource_type: getResourceType(link),
        buyer_stage: link.buyerStage,
        page_type: link.pageType,
        intent_cluster: link.intentCluster,
      });
    }

    if (link.pageType === "example") {
      trackEvent("example_page_viewed", {
        example_slug: link.slug,
        repo_full_name: getExampleRepoName(link),
        source_type: "curated_catalog",
        buyer_stage: link.buyerStage,
        page_type: link.pageType,
        intent_cluster: link.intentCluster,
      });
    }
  }, [link]);

  function handlePrimaryCtaClick() {
    trackEvent("cta_clicked", {
      cta_id: link.primaryCta,
      cta_label: ctaLabel,
      cta_location: "marketing_page_hero",
      page_type: link.pageType,
      buyer_stage: link.buyerStage,
      intent_cluster: link.intentCluster,
      target_url: ctaHref,
    });
  }

  return (
    <div className="siteShell">
      <LandingNav />
      <main className="marketingPage">
        <section className="marketingHeroSection" aria-labelledby="marketing-page-title">
          <div className="marketingHeroGrid">
            <div className="marketingHeroCopy">
              <span className="monoLabel">{getMarketingPageKicker(link)}</span>
              <h1 id="marketing-page-title">{headline}</h1>
              <p>{description}</p>
              <div className="marketingActions">
                <a className="primaryButton" href={ctaHref} onClick={handlePrimaryCtaClick}>
                  {ctaLabel}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a className="secondaryButton" href="/#studio">
                  Open studio
                  <Route size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <aside className="marketingSignalPanel" aria-label="Marketing route details">
              <dl className="marketingMetaList">
                <div>
                  <dt>Page type</dt>
                  <dd>{getMarketingPageTypeLabel(link)}</dd>
                </div>
                <div>
                  <dt>Buyer stage</dt>
                  <dd>{formatMarketingLabel(link.buyerStage)}</dd>
                </div>
                <div>
                  <dt>Intent cluster</dt>
                  <dd>{formatMarketingLabel(link.intentCluster)}</dd>
                </div>
                <div>
                  <dt>Canonical</dt>
                  <dd>{link.canonicalUrl}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="marketingBodySection" aria-labelledby="marketing-workflow-title">
          <div className="marketingBodyGrid">
            <div className="marketingNarrative">
              <span className="monoLabel">Route purpose</span>
              <h2 id="marketing-workflow-title">Move from search intent to a generated launch asset.</h2>
              <p>
                This route is built around a clean canonical URL, a specific acquisition intent, and one product action.
                The copy stays tied to repository evidence so future SEO pages can scale without inventing performance
                claims.
              </p>
            </div>
            <div className="marketingStepRail" aria-label="Marketing funnel path">
              <article>
                <Search size={18} aria-hidden="true" />
                <strong>{formatMarketingLabel(link.primaryKeyword)}</strong>
                <span>Capture the query or campaign theme.</span>
              </article>
              <article>
                <Target size={18} aria-hidden="true" />
                <strong>{formatMarketingLabel(link.primaryCta)}</strong>
                <span>Route the visitor into one measurable action.</span>
              </article>
              <article>
                <ExternalLink size={18} aria-hidden="true" />
                <strong>{link.crmCampaign}</strong>
                <span>Keep UTM and CRM campaign names aligned.</span>
              </article>
            </div>
          </div>
        </section>

        {link.pageType === "resource" || link.pageType === "contact" ? (
          <section className="marketingCaptureSection">
            <LeadCaptureForm link={link} />
          </section>
        ) : null}

        {relatedLinks.length > 0 ? (
          <section className="marketingRelatedSection" aria-labelledby="marketing-related-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Related routes</span>
              <h2 id="marketing-related-title">Keep visitors moving through the funnel.</h2>
            </div>
            <div className="marketingRelatedGrid">
              {relatedLinks.map((relatedLink) => (
                <a className="marketingRelatedLink" href={new URL(relatedLink.canonicalUrl).pathname} key={relatedLink.slug}>
                  <span>{getMarketingPageTypeLabel(relatedLink)}</span>
                  <strong>{formatMarketingLabel(relatedLink.primaryKeyword)}</strong>
                  <small>{getMarketingPrimaryCtaLabel(relatedLink)}</small>
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <LandingFooter />
    </div>
  );
}

function applyRouteMetadata(link: MarketingLink) {
  const previousTitle = document.title;
  const descriptionMeta = getOrCreateMetaDescription();
  const canonicalLink = getOrCreateCanonicalLink();
  const previousDescription = descriptionMeta.getAttribute("content");
  const previousCanonical = canonicalLink.getAttribute("href");

  document.title = getMarketingPageTitle(link);
  descriptionMeta.setAttribute("content", getMarketingPageDescription(link));
  canonicalLink.setAttribute("href", link.canonicalUrl);

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

function getRelatedLinks(currentLink: MarketingLink) {
  return marketingPageLinks
    .filter((link) => link.slug !== currentLink.slug)
    .filter((link) => link.funnelStage === currentLink.funnelStage || link.buyerStage === currentLink.buyerStage)
    .slice(0, 3);
}

function getResourceType(link: MarketingLink) {
  if (link.slug.includes("checklist")) return "checklist";
  if (link.slug.includes("template") || link.slug.includes("prompt")) return "template";
  return "guide";
}

function getExampleRepoName(link: MarketingLink) {
  if (link.slug.startsWith("qwenlm")) return "QwenLM/FlashQLA";
  if (link.slug.startsWith("deepseek")) return "deepseek-ai/Thinking-with-Visual-Primitives";
  return formatMarketingLabel(link.slug);
}
