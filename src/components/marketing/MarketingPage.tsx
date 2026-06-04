import { ArrowRight, ExternalLink, Route, Search, Target } from "lucide-react";
import { useEffect } from "react";

import { LandingFooter } from "../landing/LandingSections";
import { LandingNav } from "../landing/LandingNav";
import { trackEvent } from "../../lib/analytics";
import { marketingPageLinks, type MarketingLink, type MarketingPageType } from "../../marketing/link-catalog";
import {
  formatMarketingLabel,
  getMarketingPageDescription,
  getMarketingPageHeadline,
  getMarketingPageKicker,
  getMarketingPageNarrative,
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
  const narrative = getMarketingPageNarrative(link);
  const relatedLinks = getRelatedLinks(link);

  useEffect(() => applyRouteMetadata(link), [link]);
  useEffect(() => applyMarketingSchema(link), [link]);

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

    if (link.pageType === "tool") {
      trackEvent("tool_page_viewed", {
        tool_slug: link.slug,
        tool_type: getToolType(link),
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
        <MarketingBreadcrumbs link={link} />
        <section className="marketingHeroSection" aria-labelledby="marketing-page-title">
          <div className="marketingHeroGrid">
            <div className="marketingHeroCopy">
              <span className="monoLabel">{getMarketingPageKicker(link)}</span>
              <h1 id="marketing-page-title">{headline}</h1>
              <p>{description}</p>
              <p className="marketingDefinition">{narrative.definition}</p>
              {narrative.lastUpdated ? <p className="marketingUpdated">Last updated: {narrative.lastUpdated}</p> : null}
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
              <h2 id="marketing-workflow-title">Move from search intent to a source-backed launch package.</h2>
              <p>{narrative.jobToBeDone}</p>
              <dl className="marketingPersonaList" aria-label="Target user and evidence boundary">
                <div>
                  <dt>Target user</dt>
                  <dd>{narrative.targetUser}</dd>
                </div>
                <div>
                  <dt>Evidence boundary</dt>
                  <dd>{narrative.evidenceBoundary}</dd>
                </div>
              </dl>
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

        <section className="marketingGrowthSection" aria-labelledby="marketing-benefits-title">
          <div className="marketingRelatedHead">
            <span className="monoLabel">Launch package</span>
            <h2 id="marketing-benefits-title">Turn technical repo context into assets people can actually use.</h2>
          </div>
          <div className="marketingBenefitGrid">
            {narrative.benefits.map((benefit) => (
              <article key={benefit.title}>
                <strong>{benefit.title}</strong>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketingGrowthSection" aria-labelledby="marketing-package-workflow-title">
          <div className="marketingRelatedHead">
            <span className="monoLabel">Workflow</span>
            <h2 id="marketing-package-workflow-title">A repeatable path from repo input to launch review.</h2>
          </div>
          <ol className="marketingWorkflowList">
            {narrative.workflow.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {narrative.sourceNotes?.length ? (
          <section className="marketingGrowthSection" aria-labelledby="marketing-source-notes-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Research sources</span>
              <h2 id="marketing-source-notes-title">Public signals behind this route.</h2>
            </div>
            <div className="marketingBenefitGrid">
              {narrative.sourceNotes.map((source) => (
                <article key={source.label}>
                  <a href={source.url} rel="noreferrer" target="_blank">
                    <strong>{source.label}</strong>
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                  <p>{source.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {narrative.scorecard ? (
          <section className="marketingGrowthSection" aria-labelledby="marketing-scorecard-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Launch readiness rubric</span>
              <h2 id="marketing-scorecard-title">{narrative.scorecard.title}</h2>
              <p className="marketingScorecardBoundary">{narrative.scorecard.claimBoundary}</p>
            </div>
            <div className="marketingScorecardSummary" aria-label="Launch readiness score total">
              <strong>{narrative.scorecard.totalLabel}</strong>
              <span>Use the rubric to decide what the repo needs before the studio generates public launch assets.</span>
            </div>
            <div className="marketingScorecardGrid">
              {narrative.scorecard.categories.map((category) => (
                <article key={category.id}>
                  <span>{category.points} pts</span>
                  <strong>{category.title}</strong>
                  <p>{category.quickForkOutput}</p>
                  <ul>
                    {category.signals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                  <small>
                    {category.lifecycleStage} / {category.activationMetric}
                  </small>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {narrative.visualPackage ? (
          <section className="marketingGrowthSection" aria-labelledby="marketing-visual-package-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Visual explainer package</span>
              <h2 id="marketing-visual-package-title">{narrative.visualPackage.title}</h2>
              <p className="marketingVisualPackageBoundary">{narrative.visualPackage.claimBoundary}</p>
            </div>
            <div className="marketingVisualPackageGrid">
              {narrative.visualPackage.outputs.map((output) => (
                <article key={output.id}>
                  <span>{output.lifecycleStage}</span>
                  <strong>{output.title}</strong>
                  <p>{output.projectQuestion}</p>
                  <small>{output.quickForkSurface}</small>
                  <em>{output.activationMetric}</em>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {narrative.outreachPackage ? (
          <section className="marketingGrowthSection" aria-labelledby="marketing-outreach-package-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Product outreach package</span>
              <h2 id="marketing-outreach-package-title">{narrative.outreachPackage.title}</h2>
              <p className="marketingVisualPackageBoundary">{narrative.outreachPackage.claimBoundary}</p>
            </div>
            <div className="marketingVisualPackageGrid">
              {narrative.outreachPackage.outputs.map((output) => (
                <article key={output.id}>
                  <span>{output.channel}</span>
                  <strong>{output.title}</strong>
                  <p>{output.projectQuestion}</p>
                  <small>{output.quickForkSurface}</small>
                  <em>{output.activationMetric}</em>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {narrative.launchPackageExample ? (
          <section className="marketingGrowthSection" aria-labelledby="marketing-launch-example-title">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Source-backed example</span>
              <h2 id="marketing-launch-example-title">{narrative.launchPackageExample.title}</h2>
              <p className="marketingVisualPackageBoundary">{narrative.launchPackageExample.claimBoundary}</p>
            </div>
            <div className="marketingExampleSummary">
              <dl className="marketingMetaList">
                <div>
                  <dt>Source repo</dt>
                  <dd>{narrative.launchPackageExample.repoFullName}</dd>
                </div>
                <div>
                  <dt>Target user</dt>
                  <dd>{narrative.launchPackageExample.targetUser}</dd>
                </div>
                <div>
                  <dt>Validation question</dt>
                  <dd>{narrative.launchPackageExample.validationQuestion}</dd>
                </div>
              </dl>
              <div className="marketingExampleLinks" aria-label="Launch package example source links">
                {narrative.launchPackageExample.links.map((exampleLink) => (
                  <a
                    href={exampleLink.url}
                    key={exampleLink.label}
                    rel={exampleLink.url.startsWith("http") ? "noreferrer" : undefined}
                    target={exampleLink.url.startsWith("http") ? "_blank" : undefined}
                  >
                    <strong>{exampleLink.label}</strong>
                    <span>{exampleLink.note}</span>
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div className="marketingExampleOutputGrid">
              {narrative.launchPackageExample.outputs.map((output) => (
                <article key={output.id}>
                  <span>{output.lifecycleStage}</span>
                  <strong>{output.title}</strong>
                  <p>{output.quickForkOutput}</p>
                  <small>{output.sourceSignal}</small>
                  <em>{output.reviewQuestion}</em>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="marketingGrowthSection" aria-labelledby="marketing-faq-title">
          <div className="marketingRelatedHead">
            <span className="monoLabel">AI-search FAQ</span>
            <h2 id="marketing-faq-title">Answer the questions AI builders ask before launch.</h2>
          </div>
          <div className="marketingFaqGrid">
            {narrative.faqs.map((item) => (
              <details className="faqItem" key={item.question} open={item.question.startsWith("What is")}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {link.pageType === "resource" || link.pageType === "contact" ? (
          <section className="marketingCaptureSection">
            <LeadCaptureForm link={link} />
          </section>
        ) : null}

        {relatedLinks.length > 0 ? (
          <section className="marketingRelatedSection" aria-label="Related routes">
            <div className="marketingRelatedHead">
              <span className="monoLabel">Related routes</span>
              <h2 id="marketing-related-title">Keep visitors moving through the funnel.</h2>
            </div>
            <div className="marketingRelatedGrid">
              {relatedLinks.map((relatedLink) => (
                <a
                  aria-label={`${getMarketingPageTypeLabel(relatedLink)}: ${formatMarketingLabel(relatedLink.primaryKeyword)}`}
                  className="marketingRelatedLink"
                  href={new URL(relatedLink.canonicalUrl).pathname}
                  key={relatedLink.slug}
                >
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

function MarketingBreadcrumbs({ link }: { link: MarketingLink }) {
  return (
    <nav className="marketingBreadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span>{getMarketingParentLabel(link.pageType)}</span>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{getMarketingBreadcrumbLabel(link)}</span>
    </nav>
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

function applyMarketingSchema(link: MarketingLink) {
  const narrative = getMarketingPageNarrative(link);
  const existing = document.querySelector('script[data-quickfork-marketing-schema]');
  existing?.remove();

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.setAttribute("data-quickfork-marketing-schema", "true");
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: getMarketingPageTitle(link),
    url: link.canonicalUrl,
    mainEntity: narrative.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
  document.head.append(schema);

  return () => {
    schema.remove();
  };
}

function getRelatedLinks(currentLink: MarketingLink) {
  const curatedSlugs = curatedRelatedLinkSlugs[currentLink.slug];

  if (curatedSlugs) {
    return curatedSlugs
      .map((slug) => marketingPageLinks.find((link) => link.slug === slug))
      .filter((link): link is MarketingLink => Boolean(link));
  }

  return marketingPageLinks
    .filter((link) => link.slug !== currentLink.slug)
    .filter((link) => link.funnelStage === currentLink.funnelStage || link.buyerStage === currentLink.buyerStage)
    .slice(0, 3);
}

const curatedRelatedLinkSlugs: Record<string, string[]> = {
  "github-repo-to-launch-package": [
    "open-source-launch",
    "open-source-launch-checklist",
    "github-repo-launch-readiness-score",
  ],
  "source-backed-launch-assets": [
    "github-project-marketing-card-guide",
    "chatgpt-open-source-launch-copy",
    "repository-launch-package-pilot",
  ],
  "cold-start-launch-materials": [
    "github-repo-launch-demand-map",
    "ai-project-launch",
    "github-repo-launch-materials-map",
  ],
  "github-repo-launch-materials-map": [
    "devrel-launch-workflow",
    "github-launch-announcement",
    "github-repo-to-product-outreach",
  ],
  "readme-marketing-cards": [
    "readme-cover-prompt-guide",
    "canva-readme-banner-generator",
    "qwenlm-flashqla-launch-card",
  ],
  "github-repo-visual-explainer": [
    "qwenlm-flashqla-launch-card",
    "deepseek-twvp-launch-card",
    "github-project-marketing-card-guide",
  ],
  "github-repo-to-launch-deck": [
    "github-launch-announcement",
    "github-repo-launch-demand-map",
    "repository-launch-package-pilot",
  ],
  "github-repo-to-product-outreach": [
    "repository-launch-package-pilot",
    "github-repo-launch-demand-map",
    "source-backed-launch-assets",
  ],
  "github-repo-launch-readiness-score": [
    "repository-launch-package-pilot",
    "cold-start-launch-materials",
    "open-source-launch-checklist",
  ],
  "qwenlm-flashqla-launch-card": [
    "github-repo-visual-explainer",
    "github-project-marketing-card-guide",
    "github-repo-to-launch-package",
  ],
  "deepseek-twvp-launch-card": [
    "github-repo-visual-explainer",
    "source-backed-launch-assets",
    "ai-project-launch",
  ],
  "chatgpt-open-source-launch-copy": [
    "source-backed-launch-assets",
    "qwenlm-flashqla-launch-card",
    "github-repo-to-launch-package",
  ],
  "canva-readme-banner-generator": [
    "readme-marketing-cards",
    "readme-cover-prompt-guide",
    "qwenlm-flashqla-launch-card",
  ],
};

function getMarketingParentLabel(pageType: MarketingPageType) {
  const parentLabels: Record<MarketingPageType, string> = {
    product: "Product",
    use_case: "Use Cases",
    resource: "Resources",
    tool: "Tools",
    template: "Templates",
    example: "Examples",
    compare: "Compare",
    contact: "Contact",
  };

  return parentLabels[pageType];
}

function getMarketingBreadcrumbLabel(link: MarketingLink) {
  return getMarketingPageTitle(link).replace(/\s+\|\s+QuickFork$/, "");
}

function getResourceType(link: MarketingLink) {
  if (link.slug.includes("checklist")) return "checklist";
  if (link.slug.includes("template") || link.slug.includes("prompt")) return "template";
  return "guide";
}

function getToolType(link: MarketingLink) {
  if (link.slug.includes("readiness")) return "scorecard";
  return "tool";
}

function getExampleRepoName(link: MarketingLink) {
  if (link.slug.startsWith("qwenlm")) return "QwenLM/FlashQLA";
  if (link.slug.startsWith("deepseek")) return "deepseek-ai/Thinking-with-Visual-Primitives";
  return formatMarketingLabel(link.slug);
}
