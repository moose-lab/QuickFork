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
          title="Generate a source-backed launch package from repository evidence."
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
          copy="QuickFork uses proof carefully: name the user, explain the workflow, and leave numerical claims out until real product data exists."
          eyebrow="03 / Social proof"
          id="proof-title"
          title="Show who the workflow is for before claiming scale."
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
            <h3>Built for launch work that still needs review.</h3>
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
          copy="The FAQ reduces hesitation after the user understands the workflow. QuickFork answers concerns about evidence, output quality, editable control, and launch-readiness."
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
        <h2 id="closing-title">Start with the repo you have. Ship the launch package you need.</h2>
        <p>
          QuickFork turns repository evidence into a reviewable launch brief, README assets, social copy, deck structure,
          outreach drafts, and visual explainers for technical products.
        </p>
      </div>
      <a className="button" href="#features">
        <PanelTop aria-hidden="true" size={17} />
        Review the workflow
      </a>
    </section>
  );
}

export function LandingFooter() {
  const footerGroups = [
    {
      title: "Product",
      links: [
        { href: "/#studio", label: "Studio" },
        { href: "/product/github-repo-to-launch-package", label: "Repo to launch package" },
        { href: "/product/source-backed-launch-assets", label: "Source-backed launch assets" },
        { href: "/product/cold-start-launch-materials", label: "Cold-start launch materials" },
        { href: "/product/repository-launch-package-pilot", label: "Launch package pilot" },
      ],
    },
    {
      title: "Use Cases",
      links: [
        { href: "/use-cases/open-source-launch", label: "Open-source launch" },
        { href: "/use-cases/ai-project-launch", label: "AI project launch" },
        { href: "/use-cases/devrel-launch-workflow", label: "DevRel launch workflow" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/resources/open-source-launch-checklist", label: "Checklist" },
        { href: "/resources/github-project-marketing-card-guide", label: "Marketing card guide" },
        { href: "/resources/github-repo-launch-demand-map", label: "Launch demand map" },
        { href: "/tools/github-repo-launch-readiness-score", label: "Readiness score" },
        { href: "/templates/github-launch-announcement", label: "Launch template" },
      ],
    },
    {
      title: "Examples",
      links: [
        { href: "/examples/qwenlm-flashqla-launch-card", label: "FlashQLA" },
        { href: "/examples/deepseek-twvp-launch-card", label: "DeepSeek TWVP" },
        { href: "/compare/chatgpt-open-source-launch-copy", label: "ChatGPT comparison" },
        { href: "/compare/canva-readme-banner-generator", label: "Canva comparison" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Contact" },
        { href: "/help", label: "Help" },
        { href: "/sign-in", label: "Sign in" },
        { href: "/sign-up", label: "Sign up" },
      ],
    },
    {
      title: "Legal and AI Discovery",
      links: [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
        { href: "/llms.txt", label: "llms.txt" },
        { href: "/pricing.md", label: "pricing.md" },
        { href: "/sitemap.xml", label: "sitemap.xml" },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footerBrand">
        <span>QuickFork</span>
        <small>Source-backed launch assets for public repositories.</small>
      </div>
      <nav className="footerNav" aria-label="Footer navigation">
        {footerGroups.map((group) => (
          <section className="footerGroup" key={group.title}>
            <h2>{group.title}</h2>
            <div>
              {group.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </footer>
  );
}
