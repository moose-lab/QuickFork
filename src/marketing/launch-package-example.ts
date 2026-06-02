export type LaunchPackageExampleOutputId = "audience" | "story_map" | "readme" | "social" | "deck" | "outreach";

export interface LaunchPackageExampleOutput {
  id: LaunchPackageExampleOutputId;
  title: string;
  sourceSignal: string;
  quickForkOutput: string;
  reviewQuestion: string;
  lifecycleStage: string;
}

export interface LaunchPackageExampleLink {
  label: string;
  url: string;
  note: string;
}

export interface LaunchPackageExample {
  title: string;
  repoFullName: string;
  repoUrl: string;
  generatorHref: string;
  targetUser: string;
  validationQuestion: string;
  claimBoundary: string;
  outputs: LaunchPackageExampleOutput[];
  links: LaunchPackageExampleLink[];
}

export const qwenFlashQlaLaunchPackageExample: LaunchPackageExample = {
  title: "QwenLM/FlashQLA launch package example",
  repoFullName: "QwenLM/FlashQLA",
  repoUrl: "https://github.com/QwenLM/FlashQLA",
  generatorHref: "/#hero",
  targetUser: "AI project builders evaluating CUDA attention performance",
  validationQuestion: "Does this kernel reduce inference bottlenecks enough to try in my own benchmark path?",
  claimBoundary:
    "No invented benchmark, customer, ranking, revenue, or pricing claims. Treat every output as a reviewable launch draft tied to repository evidence or explicit human input.",
  outputs: [
    {
      id: "audience",
      title: "Target user discovery map",
      sourceSignal: "Repository topic and README context indicate AI infrastructure and inference-performance interest.",
      quickForkOutput: "Names likely evaluators, launch triggers, validation questions, and channels before writing public copy.",
      reviewQuestion: "Which audience segment needs the clearest proof before trying the repository?",
      lifecycleStage: "Discovery",
    },
    {
      id: "story_map",
      title: "Project story map",
      sourceSignal: "The repository URL, README, owner, and topics create the source, audience, workflow, proof, and launch nodes.",
      quickForkOutput: "Turns technical repo context into a visual interpretation that can support README and deck review.",
      reviewQuestion: "Can a stranger understand what the repository does before reading implementation details?",
      lifecycleStage: "Activation",
    },
    {
      id: "readme",
      title: "README launch brief",
      sourceSignal: "README evidence becomes a concise problem, workflow, value, proof-boundary, and next-step brief.",
      quickForkOutput: "Creates reviewable README improvement copy without replacing maintainer judgment.",
      reviewQuestion: "Which README claim needs a source reference or uncertainty label before publishing?",
      lifecycleStage: "Evaluation",
    },
    {
      id: "social",
      title: "Social launch post",
      sourceSignal: "The same repo-backed brief becomes a short launch post with the GitHub URL preserved.",
      quickForkOutput: "Drafts a shareable launch note for X, LinkedIn, or community feedback without unsupported performance claims.",
      reviewQuestion: "Which channel needs the most conservative wording for a first public share?",
      lifecycleStage: "Evaluation",
    },
    {
      id: "deck",
      title: "Launch deck outline",
      sourceSignal: "The project story map and README brief become problem, product, workflow, proof, and launch-ask slides.",
      quickForkOutput: "Gives founders and DevRel teams a deck-ready structure before designing slides.",
      reviewQuestion: "Which slide should show proof, caveat, or demo path before outreach starts?",
      lifecycleStage: "Evaluation",
    },
    {
      id: "outreach",
      title: "Product outreach draft",
      sourceSignal: "The repository story becomes a human-reviewed launch follow-up note with a specific ask.",
      quickForkOutput: "Creates a source-backed outreach draft while keeping recipient choice and sending under human control.",
      reviewQuestion: "Is the outreach useful without promising replies, adoption, revenue, or ranking outcomes?",
      lifecycleStage: "Monetization",
    },
  ],
  links: [
    {
      label: "QwenLM/FlashQLA source repository",
      url: "https://github.com/QwenLM/FlashQLA",
      note: "The public GitHub repository is the example's source boundary.",
    },
    {
      label: "QuickFork launch package generator",
      url: "/#hero",
      note: "Generate a similar source-backed brief from another public GitHub repository.",
    },
  ],
};
