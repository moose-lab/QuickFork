export type VisualExplainerOutputId = "story_map" | "readme_hero_card" | "github_social_preview" | "deck_ready_slide";

export interface VisualExplainerOutput {
  id: VisualExplainerOutputId;
  title: string;
  sourceLabel: string;
  sourceUrl: string;
  projectQuestion: string;
  quickForkSurface: string;
  lifecycleStage: string;
  activationMetric: string;
}

export interface VisualExplainerPackage {
  title: string;
  claimBoundary: string;
  outputs: VisualExplainerOutput[];
}

export const visualExplainerPackage: VisualExplainerPackage = {
  title: "Visual package outputs",
  claimBoundary:
    "This package is a source-backed planning surface. It does not predict search performance, launch results, sales outcomes, or willingness to pay.",
  outputs: [
    {
      id: "story_map",
      title: "Project story map",
      sourceLabel: "Open Source Guides finding users",
      sourceUrl: "https://opensource.guide/finding-users/",
      projectQuestion: "Who needs this repo, what problem do they see, and what feedback should the launch ask for?",
      quickForkSurface: "Source, audience, workflow, proof, and launch nodes that help strangers understand the project before the copy is written.",
      lifecycleStage: "Activation",
      activationMetric: "launch_story_map_copied",
    },
    {
      id: "readme_hero_card",
      title: "README hero card",
      sourceLabel: "GitHub Docs About READMEs",
      sourceUrl:
        "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      projectQuestion: "What should a reader understand in the first screen before scanning installation or implementation details?",
      quickForkSurface: "README-first visual direction tied to repo evidence, identity assets, feature order, and claim boundaries.",
      lifecycleStage: "Evaluation",
      activationMetric: "generated_image_preview_opened",
    },
    {
      id: "github_social_preview",
      title: "GitHub social preview",
      sourceLabel: "GitHub Docs social preview",
      sourceUrl:
        "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      projectQuestion: "When the repo URL is shared, what visual context helps the project read as intentional and understandable?",
      quickForkSurface: "GitHub social preview direction that keeps shared-link imagery aligned with official assets or the GitHub avatar.",
      lifecycleStage: "Discovery",
      activationMetric: "generated_image_downloaded",
    },
    {
      id: "deck_ready_slide",
      title: "Deck-ready explainer slide",
      sourceLabel: "Product Hunt launch guide",
      sourceUrl: "https://www.producthunt.com/launch/preparing-for-launch",
      projectQuestion: "Which one-slide explanation can support a launch review, Product Hunt gallery, or founder-led outreach?",
      quickForkSurface: "Deck-ready explainer slide outline that reuses the same source-backed story, visual hierarchy, and launch context.",
      lifecycleStage: "Evaluation",
      activationMetric: "launch_artifact_downloaded",
    },
  ],
};
