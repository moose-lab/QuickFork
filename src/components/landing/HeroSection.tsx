import { useState, type FormEvent } from "react";
import { Github, Languages, Loader2, Wand2 } from "lucide-react";

type LocaleCode = "en" | "zh" | "ja";
type OutputPreset = "github-readme" | "ppt-wide" | "x-linkedin-landscape" | "square-social";
type ImageQuality = "low" | "medium" | "high" | "auto";

const ratioOptions: Array<{ id: OutputPreset; platform: string; ratio: string; useCase: string }> = [
  { id: "github-readme", platform: "GitHub README", ratio: "16:9", useCase: "Cold start, README" },
  { id: "ppt-wide", platform: "PPT deck", ratio: "16:9", useCase: "Pitch and sales decks" },
  { id: "x-linkedin-landscape", platform: "X / LinkedIn", ratio: "1.91:1", useCase: "Feed launch posts" },
  { id: "square-social", platform: "Instagram square", ratio: "1:1", useCase: "Social previews" },
];

const localeOptions: Array<{ id: LocaleCode; label: string }> = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "ja", label: "日本語" },
];

interface GenerationSummary {
  id: string;
  repo?: {
    full_name: string;
    repo_url: string;
  };
  artifactRoot?: string;
  manifestPath?: string;
  outputs?: Partial<Record<LocaleCode, {
    promptPath: string;
    imagePath: string;
    qualityReportPath: string;
  }>>;
}

async function createGeneration(input: {
  repoUrl: string;
  locales: LocaleCode[];
  preset: OutputPreset;
  imageQuality: ImageQuality;
}) {
  const response = await fetch("/api/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repoUrl: input.repoUrl,
      locales: input.locales,
      preset: input.preset,
      provider: "mock",
      imageQuality: input.imageQuality,
    }),
  });
  const body = (await response.json()) as GenerationSummary | { error?: { message?: string } };
  if (!response.ok) {
    throw new Error("error" in body && body.error?.message ? body.error.message : "Generation request failed.");
  }
  return body as GenerationSummary;
}

function ProjectLaunchInputPanel() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/QwenLM/FlashQLA");
  const [preset, setPreset] = useState<OutputPreset>("github-readme");
  const [locales, setLocales] = useState<LocaleCode[]>(["en"]);
  const [status, setStatus] = useState("Ready to generate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generation, setGeneration] = useState<GenerationSummary | null>(null);

  const toggleLocale = (locale: LocaleCode) => {
    setLocales((current) => {
      if (current.includes(locale)) {
        return current.length === 1 ? current : current.filter((item) => item !== locale);
      }
      return [...current, locale].sort((a, b) => localeOptions.findIndex((item) => item.id === a) - localeOptions.findIndex((item) => item.id === b));
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedRepoUrl = repoUrl.trim();
    if (!trimmedRepoUrl) {
      setStatus("Add a GitHub repository URL to continue");
      return;
    }

    setIsSubmitting(true);
    setGeneration(null);
    setStatus("Generating project launch package");
    try {
      const result = await createGeneration({
        repoUrl: trimmedRepoUrl,
        locales,
        preset,
        imageQuality: "low",
      });
      setGeneration(result);
      setStatus(`Generated ${result.id}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstOutput = generation?.outputs ? Object.entries(generation.outputs)[0] : undefined;
  const outputLocale = firstOutput?.[0]?.toUpperCase();
  const outputPaths = firstOutput?.[1];

  return (
    <div className="generatorStack">
      <form className="referencePanel" aria-label="Project launch generator" onSubmit={handleSubmit}>
        <p className="referencePrompt">Generate README, PPT, and social media launch assets from one repo URL.</p>
        <div className="referenceForm">
          <label className="referenceField">
            <Github aria-hidden="true" size={17} />
            <span className="srOnly">GitHub repository URL</span>
            <input
              aria-label="GitHub repository URL"
              onChange={(event) => {
                setRepoUrl(event.target.value);
                setStatus(event.target.value.trim() ? "Ready to generate" : "Add a GitHub repository URL to continue");
              }}
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
            />
          </label>
          <button className="primaryButton" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 aria-hidden="true" className="spinIcon" size={17} /> : <Wand2 aria-hidden="true" size={17} />}
            Generate
          </button>
        </div>
        <div className="referenceControls">
          <div className="referencePlatforms" aria-label="Preset languages" role="group">
            <span className="referenceInlineLabel">
              <Languages aria-hidden="true" size={13} /> Languages
            </span>
            {localeOptions.map((locale) => (
              <button
                aria-pressed={locales.includes(locale.id)}
                className={locales.includes(locale.id) ? "active" : ""}
                key={locale.id}
                onClick={() => toggleLocale(locale.id)}
                type="button"
              >
                {locale.label}
              </button>
            ))}
          </div>
          <div className="ratioGrid" aria-label="Card ratio by platform" role="group">
            {ratioOptions.map((option) => (
              <button
                aria-label={`${option.platform} ${option.ratio}, ${option.useCase}`}
                aria-pressed={preset === option.id}
                className={preset === option.id ? "ratioCard active" : "ratioCard"}
                key={option.id}
                onClick={() => setPreset(option.id)}
                type="button"
              >
                <span className="ratioPlatform">{option.platform}</span>
                <span className="ratioMeta">{option.ratio}</span>
                <span className="ratioUse">{option.useCase}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="referenceStatus" aria-live="polite">
          {generation?.artifactRoot ? `${status} · ${generation.artifactRoot}` : status}
        </p>
      </form>

      {generation ? (
        <section className="generationOutput" aria-label="Generated launch output">
          <div className="generationOutputHead">
            <span>Output package</span>
            <strong>{generation.repo?.full_name ?? generation.id}</strong>
          </div>
          <dl className="generationOutputList">
            <div>
              <dt>Artifact root</dt>
              <dd>{generation.artifactRoot ?? "Not returned"}</dd>
            </div>
            <div>
              <dt>Manifest</dt>
              <dd>{generation.manifestPath ?? "Not returned"}</dd>
            </div>
            {outputPaths ? (
              <div>
                <dt>{outputLocale} files</dt>
                <dd>
                  <span>{outputPaths.promptPath}</span>
                  <span>{outputPaths.imagePath}</span>
                  <span>{outputPaths.qualityReportPath}</span>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}
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
          <h1 id="hero-title">Turn a GitHub repository into a launch-ready story.</h1>
          <p className="heroCopy">
            Generate cold-start launch materials for README pages, social media, PPT decks, and product outreach from one repository URL.
          </p>
          <ProjectLaunchInputPanel />
        </div>
        <ProductAnimationPanel />
      </div>
    </section>
  );
}
