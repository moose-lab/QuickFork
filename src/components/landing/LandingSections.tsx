import { ArrowRight, CheckCircle2, PanelTop } from "lucide-react";
import {
  faqItems,
  publishGates,
  pricingPlans,
  reviewWorkbenchLanes,
  socialChannelOutputs,
  socialFlowSteps,
  showcases,
} from "../../content/landing";
import { SectionIntro } from "./SectionIntro";

export function FeatureSection() {
  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="sectionGrid">
        <SectionIntro
          copy="Cold-start project launches fail when the first impression is just a raw GitHub link. QuickFork turns repo evidence into social launch assets that are scannable, editable, and still tied to sources."
          eyebrow="01 / Product"
          id="features-title"
          title="Turn repo evidence into social assets people can inspect."
        />
        <div className="socialFlowBoard">
          <ol className="socialFlowSteps" aria-label="Repo-to-social conversion steps">
            {socialFlowSteps.map((step) => (
              <li key={step.code}>
                <span>{step.code}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                <small>{step.source}</small>
              </li>
            ))}
          </ol>
          <aside className="socialChannelPanel" aria-label="Reviewable social launch package">
            <div className="socialChannelHeader">
              <span className="monoLabel">Channel outputs</span>
              <strong>One repo story, four publishable surfaces.</strong>
            </div>
            <ul className="socialChannelOutputs" aria-label="Social launch channel outputs">
              {socialChannelOutputs.map((output) => (
                <li key={output.title}>
                  <span>{output.label}</span>
                  <strong>{output.title}</strong>
                  <p>{output.body}</p>
                </li>
              ))}
            </ul>
          </aside>
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
            copy="The workflow is deliberately operational: collect source facts, draft social surfaces side by side, then keep every publishable asset tied to an evidence audit."
            eyebrow="02 / Workflow"
            id="how-title"
            title="Review every social asset before it ships."
          />
          <ol className="reviewWorkbench" aria-label="Repo-to-social review workbench lanes">
            {reviewWorkbenchLanes.map((lane) => (
              <li key={lane.label}>
                <span>{lane.label}</span>
                <strong>{lane.title}</strong>
                <p>{lane.body}</p>
                <ul aria-label={`${lane.label} checklist`}>
                  {lane.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
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
          copy="QuickFork is built for teams that need attention without inventing traction. The proof system treats generated launch assets as drafts until the source map, prompt trace, channel fit, and approval state are visible."
          eyebrow="03 / Review"
          id="proof-title"
          title="Publish only after the social package passes source-backed gates."
        />
        <ul className="publishGateList" aria-label="Source-backed publish gates">
          {publishGates.map((gate) => (
            <li key={gate.title}>
              <span>{gate.label}</span>
              <strong>{gate.title}</strong>
              <p>{gate.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="sectionGrid">
        <SectionIntro
          copy="QuickFork answers the questions a maintainer, founder, DevRel lead, or product marketer asks before trusting generated launch assets."
          eyebrow="04 / FAQ"
          id="faq-title"
          title="Keep the launch simple, reviewable, and source-backed."
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
    <section className="pricingSection" id="pricing" aria-labelledby="pricing-title">
      <div className="pricingHeader">
        <div>
          <span className="monoLabel">05 / Pricing</span>
          <h2 id="pricing-title">Choose the repo-to-social package that matches launch risk.</h2>
        </div>
        <p>
          Start free when you only need evidence shape. Upgrade when the launch needs reusable social assets, review reports,
          and team approval before a public post.
        </p>
      </div>
      <ul className="pricingGrid" aria-label="Repo-to-social pricing plans">
        {pricingPlans.map((plan) => (
          <li className={plan.highlighted ? "pricingCard featured" : "pricingCard"} key={plan.name}>
            <div className="pricingCardTop">
              <span>{plan.badge}</span>
              <strong>{plan.name}</strong>
              <p>{plan.description}</p>
            </div>
            <div className="pricingAmount">
              <strong>{plan.price}</strong>
              <span>{plan.cadence}</span>
            </div>
            <ul aria-label={`${plan.name} includes`}>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 aria-hidden="true" size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <a className={plan.highlighted ? "primaryButton" : "secondaryButton"} href={plan.href}>
              {plan.name === "Free scan" ? <PanelTop aria-hidden="true" size={16} /> : <ArrowRight aria-hidden="true" size={16} />}
              {plan.ctaLabel}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingFooter() {
  const footerGroups = [
    {
      title: "Product",
      links: [
        { href: "/#studio", label: "Studio" },
        { href: "/product/github-repo-to-launch-package", label: "Repo-to-social package" },
        { href: "/product/source-backed-launch-assets", label: "Source-backed launch assets" },
        { href: "/product/cold-start-launch-materials", label: "Cold-start social materials" },
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
        { href: "/resources/github-project-marketing-card-guide", label: "Social card guide" },
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
