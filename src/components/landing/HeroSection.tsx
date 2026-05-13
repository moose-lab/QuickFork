import { useState } from "react";
import { ArrowRight, FileText, Link2, Wand2 } from "lucide-react";
import { referenceOutputChips, referenceTabs } from "../../content/landing";

type OutputChipState = Record<string, boolean>;

const heroCapabilities = [
  ["Analyze", "Reference URL"],
  ["Structure", "Section map"],
  ["Package", "Prompt handoff"],
] as const;

function ReferenceInputPanel() {
  const [activeTab, setActiveTab] = useState(referenceTabs[0]?.label ?? "Reference URL");
  const [referenceUrl, setReferenceUrl] = useState("https://www.design.com/s/logo-maker");
  const [status, setStatus] = useState("Ready to analyze");
  const [outputs, setOutputs] = useState<OutputChipState>(() =>
    Object.fromEntries(referenceOutputChips.map((chip) => [chip.label, chip.defaultActive])),
  );

  return (
    <div className="referencePanel" aria-label="Reference input panel">
      <div className="referenceTabs" aria-label="Reference source">
        {referenceTabs.map((tab) => (
          <button
            aria-pressed={activeTab === tab.label}
            className={activeTab === tab.label ? "referenceTab active" : "referenceTab"}
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="referenceForm">
        <label className="referenceField">
          <Link2 aria-hidden="true" size={17} />
          <span className="srOnly">Reference input</span>
          <input
            aria-label="Reference input"
            onChange={(event) => {
              setReferenceUrl(event.target.value);
              setStatus(event.target.value.trim() ? "Ready to analyze" : "Add a URL to continue");
            }}
            value={referenceUrl}
          />
        </label>
        <button
          className="primaryButton"
          onClick={() => setStatus(referenceUrl.trim() ? "Reference structure queued" : "Add a URL to continue")}
          type="button"
        >
          <Wand2 aria-hidden="true" size={17} />
          Analyze reference
        </button>
      </div>
      <div className="referenceOptions">
        <div className="referenceSelect">
          <span>Language</span>
          <strong>SaaS English</strong>
        </div>
        <div className="referencePlatforms" aria-label="Output platforms">
          {referenceOutputChips.map((chip) => (
            <button
              aria-pressed={outputs[chip.label]}
              className={outputs[chip.label] ? "active" : ""}
              key={chip.label}
              onClick={() => setOutputs((current) => ({ ...current, [chip.label]: !current[chip.label] }))}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <p className="referenceStatus" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function ProductAnimationPanel() {
  return (
    <div className="heroVisual" aria-label="QuickFork product preview">
      <aside className="productPlayback">
        <div className="videoFrame">
          <video
            aria-label="Product animation playback"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src="/media/quickfork-hero-16x9-black.mp4"
          />
        </div>
      </aside>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="heroGrid">
        <div className="heroContent">
          <h1 id="hero-title">Turn a reference page into a launch-ready story.</h1>
          <p className="heroCopy">
            Analyze a proven landing page, structure the product overview, generate native SaaS copy, and produce
            share-ready visual prompts for hero, sections, social posts, and designer handoff.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#how-to">
              <ArrowRight aria-hidden="true" size={17} />
              See the flow
            </a>
            <a className="secondaryButton" href="#studio">
              <FileText aria-hidden="true" size={17} />
              Preview prompts
            </a>
          </div>
          <div className="heroCapabilityGrid" aria-label="QuickFork workflow">
            {heroCapabilities.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <ReferenceInputPanel />
        </div>
        <ProductAnimationPanel />
      </div>
    </section>
  );
}
