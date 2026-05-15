import { useEffect, useRef, useState, type FormEvent } from "react";
import { Download, Github, Languages, Loader2, Maximize2, X } from "lucide-react";
import { getRepoAnalyticsProperties, trackEvent } from "../../lib/analytics";

type LocaleCode = "en" | "zh" | "ja";
type OutputPreset = "16:9" | "1:1" | "4:3" | "3:4" | "9:16";
type ImageQuality = "low";

const ratioOptions: Array<{ id: OutputPreset; label: string }> = [
  { id: "16:9", label: "16:9" },
  { id: "1:1", label: "1:1" },
  { id: "4:3", label: "4:3" },
  { id: "3:4", label: "3:4" },
  { id: "9:16", label: "9:16" },
];

const localeOptions: Array<{ id: LocaleCode; label: string; shortLabel: string }> = [
  { id: "en", label: "English", shortLabel: "EN" },
  { id: "zh", label: "Chinese", shortLabel: "ZH" },
  { id: "ja", label: "Japanese", shortLabel: "JA" },
];

const soundUnlockEvents = ["pointerdown", "keydown", "touchstart"] as const;

async function playHeroVideo(video: HTMLVideoElement) {
  const playback = video.play();
  if (playback && typeof playback.catch === "function") {
    await playback;
  }
}

export async function startManagedHeroVideoPlayback(video: HTMLVideoElement) {
  video.muted = false;
  try {
    await playHeroVideo(video);
    return;
  } catch {
    video.muted = true;
    await playHeroVideo(video).catch(() => undefined);
  }

  const restoreSound = () => {
    video.muted = false;
    void playHeroVideo(video).catch(() => undefined);
    for (const eventName of soundUnlockEvents) {
      window.removeEventListener(eventName, restoreSound);
    }
  };

  for (const eventName of soundUnlockEvents) {
    window.addEventListener(eventName, restoreSound, { once: true });
  }
}

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
    imageUrl?: string;
    qualityReportPath: string;
  }>>;
  stages?: Array<{
    id: string;
    label: string;
    status: string;
    model?: string;
  }>;
  modelCalls?: Array<{
    provider: string;
    model: string;
    purpose: string;
    status: string;
  }>;
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
      provider: "wavespeed",
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
  const [preset, setPreset] = useState<OutputPreset>("4:3");
  const [locales, setLocales] = useState<LocaleCode[]>(["en"]);
  const [status, setStatus] = useState("Ready to generate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generation, setGeneration] = useState<GenerationSummary | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [lastTrackedRepoInput, setLastTrackedRepoInput] = useState("");

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
    trackEvent("generation_started", {
      ...getRepoAnalyticsProperties(trimmedRepoUrl),
      locales: locales.join(","),
      locale_count: locales.length,
      preset,
      image_quality: "low",
    });
    try {
      const result = await createGeneration({
        repoUrl: trimmedRepoUrl,
        locales,
        preset,
        imageQuality: "low",
      });
      setGeneration(result);
      setStatus(`Generated ${result.id}`);
      trackEvent("generation_completed", {
        ...getRepoAnalyticsProperties(result.repo?.repo_url ?? trimmedRepoUrl),
        generation_id: result.id,
        locales: locales.join(","),
        locale_count: locales.length,
        preset,
        has_image_url: Boolean(Object.values(result.outputs ?? {}).some((output) => output?.imageUrl)),
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation request failed.");
      trackEvent("generation_failed", {
        ...getRepoAnalyticsProperties(trimmedRepoUrl),
        locales: locales.join(","),
        locale_count: locales.length,
        preset,
        error_type: error instanceof Error ? "request_failed" : "unknown",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstOutput = generation?.outputs ? Object.entries(generation.outputs)[0] : undefined;
  const outputLocale = firstOutput?.[0]?.toUpperCase();
  const outputPaths = firstOutput?.[1];
  const generatedImageUrl = outputPaths?.imageUrl;
  const generatedImageAlt = `${generation?.repo?.full_name ?? generation?.id ?? "Generated project"} launch card`;
  const downloadFileName = `${generation?.repo?.full_name ?? generation?.id ?? "quickfork-launch-card"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "quickfork-launch-card";

  useEffect(() => {
    if (!previewImageUrl) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewImageUrl(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewImageUrl]);

  const trackRepoInputIntent = () => {
    const trimmedRepoUrl = repoUrl.trim();
    if (!trimmedRepoUrl || trimmedRepoUrl === lastTrackedRepoInput) return;
    setLastTrackedRepoInput(trimmedRepoUrl);
    trackEvent("hero_repo_url_entered", getRepoAnalyticsProperties(trimmedRepoUrl));
  };

  const openGeneratedPreview = () => {
    if (!generatedImageUrl) return;
    setPreviewImageUrl(generatedImageUrl);
    trackEvent("generated_image_preview_opened", {
      ...getRepoAnalyticsProperties(generation?.repo?.repo_url ?? repoUrl),
      generation_id: generation?.id,
      output_locale: outputLocale,
      preset,
    });
  };

  const trackGeneratedDownload = () => {
    trackEvent("generated_image_downloaded", {
      ...getRepoAnalyticsProperties(generation?.repo?.repo_url ?? repoUrl),
      generation_id: generation?.id,
      output_locale: outputLocale,
      preset,
    });
  };

  return (
    <div className="generatorStack">
      <form className="referencePanel" aria-label="Project launch generator" onSubmit={handleSubmit}>
        <p className="referencePrompt">Can be used to generate README, PPT, or social media launch assets.</p>
        <div className="referenceForm">
          <label className="referenceField">
            <Github aria-hidden="true" size={17} />
            <span className="srOnly">GitHub repository URL</span>
            <input
              aria-label="GitHub repository URL"
              onBlur={trackRepoInputIntent}
              onChange={(event) => {
                setRepoUrl(event.target.value);
                setStatus(event.target.value.trim() ? "Ready to generate" : "Add a GitHub repository URL to continue");
              }}
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
            />
          </label>
          <button className="primaryButton" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 aria-hidden="true" className="spinIcon" size={17} /> : null}
            Generate
          </button>
        </div>
        <div className="referenceControls">
          <fieldset className="referencePlatforms">
            <legend className="referenceInlineLabel">
              <Languages aria-hidden="true" size={13} /> Languages
            </legend>
            {localeOptions.map((locale) => (
              <button
                aria-label={locale.label}
                aria-pressed={locales.includes(locale.id)}
                className={locales.includes(locale.id) ? "active" : ""}
                key={locale.id}
                onClick={() => toggleLocale(locale.id)}
                type="button"
              >
                {locale.shortLabel}
              </button>
            ))}
          </fieldset>
          <label className="referenceRatioSelect">
            <span>Ratio</span>
            <select aria-label="Asset ratio" onChange={(event) => setPreset(event.target.value as OutputPreset)} value={preset}>
              {ratioOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {generatedImageUrl ? (
          <figure className="generationPreview" aria-label="Generated Wavespeed image result">
            <button
              aria-label="Open generated image preview"
              className="generationPreviewButton"
              onClick={openGeneratedPreview}
              type="button"
            >
              <img alt={generatedImageAlt} src={generatedImageUrl} referrerPolicy="no-referrer" />
            </button>
            <figcaption>
              <span>{outputLocale ?? "EN"} result</span>
              <div className="generationPreviewActions">
                <strong>{generation?.repo?.full_name ?? generation?.id ?? "Generated project"}</strong>
                <button aria-label="Open generated image preview" onClick={openGeneratedPreview} type="button">
                  <Maximize2 aria-hidden="true" size={14} />
                </button>
                <a aria-label="Download generated image" download={`${downloadFileName}.png`} href={generatedImageUrl} onClick={trackGeneratedDownload}>
                  <Download aria-hidden="true" size={14} />
                </a>
              </div>
            </figcaption>
          </figure>
        ) : null}
        <p className="referenceStatus" aria-live="polite">
          {status}
        </p>
      </form>

      {generation ? (
        <span className="srOnly" aria-live="polite">
          Generated launch image for {generation.repo?.full_name ?? generation.id}
        </span>
      ) : null}
      {previewImageUrl ? (
        <div className="imageLightbox" aria-label="Generated image preview" aria-modal="true" role="dialog">
          <button className="imageLightboxBackdrop" aria-label="Close generated image preview" onClick={() => setPreviewImageUrl(null)} type="button" />
          <div className="imageLightboxPanel">
            <div className="imageLightboxToolbar">
              <span>{generation?.repo?.full_name ?? generation?.id ?? "Generated image"}</span>
              <div>
                <a aria-label="Download generated image" download={`${downloadFileName}.png`} href={previewImageUrl} onClick={trackGeneratedDownload}>
                  <Download aria-hidden="true" size={16} />
                </a>
                <button aria-label="Close generated image preview" onClick={() => setPreviewImageUrl(null)} type="button">
                  <X aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
            <img alt={generatedImageAlt} src={previewImageUrl} referrerPolicy="no-referrer" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductAnimationPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    void startManagedHeroVideoPlayback(videoRef.current);
  }, []);

  return (
    <div className="heroVisual" aria-label="QuickFork product preview">
      <aside className="productPlayback">
        <div className="videoFrame">
          <video
            aria-label="Product animation playback"
            autoPlay
            data-audio-autoplay="managed"
            disablePictureInPicture
            disableRemotePlayback
            loop
            onContextMenu={(event) => event.preventDefault()}
            playsInline
            preload="metadata"
            ref={videoRef}
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
