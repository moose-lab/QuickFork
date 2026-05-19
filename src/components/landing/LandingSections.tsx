import { PanelTop } from "lucide-react";
import {
  canvasModules,
  faqItems,
  featureCards,
  proofAudience,
  proofQuotes,
  showcases,
  studioPills,
  workflowSteps,
} from "../../content/landing";
import { SectionIntro } from "./SectionIntro";

export function FeatureSection() {
  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="sectionGrid">
        <SectionIntro
          copy="QuickFork now exposes the backend generation contract in the page itself: repo URL in, curated brief, localized copy, prompts, mock cards, quality reports, and manifest paths out."
          eyebrow="01 / Features"
          id="features-title"
          title="Generate traceable launch assets from repository evidence."
        />
        <div className="featureBoard" aria-label="QuickFork feature set">
          {featureCards.map((feature) => (
            <article className="featureCard" key={feature.code}>
              <span className="featureCode">{feature.code}</span>
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
              <div className="artifact" aria-hidden="true">
                <div className="artifactHead">
                  <span>{feature.artifactLabel}</span>
                  <span>{feature.artifactValue}</span>
                </div>
                <div className="artifactBody">
                  <span className="line" />
                  <span className="line" />
                  <span className="line" />
                  <span className="line" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SplitShowcase({ index }: { index: number }) {
  const showcase = showcases[index];
  const image = (
    <div className="photoPanel">
      <img src={showcase.image.src} alt={showcase.image.alt} />
      <div className="imageCaption">{showcase.image.caption}</div>
    </div>
  );
  const copy = (
    <div className="showcaseCopy">
      <div>
        <span className="monoLabel">{showcase.label}</span>
        <h3 id={showcase.id}>{showcase.title}</h3>
        <p>{showcase.copy}</p>
      </div>
      <div className="imageMeta" aria-label={showcase.metaLabel}>
        {showcase.meta.map((item) => (
          <span key={item.label}>
            {item.label}
            <b>{item.value}</b>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="splitShowcase" aria-labelledby={showcase.id}>
      {showcase.imageFirst ? image : copy}
      {showcase.imageFirst ? copy : image}
    </section>
  );
}

export function WorkflowSection() {
  return (
    <section className="darkBand" id="how-to" aria-labelledby="how-title">
      <div className="section">
        <div className="sectionGrid">
          <SectionIntro
            copy="The frontend sends a small request, the server runs the mockable A-to-K pipeline, and the Hero page returns concrete paths for the files written under output/project-launch."
            eyebrow="02 / How to"
            id="how-title"
            title="From GitHub URL to multilingual launch package."
          />
          <div className="stepGrid" aria-label="QuickFork workflow">
            {workflowSteps.map((step) => (
              <article className="stepCard" key={step.number}>
                <span className="stepNum">{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <div className="productLab" aria-label="QuickFork product interface mockup">
            <div className="labTopbar">
              <span>QuickFork Studio</span>
              <span>Repository to generated artifacts</span>
            </div>
            <div className="labBody">
              <div className="labSidebar">
                {studioPills.map((pill) => (
                  <div className="labPill" key={pill.label}>
                    <span>{pill.label}</span>
                    {pill.value}
                  </div>
                ))}
              </div>
              <div className="labCanvas">
                <div className="canvasTitle">Launch package, ready for review.</div>
                <div className="canvasModules" aria-hidden="true">
                  {canvasModules.map((module) => (
                    <span key={module}>{module}</span>
                  ))}
                </div>
                <div className="canvasFoot">
                  <span>Manifest</span>
                  <span>Cards</span>
                  <span>Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProofSection() {
  return (
    <section className="section" id="proof" aria-labelledby="proof-title">
      <div className="sectionGrid">
        <SectionIntro
          copy="Design.com uses a large testimonial field to make creation feel safe. QuickFork uses proof more carefully: name the use cases, show professional judgment, and leave numerical claims out until real product data exists."
          eyebrow="03 / Social proof"
          id="proof-title"
          title="Show who trusts the workflow before claiming scale."
        />
        <div className="proofGrid">
          <div className="quoteRail">
            {proofQuotes.map((quote) => (
              <article className="quoteCard" key={quote.quote}>
                <div className="quoteMark" aria-hidden="true">
                  "
                </div>
                <div>
                  <blockquote>{quote.quote}</blockquote>
                  <p>{quote.copy}</p>
                  <cite>{quote.cite}</cite>
                </div>
              </article>
            ))}
          </div>
          <aside className="proofAside" aria-label="QuickFork audience proof">
            <h3>Built for serious page work.</h3>
            <div className="proofList">
              {proofAudience.map((item) => (
                <span key={item.label}>
                  {item.label}
                  <b>{item.value}</b>
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="sectionGrid">
        <SectionIntro
          copy="The FAQ mirrors the reference page's role: reduce hesitation after the user understands the workflow. QuickFork answers concerns about originality, export quality, editable control, and reference-inspired design."
          eyebrow="04 / FAQ"
          id="faq-title"
          title="Answer what a serious buyer will ask."
        />
        <div className="faqGrid">
          {faqItems.map((item) => (
            <details className="faqItem" key={item.question} open={item.defaultOpen}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="closing" id="pricing" aria-labelledby="closing-title">
      <div>
        <span className="monoLabel">Final CTA</span>
        <h2 id="closing-title">Start with the page that works. Ship the page that belongs to you.</h2>
        <p>
          QuickFork turns reference-page logic into a polished SaaS landing draft for teams that need strategy, copy,
          hierarchy, and handoff in the same artifact.
        </p>
      </div>
      <a className="button" href="#features">
        <PanelTop aria-hidden="true" size={17} />
        Fork a landing page
      </a>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <span>QuickFork</span>
        <small>Source-backed launch assets for public repositories.</small>
      </div>
      <nav className="footerNav" aria-label="Footer navigation">
        <a href="/contact">Contact</a>
        <a href="/help">Help</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </nav>
    </footer>
  );
}
