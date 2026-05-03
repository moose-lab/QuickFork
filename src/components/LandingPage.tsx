import { pageNote } from "../content/landing";
import { ProductStudio } from "./studio/ProductStudio";
import { HeroSection } from "./landing/HeroSection";
import { LandingNav } from "./landing/LandingNav";
import {
  ClosingCTA,
  FAQSection,
  FeatureSection,
  LandingFooter,
  ProofSection,
  SplitShowcase,
  WorkflowSection,
} from "./landing/LandingSections";

export function LandingPage() {
  return (
    <div className="siteShell">
      <LandingNav />
      <main>
        <HeroSection />
        <div className="pageNote">{pageNote}</div>
        <FeatureSection />
        <SplitShowcase index={0} />
        <WorkflowSection />
        <ProductStudio />
        <ProofSection />
        <SplitShowcase index={1} />
        <FAQSection />
        <ClosingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
