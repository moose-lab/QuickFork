type ReferenceTab = {
  label: string;
  active?: boolean;
};

type ReferenceOutputChip = {
  label: string;
  active?: boolean;
  defaultActive?: boolean;
};

type FeatureCard = {
  code: string;
  title: string;
  body: string;
  description: string;
  artifact: {
    label: string;
    value: string;
  };
  artifactLabel: string;
  artifactValue: string;
};

type SocialFlowStep = {
  code: string;
  title: string;
  body: string;
  source: string;
};

type SocialChannelOutput = {
  label: string;
  title: string;
  body: string;
};

type Showcase = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  copy: string;
  metaLabel: string;
  imageFirst: boolean;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
  meta: Array<{
    label: string;
    value: string;
  }>;
};

type WorkflowStep = {
  number: string;
  title: string;
  body: string;
  copy: string;
};

type ReviewWorkbenchLane = {
  label: string;
  title: string;
  body: string;
  items: Array<string>;
};

type PublishGate = {
  label: string;
  title: string;
  body: string;
};

type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  badge: string;
  ctaLabel: string;
  href: string;
  highlighted?: boolean;
  features: Array<string>;
};

type FaqItem = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export const referenceTabs = [
  { label: "Reference URL", active: true },
  { label: "Screenshot" },
  { label: "Blank brief" },
] satisfies Array<ReferenceTab>;

export const referenceOutputChips = [
  { label: "HTML", active: true, defaultActive: true },
  { label: "Copy", active: true, defaultActive: true },
  { label: "Prompt", active: true, defaultActive: true },
  { label: "Figma", defaultActive: false },
  { label: "Social", defaultActive: false },
] satisfies Array<ReferenceOutputChip>;

export const featureCards = [
  {
    code: "F-01 / Cold start",
    title: "Start from the repository, not a blank launch brief.",
    body: "QuickFork turns a public GitHub URL into the factual base for a developer cold-start story.",
    description:
      "QuickFork turns a public GitHub URL into the factual base for a developer cold-start story.",
    artifact: { label: "Input", value: "Repo URL" },
    artifactLabel: "Input",
    artifactValue: "Repo URL",
  },
  {
    code: "F-02 / Visual story",
    title: "Make the repo scannable before asking for attention.",
    body: "README heroes, X/LinkedIn posts, and square cards reuse one source-backed visual explanation.",
    description:
      "README heroes, X/LinkedIn posts, and square cards reuse one source-backed visual explanation.",
    artifact: { label: "Asset", value: "Infographic" },
    artifactLabel: "Asset",
    artifactValue: "Infographic",
  },
  {
    code: "F-03 / Source guard",
    title: "Keep claims tied to repository evidence.",
    body: "Repo metadata, README claims, official links, metrics, and identity assets stay visible in the launch package.",
    description:
      "Repo metadata, README claims, official links, metrics, and identity assets stay visible in the launch package.",
    artifact: { label: "Claims", value: "Traceable" },
    artifactLabel: "Claims",
    artifactValue: "Traceable",
  },
  {
    code: "F-04 / Launch copy",
    title: "Explain the problem, mechanism, and reason to care.",
    body: "QuickFork turns project structure into a concise launch story that developer audiences can verify.",
    description:
      "QuickFork turns project structure into a concise launch story that developer audiences can verify.",
    artifact: { label: "Story", value: "Brief" },
    artifactLabel: "Story",
    artifactValue: "Brief",
  },
  {
    code: "F-05 / Channel fit",
    title: "Package one idea for README, feeds, and communities.",
    body: "One repo story becomes a README hero, launch post, square social card, and editable prompt instead of disconnected drafts.",
    description:
      "One repo story becomes a README hero, launch post, square social card, and editable prompt instead of disconnected drafts.",
    artifact: { label: "Channels", value: "3+" },
    artifactLabel: "Channels",
    artifactValue: "3+",
  },
  {
    code: "F-06 / Review path",
    title: "Export a package a human can approve.",
    body: "Prompts, generated images, quality notes, launch copy, and manifest paths stay visible before anything is published.",
    description:
      "Prompts, generated images, quality notes, launch copy, and manifest paths stay visible before anything is published.",
    artifact: { label: "Output", value: "Manifest" },
    artifactLabel: "Output",
    artifactValue: "Manifest",
  },
] satisfies Array<FeatureCard>;

export const socialFlowSteps = [
  {
    code: "01 / Repo",
    title: "Repo",
    body: "Paste a public GitHub URL and keep the source attached.",
    source: "README, topics, links, identity",
  },
  {
    code: "02 / Infographic",
    title: "Infographic",
    body: "Turn project evidence into a first-screen visual explanation.",
    source: "Problem, mechanism, proof",
  },
  {
    code: "03 / Distribute",
    title: "Distribute",
    body: "Export README, X/LinkedIn, and square formats from the same story.",
    source: "README, feed, community",
  },
] satisfies Array<SocialFlowStep>;

export const socialChannelOutputs = [
  {
    label: "README",
    title: "README hero",
    body: "A visual opener that explains the repo before the README gets dense.",
  },
  {
    label: "Post",
    title: "X / LinkedIn",
    body: "Short source-backed copy for developer feeds.",
  },
  {
    label: "Card",
    title: "Square card",
    body: "A 1:1 image for feeds, directories, and launch threads.",
  },
  {
    label: "Copy",
    title: "Launch copy",
    body: "A compact cold-start story to paste, edit, and share.",
  },
] satisfies Array<SocialChannelOutput>;

export const showcases = [
  {
    id: "visual-posture-title",
    label: "Repo-to-social",
    eyebrow: "Repo-to-social",
    title:
      "A good launch asset shows the project shape before the README asks for attention.",
    body: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can sit in a README, launch post, directory listing, or community thread.",
    copy: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can sit in a README, launch post, directory listing, or community thread.",
    metaLabel: "Launch asset strategy",
    imageFirst: true,
    image: {
      src: "/examples/flashqla-reference.jpeg",
      alt: "FlashQLA launch infographic generated from a GitHub repository",
      caption:
        "Example output - a README and social-ready infographic generated from repo evidence",
    },
    meta: [
      {
        label: "Section role",
        value: "Make the repo scannable",
      },
      { label: "Asset type", value: "README hero / social card" },
      {
        label: "Composition",
        value: "Problem, mechanism, path",
      },
      { label: "Trust signal", value: "Claims stay source-backed" },
    ],
  },
  {
    id: "critique-title",
    label: "Output reuse",
    eyebrow: "Output reuse",
    title: "The same source-backed story travels from README to social feeds.",
    body: "QuickFork keeps the factual brief behind every channel, so the launch story stays consistent while the artifact format changes for developers, maintainers, and DevRel teams.",
    copy: "QuickFork keeps the factual brief behind every channel, so the launch story stays consistent while the artifact format changes for developers, maintainers, and DevRel teams.",
    metaLabel: "Package strategy",
    imageFirst: false,
    image: {
      src: "/examples/twvp-cover-en.png",
      alt: "Visual Primitives launch infographic generated for README and social use",
      caption:
        "Example output - channel-ready infographic with problem, mechanism, and GitHub source",
    },
    meta: [
      { label: "Reuse", value: "README / post / social" },
      { label: "Purpose", value: "Explain technical value" },
      { label: "Style", value: "Visual, not hype-driven" },
      { label: "Review", value: "Edit before sharing" },
    ],
  },
] satisfies Array<Showcase>;

export const workflowSteps = [
  {
    number: "01",
    title: "Paste the public GitHub repository.",
    body: "QuickFork starts from the repo URL and keeps the project facts close to the launch narrative.",
    copy: "QuickFork starts from the repo URL and keeps the project facts close to the launch narrative.",
  },
  {
    number: "02",
    title: "Build the developer cold-start story.",
    body: "The system turns README, metadata, links, metrics, and identity assets into a compact project explanation.",
    copy: "The system turns README, metadata, links, metrics, and identity assets into a compact project explanation.",
  },
  {
    number: "03",
    title: "Generate the visual and channel assets.",
    body: "QuickFork prepares infographic prompts, README/social visuals, X/LinkedIn copy, and review notes from the same source.",
    copy: "QuickFork prepares infographic prompts, README/social visuals, X/LinkedIn copy, and review notes from the same source.",
  },
  {
    number: "04",
    title: "Review the package before sharing.",
    body: "The UI keeps the launch brief, image, prompt, quality notes, and manifest visible so the user stays in control.",
    copy: "The UI keeps the launch brief, image, prompt, quality notes, and manifest visible so the user stays in control.",
  },
] satisfies Array<WorkflowStep>;

export const reviewWorkbenchLanes = [
  {
    label: "Input",
    title: "Input",
    body: "Start from one repo URL and a few channel choices.",
    items: ["GitHub URL", "Language", "Ratio", "Launch focus"],
  },
  {
    label: "Generate",
    title: "Generate",
    body: "Create the visual, launch copy, and channel formats from one source-backed story.",
    items: ["Infographic", "README hero", "X / LinkedIn", "Square card"],
  },
  {
    label: "Export",
    title: "Export",
    body: "Keep the package editable before it moves to README, social, or community distribution.",
    items: ["Image", "Post copy", "Prompt", "Manifest"],
  },
] satisfies Array<ReviewWorkbenchLane>;

export const publishGates = [
  {
    label: "Check 01",
    title: "Repo evidence first",
    body: "Use README facts, metadata, official links, and visible project signals before writing the story.",
  },
  {
    label: "Check 02",
    title: "No fake traction",
    body: "No invented users, rankings, revenue, customer logos, or viral claims.",
  },
  {
    label: "Check 03",
    title: "Assumptions labeled",
    body: "Unverified positioning stays marked as an assumption until a human approves it.",
  },
  {
    label: "Check 04",
    title: "Human review path",
    body: "README, social, and square formats stay editable before they leave QuickFork.",
  },
] satisfies Array<PublishGate>;

export const pricingPlans = [
  {
    name: "Free scan",
    price: "$0",
    cadence: "per repo",
    description: "Try one public repo and see the source-backed launch direction.",
    badge: "1 repo",
    ctaLabel: "Generate free scan",
    href: "#hero",
    features: [
      "Repo intake",
      "Cold-start angle summary",
      "README hero direction",
      "Export preview",
    ],
  },
  {
    name: "Launch package",
    price: "$49",
    cadence: "per month",
    description: "Generate repeat repo-to-social packages for README, X/LinkedIn, and square cards.",
    badge: "5 launches",
    ctaLabel: "Start launch package",
    href: "/sign-up",
    highlighted: true,
    features: [
      "5 launches",
      "X/LinkedIn launch posts",
      "README and square visuals",
      "Prompt and quality reports",
    ],
  },
  {
    name: "Team review",
    price: "Custom",
    cadence: "for teams",
    description: "Add shared review and launch-package QA for DevRel and technical teams.",
    badge: "Source-backed review",
    ctaLabel: "Talk to team",
    href: "/contact?intent=launch-package&utm_source=pricing",
    features: [
      "Source-backed review",
      "Shared approval checklist",
      "Launch-package QA support",
      "Private repository intake",
    ],
  },
] satisfies Array<PricingPlan>;

export const faqItems = [
  {
    question: "What does QuickFork generate from a repository URL?",
    answer:
      "QuickFork generates a repo-to-social launch package: infographic prompt, README hero direction, social post copy, square-card direction, quality notes, and a source-backed manifest for review.",
    defaultOpen: true,
  },
  {
    question: "Who is QuickFork for?",
    answer:
      "QuickFork is for open-source maintainers, AI project builders, indie technical founders, and DevRel teams that need credible launch materials before public traction exists.",
  },
  {
    question: "What does developer cold start mean here?",
    answer:
      "It means a project has code and technical value, but still needs a clear first impression, README story, social post, and visual proof path before developer audiences will pay attention.",
  },
  {
    question: "What do I need before starting?",
    answer:
      "Start with a public GitHub repository URL. Clear README text, official links, screenshots, metrics, and identity assets improve the output.",
  },
  {
    question: "Can the generated launch package be edited?",
    answer:
      "Yes. The generated package is a draft. Builders can edit copy, adjust tone, replace visuals, and choose which assets are publishable.",
  },
  {
    question: "What does the export include?",
    answer:
      "The workflow returns prompts, generated images, README/social copy, channel-card directions, quality notes, and manifest data for review.",
  },
  {
    question: "How does QuickFork avoid generic AI marketing copy?",
    answer:
      "QuickFork starts from repository evidence, labels uncertain claims, preserves source-backed project facts, and avoids unsupported rankings, customer counts, revenue claims, or invented logos.",
  },
  {
    question: "How is QuickFork different from a generic social post generator?",
    answer:
      "Generic generators start with a prompt. QuickFork starts with repo evidence and packages the same story across README, X/LinkedIn, square social, and review artifacts.",
  },
] satisfies Array<FaqItem>;

export const pageNote =
  "Repo-to-social launch workspace - GitHub repository to README hero, launch infographic, social copy, square card, and source-backed proof";
