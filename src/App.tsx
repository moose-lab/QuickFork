import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Braces,
  CheckCircle2,
  FileImage,
  Github,
  Languages,
  MonitorUp,
  Settings2,
  Sparkles,
} from "lucide-react";
import {
  ASSET_PRESETS,
  DEFAULT_MODEL_SETTINGS,
  NARRATIVE_OPTIONS,
  type LocaleCode,
  buildLaunchPackage,
} from "./core/pipeline";

const sampleNotes =
  "Thinking with Visual Primitives addresses the Reference Gap by using points and bounding boxes as minimal units of thought. It reports ~90 KV-cache entries for 800 x 800 images and 77.2% average score on selected benchmarks.";

const exampleImages = [
  { label: "Reference", src: "/examples/flashqla-reference.jpeg" },
  { label: "English", src: "/examples/twvp-cover-en.png" },
  { label: "中文", src: "/examples/twvp-cover-zh.png" },
  { label: "日本語", src: "/examples/twvp-cover-ja.png" },
];

function App() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/deepseek-ai/Thinking-with-Visual-Primitives");
  const [projectName, setProjectName] = useState("Thinking with Visual Primitives");
  const [notes, setNotes] = useState(sampleNotes);
  const [presetId, setPresetId] = useState("github-readme");
  const [narrativeId, setNarrativeId] = useState("research");
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
        narrativeOption: narrativeId as typeof NARRATIVE_OPTIONS[number]["id"],
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
    <main className="appShell">
      <section className="workspaceHeader">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> GitHub repo to launch copy</div>
          <h1>QuickFork</h1>
          <p>
            Quickly understand a GitHub project, turn the overview into native launch copy, and create share-ready
            infographic prompts for README, PPT, and social distribution.
          </p>
        </div>
        <div className="statusStrip">
          <span><CheckCircle2 size={16} /> Structure locked</span>
          <span><Languages size={16} /> EN / 中文 / 日本語</span>
        </div>
      </section>

      <section className="controlGrid">
        <div className="panel inputPanel">
          <div className="panelTitle"><Github size={18} /> Repository source</div>
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
          <div className="panelTitle"><Settings2 size={18} /> Model settings</div>
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
            Store API keys on the server only. The web app keeps model names and generation preferences visible here, while
            `.env.example` documents runtime secrets.
          </p>

          <div className="panelTitle compact"><Sparkles size={18} /> Narrative options</div>
          <div className="optionList narrativeList">
            {NARRATIVE_OPTIONS.map((option) => (
              <button
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

          <div className="panelTitle compact"><MonitorUp size={18} /> Output options</div>
          <div className="optionList">
            {ASSET_PRESETS.map((preset) => (
              <button
                className={preset.id === presetId ? "option active" : "option"}
                key={preset.id}
                onClick={() => setPresetId(preset.id)}
                type="button"
              >
                <strong>{preset.label}</strong>
                <span>{preset.useCase} · {preset.aspect} · {preset.size}</span>
              </button>
            ))}
          </div>
          <div className="tags"><span>README</span><span>PPT</span><span>Social</span></div>
        </div>
      </section>

      <section className="workflowBand">
        <div className="workflowStep"><BookOpen size={18} /><strong>1. Analyze</strong><span>Repo README, PDF, examples</span></div>
        <ArrowRight size={18} />
        <div className="workflowStep"><Braces size={18} /><strong>2. Structure</strong><span>Metrics, insights, steps</span></div>
        <ArrowRight size={18} />
        <div className="workflowStep"><FileImage size={18} /><strong>3. Generate</strong><span>Copy and infographic prompts</span></div>
      </section>

      <section className="outputGrid">
        <div className="panel previewPanel">
          <div className="panelTitle"><Languages size={18} /> Localized launch package</div>
          <div className="localeTabs">
            {launchPackage.locales.map((locale) => (
              <button
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
          <div className="panelTitle"><FileImage size={18} /> Infographic prompt</div>
          <pre className="promptPreview">{activeOutput.coverPrompt}</pre>
        </div>
      </section>

      <section className="examples">
        <div className="sectionHeading">
          <h2>Example materials</h2>
          <p>Reference and generated covers included for README, deck, and social review.</p>
        </div>
        <div className="imageGrid">
          {exampleImages.map((image) => (
            <figure key={image.src}>
              <img src={image.src} alt={`${image.label} cover example`} />
              <figcaption>{image.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
