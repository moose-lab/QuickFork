import { buildProjectBrief } from "./brief.js";
import { buildLayoutSpec, buildLocalizedCopies } from "./copy.js";
import { extractReadmeContext } from "./readme.js";
import { selectVisualDirection } from "./visual.js";
import { GenerationError } from "./types.js";
import type {
  GenerationProvider,
  GenerationCredentialSource,
  GitHubRepoMetadata,
  GenerationModelConfig,
  LocalizedCardCopy,
  MarketingCardLayoutSpec,
  ProjectBrief,
  ReadmeContext,
  RepoReference,
  CreateGenerationInput,
  StoredReferenceAsset,
  VisualDirection,
} from "./types.js";

export const DEFAULT_GENERATION_MODELS: GenerationModelConfig = {
  llm: "openai/gpt-5.5",
  image: "openai/gpt-image-2/text-to-image",
};

export const OPENAI_GENERATION_MODELS: GenerationModelConfig = {
  llm: "gpt-5.5",
  image: "gpt-image-2",
};

export const OPENAI_API_KEY_ENV = "OPENAI_API_KEY";
export const OPENAI_BASE_URL_ENV = "OPENAI_BASE_URL";
export const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
export const OPENAI_RESPONSES_URL = `${OPENAI_API_BASE_URL}/responses`;
export const CHATGPT_OAUTH_ACCESS_TOKEN_ENV = "CHATGPT_OAUTH_ACCESS_TOKEN";
export const WAVESPEED_API_KEY_ENV = "WAVESPEED_API_KEY";
export const WAVESPEED_LLM_BASE_URL = "https://llm.wavespeed.ai/v1";
export const WAVESPEED_CHAT_COMPLETIONS_URL = `${WAVESPEED_LLM_BASE_URL}/chat/completions`;

export type WavespeedChatRole = "system" | "user" | "assistant";

export interface WavespeedChatMessage {
  role: WavespeedChatRole;
  content: string;
}

export interface WavespeedChatCompletionRequest {
  url: string;
  body: {
    model: string;
    messages: WavespeedChatMessage[];
    temperature?: number;
  };
}

function normalizeBearerToken(value: string) {
  return value
    .trim()
    .replace(/^Bearer\s+/i, "")
    .replace(/^[`'"“”‘’]+|[`'"“”‘’]+$/g, "")
    .trim();
}

export const normalizeWavespeedApiKey = normalizeBearerToken;
export const normalizeOpenAIApiKey = normalizeBearerToken;

export interface GenerationBearerCredential {
  bearerToken: string;
  source: GenerationCredentialSource;
}

export interface OpenAIResponsesRequest {
  url: string;
  body: {
    model: string;
    instructions: string;
    input: string;
    temperature?: number;
  };
}

export interface BuildProjectLaunchPlanInput {
  repo: RepoReference;
  metadata: GitHubRepoMetadata;
  readmeMarkdown: string;
  primaryIdentityAsset: StoredReferenceAsset;
  readme?: ReadmeContext;
}

export interface ProjectLaunchPlan {
  model: string;
  readme: ReadmeContext;
  brief: ProjectBrief;
  visualDirection: VisualDirection;
  layout: MarketingCardLayoutSpec;
  localizedCopy: Record<"en" | "zh" | "ja", LocalizedCardCopy>;
}

export interface ProjectLaunchLlmAdapter {
  model: string;
  readRepositoryContext(input: {
    repo: RepoReference;
    metadata: GitHubRepoMetadata;
    readmeMarkdown: string;
  }): Promise<ReadmeContext>;
  buildProjectLaunchPlan(input: BuildProjectLaunchPlanInput): Promise<ProjectLaunchPlan>;
}

export function resolveGenerationModelConfig(models?: Partial<GenerationModelConfig>, provider: GenerationProvider = "wavespeed"): GenerationModelConfig {
  const defaults = provider === "openai" || provider === "chatgpt-oauth" ? OPENAI_GENERATION_MODELS : DEFAULT_GENERATION_MODELS;
  return {
    llm: models?.llm?.trim() || defaults.llm,
    image: models?.image?.trim() || defaults.image,
  };
}

export function resolveChatGptOAuthCredential(auth?: CreateGenerationInput["auth"]): GenerationBearerCredential {
  if (auth?.bearerToken) {
    return {
      bearerToken: normalizeOpenAIApiKey(auth.bearerToken),
      source: auth.source,
    };
  }
  const environmentToken = process.env[CHATGPT_OAUTH_ACCESS_TOKEN_ENV];
  if (environmentToken) {
    return {
      bearerToken: normalizeOpenAIApiKey(environmentToken),
      source: "environment",
    };
  }
  throw new GenerationError(
    "VALIDATION_ERROR",
    `${CHATGPT_OAUTH_ACCESS_TOKEN_ENV} or request Authorization bearer token is required to use provider chatgpt-oauth.`,
  );
}

export function buildWavespeedChatCompletionRequest(input: {
  model?: string;
  messages: WavespeedChatMessage[];
  temperature?: number;
}): WavespeedChatCompletionRequest {
  return {
    url: WAVESPEED_CHAT_COMPLETIONS_URL,
    body: {
      model: input.model?.trim() || DEFAULT_GENERATION_MODELS.llm,
      messages: input.messages,
      ...(input.temperature === undefined ? {} : { temperature: input.temperature }),
    },
  };
}

export function openAIResponsesUrl() {
  return `${(process.env[OPENAI_BASE_URL_ENV] ?? OPENAI_API_BASE_URL).replace(/\/+$/, "")}/responses`;
}

export function buildOpenAIResponsesRequest(input: {
  model?: string;
  instructions: string;
  input: string;
  temperature?: number;
}): OpenAIResponsesRequest {
  return {
    url: openAIResponsesUrl(),
    body: {
      model: input.model?.trim() || OPENAI_GENERATION_MODELS.llm,
      instructions: input.instructions,
      input: input.input,
      ...(input.temperature === undefined ? {} : { temperature: input.temperature }),
    },
  };
}

function extractOpenAIOutputText(body: unknown): string {
  if (body && typeof body === "object") {
    const value = body as {
      output_text?: unknown;
      output?: Array<{ content?: Array<{ text?: unknown; type?: unknown }> }>;
    };
    if (typeof value.output_text === "string" && value.output_text.trim()) {
      return value.output_text;
    }
    const text = value.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .find((content): content is string => typeof content === "string" && content.trim().length > 0);
    if (text) return text;
  }
  throw new Error("OpenAI Responses API returned an empty message.");
}

export async function callOpenAIResponses(input: {
  apiKey?: string;
  model?: string;
  instructions: string;
  input: string;
  temperature?: number;
  fetchImpl?: typeof fetch;
}): Promise<string> {
  const apiKey = input.apiKey ?? process.env[OPENAI_API_KEY_ENV];
  if (!apiKey) {
    throw new Error(`${OPENAI_API_KEY_ENV} is required to call OpenAI Responses.`);
  }
  const normalizedApiKey = normalizeOpenAIApiKey(apiKey);
  const request = buildOpenAIResponsesRequest(input);
  const response = await (input.fetchImpl ?? fetch)(request.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${normalizedApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) {
    throw new Error(`OpenAI Responses API failed with ${response.status}.`);
  }
  return extractOpenAIOutputText(await response.json());
}

export async function callWavespeedChatCompletion(input: {
  apiKey?: string;
  model?: string;
  messages: WavespeedChatMessage[];
  temperature?: number;
  fetchImpl?: typeof fetch;
}): Promise<string> {
  const apiKey = input.apiKey ?? process.env[WAVESPEED_API_KEY_ENV];
  if (!apiKey) {
    throw new Error(`${WAVESPEED_API_KEY_ENV} is required to call Wavespeed GPT5.5.`);
  }
  const normalizedApiKey = normalizeWavespeedApiKey(apiKey);
  const request = buildWavespeedChatCompletionRequest(input);
  const response = await (input.fetchImpl ?? fetch)(request.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${normalizedApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) {
    throw new Error(`Wavespeed chat completion failed with ${response.status}.`);
  }
  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = body.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Wavespeed chat completion returned an empty message.");
  }
  return content;
}

export function createOpenAILlmAdapter(config: { model?: string; apiKey?: string; fetchImpl?: typeof fetch } = {}): ProjectLaunchLlmAdapter {
  const model = config.model?.trim() || OPENAI_GENERATION_MODELS.llm;
  const readRepositoryContext: ProjectLaunchLlmAdapter["readRepositoryContext"] = async (input) => {
    await callOpenAIResponses({
      apiKey: config.apiKey,
      model,
      fetchImpl: config.fetchImpl,
      temperature: 0.2,
      instructions:
        "You are QuickFork's repository analyst. Read README and GitHub metadata, then identify positioning, metrics, features, workflow, links, and project identity signals. Return concise source-grounded analysis.",
      input: JSON.stringify({
        repo: input.repo,
        metadata: input.metadata,
        readmeMarkdown: input.readmeMarkdown.slice(0, 24000),
      }),
    });
    return extractReadmeContext(input.readmeMarkdown, input.repo, input.metadata);
  };

  return {
    model,
    readRepositoryContext,
    async buildProjectLaunchPlan(input) {
      const readme =
        input.readme ??
        (await readRepositoryContext({
          repo: input.repo,
          metadata: input.metadata,
          readmeMarkdown: input.readmeMarkdown,
        }));
      await callOpenAIResponses({
        apiKey: config.apiKey,
        model,
        fetchImpl: config.fetchImpl,
        temperature: 0.3,
        instructions:
          "You are QuickFork's launch-card planner. Produce a concise multilingual launch plan from the repository evidence. Preserve metrics, URLs, identity constraints, and source facts.",
        input: JSON.stringify({
          repo: input.repo,
          metadata: input.metadata,
          readme: readme.extracted,
          primaryIdentityAsset: input.primaryIdentityAsset,
        }),
      });
      const brief = buildProjectBrief(input.metadata, readme);
      const visualDirection = selectVisualDirection(input.metadata, brief);
      const layout = buildLayoutSpec(input.metadata, brief, input.primaryIdentityAsset);
      const localizedCopy = buildLocalizedCopies(input.metadata, brief);

      return {
        model,
        readme,
        brief,
        visualDirection,
        layout,
        localizedCopy,
      };
    },
  };
}

export function createMockLlmAdapter(config: { model?: string } = {}): ProjectLaunchLlmAdapter {
  const model = config.model?.trim() || DEFAULT_GENERATION_MODELS.llm;
  const readRepositoryContext: ProjectLaunchLlmAdapter["readRepositoryContext"] = async (input) =>
    extractReadmeContext(input.readmeMarkdown, input.repo, input.metadata);

  return {
    model,
    readRepositoryContext,
    async buildProjectLaunchPlan(input) {
      const readme =
        input.readme ??
        (await readRepositoryContext({
          repo: input.repo,
          metadata: input.metadata,
          readmeMarkdown: input.readmeMarkdown,
        }));
      const brief = buildProjectBrief(input.metadata, readme);
      const visualDirection = selectVisualDirection(input.metadata, brief);
      const layout = buildLayoutSpec(input.metadata, brief, input.primaryIdentityAsset);
      const localizedCopy = buildLocalizedCopies(input.metadata, brief);

      return {
        model,
        readme,
        brief,
        visualDirection,
        layout,
        localizedCopy,
      };
    },
  };
}

export function createWavespeedLlmAdapter(config: { model?: string; fetchImpl?: typeof fetch } = {}): ProjectLaunchLlmAdapter {
  const model = config.model?.trim() || DEFAULT_GENERATION_MODELS.llm;
  const readRepositoryContext: ProjectLaunchLlmAdapter["readRepositoryContext"] = async (input) => {
    await callWavespeedChatCompletion({
      model,
      fetchImpl: config.fetchImpl,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are QuickFork's repository analyst. Read README and GitHub metadata, then identify positioning, metrics, features, workflow, links, and project identity signals. Return concise source-grounded analysis.",
        },
        {
          role: "user",
          content: JSON.stringify({
            repo: input.repo,
            metadata: input.metadata,
            readmeMarkdown: input.readmeMarkdown.slice(0, 24000),
          }),
        },
      ],
    });
    return extractReadmeContext(input.readmeMarkdown, input.repo, input.metadata);
  };

  return {
    model,
    readRepositoryContext,
    async buildProjectLaunchPlan(input) {
      const readme =
        input.readme ??
        (await readRepositoryContext({
          repo: input.repo,
          metadata: input.metadata,
          readmeMarkdown: input.readmeMarkdown,
        }));
      await callWavespeedChatCompletion({
        model,
        fetchImpl: config.fetchImpl,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are QuickFork's launch-card planner. Produce a concise multilingual launch plan from the repository evidence. Preserve metrics, URLs, identity constraints, and source facts.",
          },
          {
            role: "user",
            content: JSON.stringify({
              repo: input.repo,
              metadata: input.metadata,
              readme: readme.extracted,
              primaryIdentityAsset: input.primaryIdentityAsset,
            }),
          },
        ],
      });
      const brief = buildProjectBrief(input.metadata, readme);
      const visualDirection = selectVisualDirection(input.metadata, brief);
      const layout = buildLayoutSpec(input.metadata, brief, input.primaryIdentityAsset);
      const localizedCopy = buildLocalizedCopies(input.metadata, brief);

      return {
        model,
        readme,
        brief,
        visualDirection,
        layout,
        localizedCopy,
      };
    },
  };
}
