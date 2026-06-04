import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Braces, FileImage, Github, Languages, MonitorUp, Settings2, Sparkles } from "lucide-react";
import {
  ASSET_PRESETS,
  DEFAULT_MODEL_SETTINGS,
  NARRATIVE_OPTIONS,
  type LocaleCode,
  type NarrativeOptionId,
  buildLaunchPackage,
} from "../../core/pipeline";
import { SectionIntro } from "../landing/SectionIntro";

const sampleNotes =
  "Thinking with Visual Primitives addresses the Reference Gap by using points and bounding boxes as minimal units of thought. It reports ~90 KV-cache entries for 800 x 800 images and 77.2% average score on selected benchmarks.";

const exampleImages = [
  { label: "Reference", src: "/examples/flashqla-reference.jpeg" },
  { label: "English", src: "/examples/twvp-cover-en.png" },
  { label: "Chinese", src: "/examples/twvp-cover-zh.png" },
  { label: "Japanese", src: "/examples/twvp-cover-ja.png" },
];

const studioAssetPresets = ASSET_PRESETS.filter((preset) => preset.useCase !== "PPT");

export function ProductStudio() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/deepseek-ai/Thinking-with-Visual-Primitives");
  const [projectName, setProjectName] = useState("Thinking with Visual Primitives");
  const [notes, setNotes] = useState(sampleNotes);
  const [presetId, setPresetId] = useState("github-readme");
  const [narrativeId, setNarrativeId] = useState<NarrativeOptionId>("research");
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("en");
  const [copyModel, setCopyModel] = useState(DEFAULT_MODEL_SETTINGS.copyModel);
  const [imageModel, setImageModel] = useState(DEFAULT_MODEL_SETTINGS.imageModel);
  const [imageQuality, setImageQuality] = useState(DEFAULT_MODEL_SETTINGS.imageQuality);

  const launchPackage = useMemo(
    () =>
      buildLaunchPackage({
        repoUrl,
        projectName,
        sourceNotes: notes,
        assetPresetId: presetId,
        narrativeOption: narrativeId,
        modelSettings: {
          ...DEFAULT_MODEL_SETTINGS,
          copyModel,
          imageModel,
          imageQuality,
          imageSize: ASSET_PRESETS.find((preset) => preset.id === presetId)?.size ?? DEFAULT_MODEL_SETTINGS.imageSize,
        },
      }),
    [copyModel, imageModel, imageQuality, narrativeId, notes, presetId, projectName, repoUrl],
  );

  const activeOutput = launchPackage.locales.find((locale) => locale.code === activeLocale) ?? launchPackage.locales[0];

  return (
    <section className="studioSection" id="studio" aria-labelledby="studio-title">
      <div className="sectionGrid studioIntro">
        <SectionIntro
          copy="The generator stays on the page because the product promise is intentionally direct: one repository source, one editable story, and social launch surfaces for README, X/LinkedIn, and square feed cards."
          eyebrow="Studio / Generator"
          id="studio-title"
          label="Social channel studio"
          title="Keep the repo-to-social package editable inside the page."
        />
      </div>

      <div className="controlGrid">
        <div className="panel inputPanel">
          <div className="panelTitle">
            <Github size={18} /> Repository source
          </div>
          <label>
            GitHub URL
            <input value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} />
          </label>
          <label>
            Project name
            <input value={projectName} onChange={(event) => setProjectName(event.target.value)} />
          </label>
          <label>
            Technical notes or extracted README/PDF summary
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={7} />
          </label>
        </div>

        <div className="panel">
          <div className="panelTitle">
            <Settings2 size={18} /> Model settings
          </div>
          <div className="settingGrid">
            <label>
              Copy model
              <input value={copyModel} onChange={(event) => setCopyModel(event.target.value)} />
            </label>
            <label>
              Image model
              <input value={imageModel} onChange={(event) => setImageModel(event.target.value)} />
            </label>
            <label>
              Image quality
              <select value={imageQuality} onChange={(event) => setImageQuality(event.target.value as typeof imageQuality)}>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
                <option value="auto">auto</option>
              </select>
            </label>
          </div>
          <p className="note">
            Store API keys on the server only. The web app keeps model names and generation preferences visible here,
            while `.env.example` documents runtime secrets.
          </p>

          <div className="panelTitle compact">
            <Sparkles size={18} /> Narrative options
          </div>
          <div className="optionList narrativeList">
            {NARRATIVE_OPTIONS.map((option) => (
              <button
                aria-pressed={option.id === narrativeId}
                className={option.id === narrativeId ? "option active" : "option"}
                key={option.id}
                onClick={() => setNarrativeId(option.id)}
                type="button"
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>

          <div className="panelTitle compact">
            <MonitorUp size={18} /> Output options
          </div>
          <div className="optionList">
            {studioAssetPresets.map((preset) => (
              <button
                aria-pressed={preset.id === presetId}
                className={preset.id === presetId ? "option active" : "option"}
                key={preset.id}
                onClick={() => setPresetId(preset.id)}
                type="button"
              >
                <strong>{preset.label}</strong>
                <span>
                  {preset.useCase} · {preset.aspect} · {preset.size}
                </span>
              </button>
            ))}
          </div>
          <div className="tags">
            <span>README</span>
            <span>X / LinkedIn</span>
            <span>Square social</span>
          </div>
        </div>
      </div>

      <div className="workflowBand" aria-label="Launch package pipeline">
        <div className="workflowStep">
          <BookOpen size={18} />
          <strong>1. Analyze</strong>
          <span>Repo README, PDF, examples</span>
        </div>
        <ArrowRight size={18} />
        <div className="workflowStep">
          <Braces size={18} />
          <strong>2. Structure</strong>
          <span>Metrics, insights, steps</span>
        </div>
        <ArrowRight size={18} />
        <div className="workflowStep">
          <FileImage size={18} />
          <strong>3. Generate</strong>
          <span>Copy and infographic prompts</span>
        </div>
      </div>

      <div className="outputGrid">
        <div className="panel previewPanel">
          <div className="panelTitle">
            <Languages size={18} /> Localized social package
          </div>
          <div className="localeTabs">
            {launchPackage.locales.map((locale) => (
              <button
                aria-pressed={activeLocale === locale.code}
                className={activeLocale === locale.code ? "tab active" : "tab"}
                key={locale.code}
                onClick={() => setActiveLocale(locale.code)}
                type="button"
              >
                {locale.label}
              </button>
            ))}
          </div>
          <pre className="copyPreview">{activeOutput.copy}</pre>
        </div>

        <div className="panel promptPanel">
          <div className="panelTitle">
            <FileImage size={18} /> Social card prompt
          </div>
          <pre className="promptPreview">{activeOutput.coverPrompt}</pre>
        </div>
      </div>

      <div className="examples">
        <div className="sectionHeading">
          <h3>Example materials</h3>
          <p>Reference and generated covers included for README, X/LinkedIn, square card, and manifest review.</p>
        </div>
        <div className="imageGrid">
          {exampleImages.map((imageItem) => (
            <figure key={imageItem.src}>
              <img src={imageItem.src} alt={`${imageItem.label} cover example`} />
              <figcaption>{imageItem.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
