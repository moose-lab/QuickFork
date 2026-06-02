import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Copy, Download, Github, Languages, Loader2, Maximize2, X } from "lucide-react";
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
  launchBrief?: RepoLaunchBriefSummary;
}

interface RepoLaunchBriefSummary {
  summary: string;
  audienceHypothesis: string;
  audienceDiscovery?: RepoLaunchAudienceDiscoverySummary;
  storyMap?: RepoLaunchStoryMapSummary;
  launchMaterialsMap?: RepoLaunchMaterialsMapSummary;
  readmeChecklist: Array<{
    item: string;
    source: string;
  }>;
  launchAngles: Array<{
    title: string;
    body: string;
    source: string;
  }>;
  socialPost: string;
  deckOutline: string[];
  outreachDraft: string;
  visualExplainerPrompt: string;
  sourceReferences: string[];
  artifacts?: RepoLaunchBriefArtifactSummary[];
}

interface RepoLaunchAudienceDiscoverySummary {
  title: string;
  summary: string;
  signals: RepoLaunchAudienceSignalSummary[];
}

interface RepoLaunchAudienceSignalSummary {
  id: "technical_builders" | "open_source_adopters" | "launch_reviewers";
  segment: string;
  jobToBeDone: string;
  trigger: string;
  whereToFind: string;
  validationQuestion: string;
  source: string;
  priority: "high" | "medium";
}

interface RepoLaunchStoryMapSummary {
  title: string;
  summary: string;
  nodes: RepoLaunchStoryMapNodeSummary[];
}

interface RepoLaunchStoryMapNodeSummary {
  id: "source" | "audience" | "workflow" | "proof" | "launch";
  label: string;
  title: string;
  detail: string;
  source: string;
}

interface RepoLaunchMaterialsMapSummary {
  title: string;
  summary: string;
  channels: RepoLaunchMaterialChannelSummary[];
}

interface RepoLaunchMaterialChannelSummary {
  type: "readme" | "social" | "deck" | "visual" | "outreach";
  label: string;
  primaryUser: string;
  jobToBeDone: string;
  artifactLabel: string;
  channelFit: string;
  source: string;
  reviewQuestion: string;
  successSignal: string;
}

interface RepoLaunchBriefArtifactSummary {
  type: "audience" | "story_map" | "materials_map" | "readme" | "social" | "deck" | "outreach" | "visual";
  label: string;
  fileName: string;
  body: string;
  sourceReferences: string[];
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
  const trackedBriefId = useRef<string | null>(null);

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

  useEffect(() => {
    if (!generation?.launchBrief || trackedBriefId.current === generation.id) return;
    trackedBriefId.current = generation.id;
    trackEvent("launch_brief_viewed", {
      ...getRepoAnalyticsProperties(generation.repo?.repo_url ?? repoUrl),
      generation_id: generation.id,
      brief_sections: getLaunchBriefSectionCount(generation.launchBrief),
      source_reference_count: generation.launchBrief.sourceReferences.length,
    });
  }, [generation, repoUrl]);

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

      {generation?.launchBrief ? (
        <LaunchBriefPanel
          brief={generation.launchBrief}
          generationId={generation.id}
          repoFullName={generation.repo?.full_name ?? "Generated project"}
          repoUrl={generation.repo?.repo_url ?? repoUrl}
        />
      ) : null}

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

function LaunchBriefPanel({
  brief,
  generationId,
  repoFullName,
  repoUrl,
}: {
  brief: RepoLaunchBriefSummary;
  generationId: string;
  repoFullName: string;
  repoUrl: string;
}) {
  const [copyStatus, setCopyStatus] = useState("Ready to copy");

  const trackLaunchArtifact = (event: "launch_artifact_copied" | "launch_artifact_downloaded", artifact: RepoLaunchBriefArtifactSummary) => {
    trackEvent(event, {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      artifact_type: artifact.type,
      artifact_label: artifact.label,
      artifact_format: "text",
      source_reference_count: artifact.sourceReferences.length,
    });
  };

  const handleCopy = async () => {
    const exportText = serializeLaunchBrief(brief, repoFullName);
    await navigator.clipboard?.writeText(exportText);
    setCopyStatus("Copied launch brief");
    trackEvent("launch_brief_copied", {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      artifact_type: "free_repo_launch_brief",
      brief_sections: getLaunchBriefSectionCount(brief),
    });
  };

  const handleCopyAudienceDiscovery = async () => {
    if (!brief.audienceDiscovery) return;
    await navigator.clipboard?.writeText(serializeAudienceDiscovery(brief.audienceDiscovery));
    setCopyStatus("Copied target user map");
    trackEvent("launch_audience_map_copied", {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      segment_count: brief.audienceDiscovery.signals.length,
      channel_count: getAudienceChannelCount(brief.audienceDiscovery),
      validation_question_count: brief.audienceDiscovery.signals.filter((signal) => signal.validationQuestion).length,
    });
  };

  const handleCopyStoryMap = async () => {
    if (!brief.storyMap) return;
    await navigator.clipboard?.writeText(serializeStoryMap(brief.storyMap));
    setCopyStatus("Copied story map");
    trackEvent("launch_story_map_copied", {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      node_count: brief.storyMap.nodes.length,
      source_reference_count: brief.sourceReferences.length,
    });
  };

  const handleCopyMaterialsMap = async () => {
    if (!brief.launchMaterialsMap) return;
    await navigator.clipboard?.writeText(serializeLaunchMaterialsMap(brief.launchMaterialsMap));
    setCopyStatus("Copied launch materials map");
    trackEvent("launch_materials_map_copied", {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      channel_count: brief.launchMaterialsMap.channels.length,
      artifact_type_count: getLaunchMaterialArtifactTypeCount(brief.launchMaterialsMap),
      source_reference_count: brief.sourceReferences.length,
    });
  };

  const handleCopyArtifact = async (artifact: RepoLaunchBriefArtifactSummary) => {
    await navigator.clipboard?.writeText(artifact.body);
    setCopyStatus(`Copied ${artifact.label}`);
    trackLaunchArtifact("launch_artifact_copied", artifact);
  };

  const handleArtifactDownload = (artifact: RepoLaunchBriefArtifactSummary) => {
    setCopyStatus(`Downloaded ${artifact.label}`);
    trackLaunchArtifact("launch_artifact_downloaded", artifact);
  };

  const fullLaunchPackageHref = getFullLaunchPackageHref();
  const handleFullLaunchPackageIntent = () => {
    trackEvent("cta_clicked", {
      ...getRepoAnalyticsProperties(repoUrl),
      generation_id: generationId,
      cta_id: "request_full_launch_package",
      cta_label: "Request full launch package",
      cta_location: "launch_brief_panel",
      page_type: "product_activation",
      lifecycle_stage: "monetization",
      target_url: fullLaunchPackageHref,
      artifact_count: brief.artifacts?.length ?? 0,
      source_reference_count: brief.sourceReferences.length,
    });
  };

  return (
    <section className="launchBriefPanel" role="region" aria-labelledby="launch-brief-title">
      <div className="launchBriefHead">
        <div>
          <span className="monoLabel">Free repo launch brief</span>
          <h3 id="launch-brief-title">Free repo launch brief</h3>
          <p>{brief.summary}</p>
        </div>
        <button className="secondaryButton" onClick={handleCopy} type="button">
          <Copy aria-hidden="true" size={16} />
          Copy launch brief
        </button>
      </div>
      <div className="launchBriefMeta">
        <span>
          Audience hypothesis
          <b>{brief.audienceHypothesis}</b>
        </span>
        <span>
          Source references
          <b>{brief.sourceReferences.length}</b>
        </span>
        <span>
          Status
          <b>{copyStatus}</b>
        </span>
      </div>
      {brief.audienceDiscovery ? (
        <section className="launchAudienceDiscovery" aria-label="Target user discovery">
          <div className="launchAudienceDiscoveryHead">
            <div>
              <strong>Target user discovery</strong>
              <small>{brief.audienceDiscovery.summary}</small>
            </div>
            <button className="secondaryButton" onClick={() => void handleCopyAudienceDiscovery()} type="button">
              <Copy aria-hidden="true" size={15} />
              Copy target user map
            </button>
          </div>
          <ul className="launchAudienceDiscoverySignals">
            {brief.audienceDiscovery.signals.map((signal) => (
              <li key={signal.id}>
                <span>{signal.priority} priority</span>
                <strong>{signal.segment}</strong>
                <dl>
                  <div>
                    <dt>Job</dt>
                    <dd>{signal.jobToBeDone}</dd>
                  </div>
                  <div>
                    <dt>Trigger</dt>
                    <dd>{signal.trigger}</dd>
                  </div>
                  <div>
                    <dt>Where</dt>
                    <dd>{signal.whereToFind}</dd>
                  </div>
                  <div>
                    <dt>Ask</dt>
                    <dd>{signal.validationQuestion}</dd>
                  </div>
                </dl>
                <small>{signal.source}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {brief.storyMap ? (
        <section className="launchStoryMap" aria-label="Project story map">
          <div className="launchStoryMapHead">
            <div>
              <strong>Project story map</strong>
              <small>{brief.storyMap.summary}</small>
            </div>
            <button className="secondaryButton" onClick={() => void handleCopyStoryMap()} type="button">
              <Copy aria-hidden="true" size={15} />
              Copy story map
            </button>
          </div>
          <ol className="launchStoryMapNodes">
            {brief.storyMap.nodes.map((node) => (
              <li key={node.id}>
                <span>{node.label}</span>
                <strong>{node.title}</strong>
                <p>{node.detail}</p>
                <small>{node.source}</small>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {brief.launchMaterialsMap ? (
        <section className="launchMaterialsMap" aria-label="Launch materials map">
          <div className="launchMaterialsMapHead">
            <div>
              <strong>Launch materials map</strong>
              <small>{brief.launchMaterialsMap.summary}</small>
            </div>
            <button className="secondaryButton" onClick={() => void handleCopyMaterialsMap()} type="button">
              <Copy aria-hidden="true" size={15} />
              Copy launch materials map
            </button>
          </div>
          <ul className="launchMaterialsMapChannels">
            {brief.launchMaterialsMap.channels.map((channel) => (
              <li key={channel.type}>
                <span>{channel.type}</span>
                <strong>{channel.label}</strong>
                <dl>
                  <div>
                    <dt>User</dt>
                    <dd>{channel.primaryUser}</dd>
                  </div>
                  <div>
                    <dt>Job</dt>
                    <dd>{channel.jobToBeDone}</dd>
                  </div>
                  <div>
                    <dt>Artifact</dt>
                    <dd>{channel.artifactLabel}</dd>
                  </div>
                  <div>
                    <dt>Fit</dt>
                    <dd>{channel.channelFit}</dd>
                  </div>
                  <div>
                    <dt>Review</dt>
                    <dd>{channel.reviewQuestion}</dd>
                  </div>
                  <div>
                    <dt>Signal</dt>
                    <dd>{channel.successSignal}</dd>
                  </div>
                </dl>
                <small>{channel.source}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {brief.artifacts?.length ? (
        <div className="launchArtifactList" aria-label="Launch artifact exports">
          <div className="launchArtifactIntro">
            <strong>Export artifacts</strong>
            <small>Copy or download channel-ready text without sending raw content to analytics.</small>
          </div>
          {brief.artifacts.map((artifact) => (
            <div className="launchArtifactRow" key={`${artifact.type}-${artifact.fileName}`}>
              <div>
                <strong>{artifact.label}</strong>
                <small>{artifact.fileName}</small>
              </div>
              <div className="launchArtifactActions">
                <button aria-label={`Copy ${artifact.label}`} onClick={() => void handleCopyArtifact(artifact)} type="button">
                  <Copy aria-hidden="true" size={15} />
                  Copy
                </button>
                <a
                  aria-label={`Download ${artifact.label}`}
                  download={artifact.fileName}
                  href={getArtifactDownloadHref(artifact)}
                  onClick={() => handleArtifactDownload(artifact)}
                >
                  <Download aria-hidden="true" size={15} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="launchPackageCta">
        <div>
          <strong>Need a complete launch package?</strong>
          <small>Request reviewed README, social, deck, outreach, and visual assets before publishing.</small>
        </div>
        <a className="primaryButton" href={fullLaunchPackageHref} onClick={handleFullLaunchPackageIntent}>
          Request full launch package
          <ArrowRight aria-hidden="true" size={16} />
        </a>
      </div>
      <div className="launchBriefGrid">
        <article>
          <strong>README checklist</strong>
          <ul>
            {brief.readmeChecklist.map((item) => (
              <li key={item.item}>
                {item.item}
                <small>{item.source}</small>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <strong>Launch angles</strong>
          <ul>
            {brief.launchAngles.map((angle) => (
              <li key={angle.title}>
                {angle.title}: {angle.body}
                <small>{angle.source}</small>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <strong>Social post</strong>
          <p>{brief.socialPost}</p>
        </article>
        <article>
          <strong>Deck outline</strong>
          <ol>
            {brief.deckOutline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article>
          <strong>Outreach draft</strong>
          <p>{brief.outreachDraft}</p>
        </article>
        <article>
          <strong>Visual explainer prompt</strong>
          <p>{brief.visualExplainerPrompt}</p>
        </article>
      </div>
    </section>
  );
}

function getLaunchBriefSectionCount(brief: RepoLaunchBriefSummary) {
  return 6 + (brief.audienceDiscovery ? 1 : 0) + (brief.storyMap ? 1 : 0) + (brief.launchMaterialsMap ? 1 : 0);
}

function getArtifactDownloadHref(artifact: RepoLaunchBriefArtifactSummary) {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(artifact.body)}`;
}

function getFullLaunchPackageHref() {
  const params = new URLSearchParams({
    intent: "launch-package",
    utm_source: "quickfork",
    utm_medium: "product",
    utm_campaign: "full_launch_package",
    utm_content: "artifact_review_cta",
  });
  return `/contact?${params.toString()}`;
}

function serializeLaunchBrief(brief: RepoLaunchBriefSummary, repoFullName: string) {
  return [
    `Free repo launch brief: ${repoFullName}`,
    "",
    `Summary: ${brief.summary}`,
    `Audience hypothesis: ${brief.audienceHypothesis}`,
    "",
    ...(brief.audienceDiscovery ? [serializeAudienceDiscovery(brief.audienceDiscovery), ""] : []),
    ...(brief.storyMap ? [serializeStoryMap(brief.storyMap), ""] : []),
    ...(brief.launchMaterialsMap ? [serializeLaunchMaterialsMap(brief.launchMaterialsMap), ""] : []),
    "README checklist:",
    ...brief.readmeChecklist.map((item) => `- ${item.item} (${item.source})`),
    "",
    "Launch angles:",
    ...brief.launchAngles.map((angle) => `- ${angle.title}: ${angle.body} (${angle.source})`),
    "",
    "Social post:",
    brief.socialPost,
    "",
    "Deck outline:",
    ...brief.deckOutline.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Outreach draft:",
    brief.outreachDraft,
    "",
    "Visual explainer prompt:",
    brief.visualExplainerPrompt,
    "",
    "Source references:",
    ...brief.sourceReferences.map((source) => `- ${source}`),
  ].join("\n");
}

function serializeAudienceDiscovery(audienceDiscovery: RepoLaunchAudienceDiscoverySummary) {
  return [
    `Target user discovery: ${audienceDiscovery.title}`,
    "",
    audienceDiscovery.summary,
    "",
    ...audienceDiscovery.signals.map((signal, index) =>
      [
        `${index + 1}. ${signal.segment}`,
        `   Priority: ${signal.priority}`,
        `   Job to be done: ${signal.jobToBeDone}`,
        `   Trigger: ${signal.trigger}`,
        `   Where to find: ${signal.whereToFind}`,
        `   Validation question: ${signal.validationQuestion}`,
        `   Source: ${signal.source}`,
      ].join("\n"),
    ),
  ].join("\n");
}

function serializeStoryMap(storyMap: RepoLaunchStoryMapSummary) {
  return [
    `Project story map: ${storyMap.title}`,
    "",
    storyMap.summary,
    "",
    ...storyMap.nodes.map((node, index) => `${index + 1}. ${node.label}: ${node.title}\n   Detail: ${node.detail}\n   Source: ${node.source}`),
  ].join("\n");
}

function serializeLaunchMaterialsMap(launchMaterialsMap: RepoLaunchMaterialsMapSummary) {
  return [
    `Launch materials map: ${launchMaterialsMap.title}`,
    "",
    launchMaterialsMap.summary,
    "",
    ...launchMaterialsMap.channels.map((channel, index) =>
      [
        `${index + 1}. ${channel.label}`,
        `   Channel: ${channel.type}`,
        `   Primary user: ${channel.primaryUser}`,
        `   Job to be done: ${channel.jobToBeDone}`,
        `   Artifact: ${channel.artifactLabel}`,
        `   Channel fit: ${channel.channelFit}`,
        `   Review question: ${channel.reviewQuestion}`,
        `   Success signal: ${channel.successSignal}`,
        `   Source: ${channel.source}`,
      ].join("\n"),
    ),
  ].join("\n");
}

function getAudienceChannelCount(audienceDiscovery: RepoLaunchAudienceDiscoverySummary) {
  return new Set(audienceDiscovery.signals.map((signal) => signal.whereToFind)).size;
}

function getLaunchMaterialArtifactTypeCount(launchMaterialsMap: RepoLaunchMaterialsMapSummary) {
  return new Set(launchMaterialsMap.channels.map((channel) => channel.type)).size;
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
          <h1 id="hero-title">Generate a cold-start launch package from one GitHub repository.</h1>
          <p className="heroCopy">
            QuickFork reads repository evidence, explains the project visually, and drafts README, social, deck, and outreach assets that builders can review before launch.
          </p>
          <ProjectLaunchInputPanel />
        </div>
        <ProductAnimationPanel />
      </div>
    </section>
  );
}
