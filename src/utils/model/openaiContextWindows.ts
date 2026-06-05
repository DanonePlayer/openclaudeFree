/**
 * Runtime overrides for OpenAI-compatible model limits.
 *
 * Built-in model limits, including legacy aliases, live in
 * src/integrations/models. These helpers only preserve the documented JSON env
 * override path for custom/private deployments.
 */

type LimitEnvVar =
  | 'CLAUDE_CODE_OPENAI_CONTEXT_WINDOWS'
  | 'CLAUDE_CODE_OPENAI_MAX_OUTPUT_TOKENS'

export type OpenAILimitOverrideMatches = {
  exact?: number
  prefix?: number
}

// Built-in context window defaults for OpenAI-compatible models.
// When a model is not found here, the system falls back to src/integrations/models.
// NOTE: bare Claude model names (e.g. 'claude-sonnet-4') are intentionally
// omitted. Different OpenAI-compatible providers may impose different context
// limits for the same model name, so we cannot safely hardcode values here.
const OPENAI_CONTEXT_WINDOWS: Record<string, number> = {
  // OpenAI
  'gpt-5.4':               1_050_000,
  'gpt-5.4-mini':            400_000,
  'gpt-5.4-nano':            400_000,
  'gpt-4o':                   128_000,
  'gpt-4o-mini':              128_000,
  'gpt-4.1':                  1_047_576,
  'gpt-4.1-mini':             1_047_576,
  'gpt-4.1-nano':             1_047_576,
  'gpt-4-turbo':              128_000,
  'gpt-4':                     8_192,
  'o1':                       200_000,
  'o1-mini':                  128_000,
  'o1-preview':               128_000,
  'o1-pro':                   200_000,
  'o3':                       200_000,
  'o3-mini':                  200_000,
  'o4-mini':                  200_000,

  // DeepSeek (V3: 128k context per official docs)
  'deepseek-chat':            128_000,
  'deepseek-reasoner':        128_000,

  // Groq (fast inference)
  'llama-3.3-70b-versatile':  128_000,
  'llama-3.1-8b-instant':     128_000,
  'mixtral-8x7b-32768':        32_768,

  // Mistral
  'mistral-large-latest':     131_072,
  'mistral-small-latest':     131_072,

  // MiniMax
  'MiniMax-M2.7':             204_800,
  'minimax-m2.7':             204_800,

  // OpenRouter — free & popular models
  // Context windows from https://openrouter.ai/models (April 2026)
  'arcee-ai/trinity-large-preview':           131_072,
  'nousresearch/hermes-3-llama-3.1-405b':     131_072,
  'nousresearch/hermes-3-llama-3.2-3b':       131_072,
  'meta-llama/llama-3.1-8b-instruct':         131_072,
  'meta-llama/llama-3.1-70b-instruct':        131_072,
  'meta-llama/llama-3.2-1b-instruct':         131_072,
  'meta-llama/llama-3.2-3b-instruct':         131_072,
  'meta-llama/llama-3.3-70b-instruct':        131_072,
  'meta-llama/llama-4-maverick':              524_288,
  'meta-llama/llama-4-scout':                 524_288,
  'mistralai/mistral-7b-instruct':             32_768,
  'mistralai/mistral-nemo':                   128_000,
  'mistralai/mixtral-8x7b-instruct':           32_768,
  'google/gemma-3-4b-it':                     131_072,
  'google/gemma-3-12b-it':                    131_072,
  'google/gemma-3-27b-it':                    131_072,
  'qwen/qwen-2.5-7b-instruct':               131_072,
  'qwen/qwen-2.5-72b-instruct':              131_072,
  'qwen/qwen3-8b':                           131_072,
  'qwen/qwen3-30b-a3b':                      131_072,
  'deepseek/deepseek-r1':                    128_000,
  'deepseek/deepseek-chat-v3-0324':          128_000,
  'microsoft/phi-4':                          16_384,
  'microsoft/phi-4-reasoning-plus':           32_768,
  'tngtech/deepseek-r1t-chimera':            163_840,

  // Google (via OpenRouter)
  'google/gemini-1.5-pro':                    2_097_152,
  'google/gemini-1.5-flash-8b':               1_048_576,
  'google/gemini-1.5-flash':                  1_048_576,
  'google/gemini-2.0-flash-lite':             1_048_576,
  'google/gemini-2.0-flash-exp':              1_048_576,
  'google/gemini-2.0-flash':                  1_048_576,
  'google/gemini-2.5-pro':                    1_048_576,
  'google/gemini-2.5-flash':                  1_048_576,
  'google/gemini-3.1-flash-lite-preview':     1_048_576,
  'google/gemini-3.1-flash-preview':          1_048_576,
  'google/gemini-3.1-pro-preview':            1_048_576,

  // Google (native via generativelanguage.googleapis.com)
  // Context windows from https://ai.google.dev/gemini-api/docs/models (April 2026)
  // Prefix matching covers dated variants like gemini-2.5-pro-preview-05-06 etc.

  // Gemini 1.5 family
  'gemini-1.5-pro':         2_097_152,
  'gemini-1.5-flash-8b':    1_048_576,
  'gemini-1.5-flash':       1_048_576,

  // Gemini 2.0 family
  'gemini-2.0-flash-lite':  1_048_576,
  'gemini-2.0-flash-exp':   1_048_576,
  'gemini-2.0-flash-thinking-exp': 32_767,
  'gemini-2.0-flash':       1_048_576,
  'gemini-2.0-pro-exp':     2_097_152,

  // Gemini 2.5 family
  'gemini-2.5-pro':         1_048_576,
  'gemini-2.5-flash':       1_048_576,

  // Gemini 2.5 Flash Lite
  'gemini-2.5-flash-lite':         1_048_576,

  // Gemini 2.5 image generation
  'gemini-2.5-flash-image':           32_768,

  // Gemini 3.x family
  // prefix covers: gemini-3-flash-preview, gemini-3-pro-preview, gemini-3-pro-image-preview
  'gemini-3-flash':                1_048_576,
  'gemini-3-pro':                  1_048_576,
  'gemini-3.1-flash-lite-preview': 1_048_576,
  'gemini-3.1-flash-preview':      1_048_576,
  'gemini-3.1-pro-preview':        1_048_576,
  'gemini-3.1-flash':              1_048_576,
  'gemini-3.1-pro':                1_048_576,
  'gemini-3.1-flash-lite':         1_048_576,
  'gemini-3.1-flash-image':           32_768,

  // nano-banana-pro covers nano-banana-pro-preview
  'nano-banana-pro':               1_048_576,

  // Gemini Live API
  'gemini-2.5-flash-native-audio': 1_048_576,
  'gemini-3.1-flash-live':         1_048_576,

  // Gemini latest aliases
  'gemini-flash-latest':           1_048_576,
  'gemini-flash-lite-latest':      1_048_576,
  'gemini-pro-latest':             1_048_576,

  // Gemma 3 (native API — 128 K context per official specs)
  'gemma-3-1b-it':     131_072,
  'gemma-3-1b':        131_072,
  'gemma-3-2b-it':     131_072,
  'gemma-3-2b':        131_072,
  'gemma-3-4b-it':     131_072,
  'gemma-3-4b':        131_072,
  'gemma-3-12b-it':    131_072,
  'gemma-3-12b':       131_072,
  'gemma-3-27b-it':    131_072,
  'gemma-3-27b':       131_072,
  // Gemma 3n (nano — edge variants)
  'gemma-3n-e4b-it':   131_072,
  'gemma-3n-e2b-it':   131_072,

  // Gemma 4 (native API — "ilimitado" context)
  // gemma-4-26b covers gemma-4-26b-a4b-it via prefix
  'gemma-4-26b':       1_048_576,
  'gemma-4-31b-it':    1_048_576,
  'gemma-4-31b':       1_048_576,

  // Imagen 4 (image generation — prompt context)
  // prefix covers imagen-4.0-generate-001 etc.
  'imagen-4.0-generate':        32_768,
  'imagen-4.0-ultra-generate':  32_768,
  'imagen-4.0-fast-generate':   32_768,

  // Gemini Embedding models
  'gemini-embedding-001':   8_192,
  'gemini-embedding-2':     8_192,

  // Specialized / agentic models
  // gemini-robotics-er-1.5 covers -preview via prefix
  'gemini-robotics-er-1.5':         1_048_576,
  // gemini-2.5-computer-use-preview covers -10-2025 etc. via prefix
  'gemini-2.5-computer-use-preview': 1_048_576,
  // deep-research-pro-preview covers -12-2025 etc. via prefix
  'deep-research-pro-preview':       1_048_576,

  // Lyria (audio generation) — prefix covers -preview
  'lyria-3-clip':    32_768,
  'lyria-3-pro':     32_768,

  // Veo (video generation) — prefix covers -001 / -preview variants
  'veo-2.0-generate':           32_768,
  'veo-3.0-generate':           32_768,
  'veo-3.0-fast-generate':      32_768,
  'veo-3.1-generate':           32_768,
  'veo-3.1-fast-generate':      32_768,
  'veo-3.1-lite-generate':      32_768,

  // Gemini experimental / learnlm
  'gemini-exp':             1_048_576,
  'learnlm-2.0-flash-experimental': 1_048_576,

  // Ollama local models
  // Llama 3.1+ models support 128k context natively (Meta official specs).
  // Ollama defaults to num_ctx=8192 but users can configure higher values.
  'llama3.3:70b':             128_000,
  'llama3.1:8b':              128_000,
  'llama3.2:3b':              128_000,
  'qwen2.5-coder:32b':        32_768,
  'qwen2.5-coder:7b':         32_768,
  'deepseek-coder-v2:16b':    163_840,
  'deepseek-r1:14b':           65_536,
  'mistral:7b':                32_768,
  'phi4:14b':                  16_384,
  'gemma2:27b':                 8_192,
  'codellama:13b':              16_384,
  'llama3.2:1b':              128_000,
  'qwen3:8b':                 128_000,
  'codestral':                 32_768,
}

/**
 * Max output (completion) tokens per model.
 * This is separate from the context window (input limit).
 * Fixes: 400 error "max_tokens is too large" when default 32k exceeds model limit.
 */
const OPENAI_MAX_OUTPUT_TOKENS: Record<string, number> = {
  // GitHub Copilot — values from https://api.githubcopilot.com/models (2026-04-09)
  'github:copilot':                            16_384,
  // Claude
  'github:copilot:claude-sonnet-4':            16_000,
  'github:copilot:claude-haiku-4':             64_000,
  'github:copilot:claude-sonnet-4.5':          32_000,
  'github:copilot:claude-sonnet-4.6':          32_000,
  'github:copilot:claude-opus-4':              32_000,
  'github:copilot:claude-opus-4.6':            32_000,
  // GPT
  'github:copilot:gpt-3.5-turbo':              4_096,
  'github:copilot:gpt-4':                      4_096,
  'github:copilot:gpt-4-0125-preview':         4_096,
  'github:copilot:gpt-4-o-preview':            4_096,
  'github:copilot:gpt-4.1':                   16_384,
  'github:copilot:gpt-4o':                     4_096,
  'github:copilot:gpt-4o-2024-08-06':         16_384,
  'github:copilot:gpt-4o-2024-11-20':         16_384,
  'github:copilot:gpt-4o-mini':                4_096,
  'github:copilot:gpt-5-mini':                64_000,
  'github:copilot:gpt-5.1':                   64_000,
  'github:copilot:gpt-5.2':                  128_000,
  'github:copilot:gpt-5.2-codex':            128_000,
  'github:copilot:gpt-5.3-codex':            128_000,
  'github:copilot:gpt-5.4':                  128_000,
  'github:copilot:gpt-5.4-mini':             128_000,
  // Gemini
  'github:copilot:gemini-2.5-pro':            64_000,
  'github:copilot:gemini-3-flash-preview':    64_000,
  'github:copilot:gemini-3.1-pro-preview':    64_000,
  // Grok
  'github:copilot:grok-code-fast-1':          64_000,

  // NOTE: bare Claude model names omitted — see context windows comment above.

  // OpenAI
  'gpt-5.4':                 128_000,
  'gpt-5.4-mini':            128_000,
  'gpt-5.4-nano':            128_000,
  'gpt-4o':                   16_384,
  'gpt-4o-mini':              16_384,
  'gpt-4.1':                  32_768,
  'gpt-4.1-mini':             32_768,
  'gpt-4.1-nano':             32_768,
  'gpt-4-turbo':               4_096,
  'gpt-4':                     4_096,
  'o1':                       100_000,
  'o1-mini':                   65_536,
  'o1-preview':                32_768,
  'o1-pro':                   100_000,
  'o3':                       100_000,
  'o3-mini':                  100_000,
  'o4-mini':                  100_000,

  // DeepSeek
  'deepseek-chat':              8_192,
  'deepseek-reasoner':         32_768,

  // Groq
  'llama-3.3-70b-versatile':  32_768,
  'llama-3.1-8b-instant':      8_192,
  'mixtral-8x7b-32768':       32_768,

  // Mistral
  'mistral-large-latest':     32_768,
  'mistral-small-latest':     32_768,

  // MiniMax
  'MiniMax-M2.7':            131_072,
  'minimax-m2.7':            131_072,

  // OpenRouter — free & popular models
  'arcee-ai/trinity-large-preview':             4_096,
  'nousresearch/hermes-3-llama-3.1-405b':       4_096,
  'nousresearch/hermes-3-llama-3.2-3b':         4_096,
  'meta-llama/llama-3.1-8b-instruct':           4_096,
  'meta-llama/llama-3.1-70b-instruct':          4_096,
  'meta-llama/llama-3.2-1b-instruct':           4_096,
  'meta-llama/llama-3.2-3b-instruct':           4_096,
  'meta-llama/llama-3.3-70b-instruct':          4_096,
  'meta-llama/llama-4-maverick':                8_192,
  'meta-llama/llama-4-scout':                   8_192,
  'mistralai/mistral-7b-instruct':              4_096,
  'mistralai/mistral-nemo':                     8_192,
  'mistralai/mixtral-8x7b-instruct':            4_096,
  'google/gemma-3-4b-it':                       4_096,
  'google/gemma-3-12b-it':                      8_192,
  'google/gemma-3-27b-it':                      8_192,
  'qwen/qwen-2.5-7b-instruct':                  8_192,
  'qwen/qwen-2.5-72b-instruct':                 8_192,
  'qwen/qwen3-8b':                              8_192,
  'qwen/qwen3-30b-a3b':                         8_192,
  'deepseek/deepseek-r1':                       8_192,
  'deepseek/deepseek-chat-v3-0324':             8_192,
  'microsoft/phi-4':                            4_096,
  'microsoft/phi-4-reasoning-plus':            16_384,
  'tngtech/deepseek-r1t-chimera':               8_192,

  // Google (via OpenRouter)
  'google/gemini-1.5-pro':                    8_192,
  'google/gemini-1.5-flash-8b':               8_192,
  'google/gemini-1.5-flash':                  8_192,
  'google/gemini-2.0-flash-lite':             8_192,
  'google/gemini-2.0-flash-exp':              8_192,
  'google/gemini-2.0-flash':                  8_192,
  'google/gemini-2.5-pro':                   65_536,
  'google/gemini-2.5-flash':                 65_536,
  'google/gemini-3.1-flash-lite-preview':     8_192,
  'google/gemini-3.1-flash-preview':         32_768,
  'google/gemini-3.1-pro-preview':           32_768,

  // Google (native via generativelanguage.googleapis.com)

  // Gemini 1.5 family
  'gemini-1.5-pro':            8_192,
  'gemini-1.5-flash-8b':       8_192,
  'gemini-1.5-flash':          8_192,

  // Gemini 2.0 family
  'gemini-2.0-flash-lite':     8_192,
  'gemini-2.0-flash-exp':      8_192,
  'gemini-2.0-flash-thinking-exp': 8_192,
  'gemini-2.0-flash':          8_192,
  'gemini-2.0-pro-exp':        8_192,

  // Gemini 2.5 family
  'gemini-2.5-pro':           65_536,
  'gemini-2.5-flash':         65_536,

  // Gemini 2.5 Flash Lite
  'gemini-2.5-flash-lite':          65_536,

  // Gemini 2.5 image generation
  'gemini-2.5-flash-image':          8_192,

  // Gemini 3.x family
  'gemini-3-flash':                 32_768,
  'gemini-3-pro':                   32_768,
  'gemini-3.1-flash-lite-preview':   8_192,
  'gemini-3.1-flash-preview':       32_768,
  'gemini-3.1-pro-preview':         32_768,
  'gemini-3.1-flash':               32_768,
  'gemini-3.1-pro':                 32_768,
  'gemini-3.1-flash-lite':           8_192,
  'gemini-3.1-flash-image':          8_192,

  // nano-banana-pro
  'nano-banana-pro':                 8_192,

  // Gemini Live API
  'gemini-2.5-flash-native-audio':   8_192,
  'gemini-3.1-flash-live':           8_192,

  // Gemini latest aliases
  'gemini-flash-latest':            65_536,
  'gemini-flash-lite-latest':        8_192,
  'gemini-pro-latest':              65_536,

  // Gemma 3 (native API)
  'gemma-3-1b-it':      4_096,
  'gemma-3-1b':         4_096,
  'gemma-3-2b-it':      4_096,
  'gemma-3-2b':         4_096,
  'gemma-3-4b-it':      4_096,
  'gemma-3-4b':         4_096,
  'gemma-3-12b-it':     8_192,
  'gemma-3-12b':        8_192,
  'gemma-3-27b-it':     8_192,
  'gemma-3-27b':        8_192,
  // Gemma 3n (nano — edge variants)
  'gemma-3n-e4b-it':    8_192,
  'gemma-3n-e2b-it':    4_096,

  // Gemma 4 (native API)
  'gemma-4-26b':        8_192,
  'gemma-4-31b-it':    16_384,
  'gemma-4-31b':       16_384,

  // Imagen 4 (image generation)
  'imagen-4.0-generate':        8_192,
  'imagen-4.0-ultra-generate':  8_192,
  'imagen-4.0-fast-generate':   8_192,

  // Gemini Embedding models
  'gemini-embedding-001':   8_192,
  'gemini-embedding-2':     8_192,

  // Specialized / agentic models
  'gemini-robotics-er-1.5':          8_192,
  'gemini-2.5-computer-use-preview': 8_192,
  'deep-research-pro-preview':       8_192,

  // Lyria (audio generation)
  'lyria-3-clip':    8_192,
  'lyria-3-pro':     8_192,

  // Veo (video generation)
  'veo-2.0-generate':       8_192,
  'veo-3.0-generate':       8_192,
  'veo-3.0-fast-generate':  8_192,
  'veo-3.1-generate':       8_192,
  'veo-3.1-fast-generate':  8_192,
  'veo-3.1-lite-generate':  8_192,

  // Gemini experimental / learnlm
  'gemini-exp':              8_192,
  'learnlm-2.0-flash-experimental': 8_192,

  // Ollama local models (conservative safe defaults)
  'llama3.3:70b':               4_096,
  'llama3.1:8b':                4_096,
  'llama3.2:3b':                4_096,
  'qwen2.5-coder:32b':         8_192,
  'qwen2.5-coder:7b':          8_192,
  'deepseek-coder-v2:16b':     8_192,
  'deepseek-r1:14b':            8_192,
  'mistral:7b':                 4_096,
  'phi4:14b':                   4_096,
  'gemma2:27b':                 4_096,
  'codellama:13b':              4_096,
  'llama3.2:1b':                4_096,
  'qwen3:8b':                   8_192,
  'codestral':                   8_192,
}

function readExternalLimits(
  envVarName: LimitEnvVar,
  processEnv: NodeJS.ProcessEnv,
): Record<string, number> {
  const raw = processEnv[envVarName]
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, number] =>
            typeof entry[0] === 'string' &&
            typeof entry[1] === 'number' &&
            Number.isFinite(entry[1]) &&
            entry[1] > 0,
        )
        .map(([key, value]) => [key.trim(), value])
        .filter(([key]) => key.length > 0),
    )
  } catch {
    return {}
  }
}

function lookupExactByKey(
  entries: Record<string, number>,
  key: string | undefined,
): number | undefined {
  const normalizedKey = key?.trim()
  if (!normalizedKey) {
    return undefined
  }

  return entries[normalizedKey] ?? entries[normalizedKey.toLowerCase()]
}

function lookupPrefixByKey(
  entries: Record<string, number>,
  key: string | undefined,
): number | undefined {
  const normalizedKey = key?.trim()
  if (!normalizedKey) {
    return undefined
  }

  const prefixKey = Object.keys(entries)
    .sort((left, right) => right.length - left.length)
    .find(entryKey => normalizedKey.startsWith(entryKey))

  return prefixKey ? entries[prefixKey] : undefined
}

function getOpenAIBaseUrlHost(processEnv: NodeJS.ProcessEnv): string | undefined {
  const baseUrl =
    processEnv.OPENAI_BASE_URL?.trim() || processEnv.OPENAI_API_BASE?.trim()
  if (!baseUrl) {
    return undefined
  }

  try {
    return new URL(baseUrl).host
  } catch {
    return undefined
  }
}

function lookupByModel(
  entries: Record<string, number>,
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv,
): OpenAILimitOverrideMatches {
  const modelName = model?.trim() || processEnv.OPENAI_MODEL?.trim()
  const baseUrlHost = getOpenAIBaseUrlHost(processEnv)
  const hostQualifiedModel =
    baseUrlHost && modelName ? `${baseUrlHost}:${modelName}` : undefined

  return {
    exact:
      lookupExactByKey(entries, hostQualifiedModel) ??
      lookupExactByKey(entries, modelName),
    prefix:
      lookupPrefixByKey(entries, hostQualifiedModel) ??
      lookupPrefixByKey(entries, modelName),
  }
}

function lookupExternalLimitMatches(
  envVarName: LimitEnvVar,
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv,
): OpenAILimitOverrideMatches {
  return lookupByModel(
    readExternalLimits(envVarName, processEnv),
    model,
    processEnv,
  )
}

function lookupExternalLimit(
  envVarName: LimitEnvVar,
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv,
): number | undefined {
  const matches = lookupExternalLimitMatches(envVarName, model, processEnv)
  return matches.exact ?? matches.prefix
}

export function getOpenAIContextWindow(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): number | undefined {
  const external = lookupExternalLimit(
    'CLAUDE_CODE_OPENAI_CONTEXT_WINDOWS',
    model,
    processEnv,
  )
  if (external !== undefined) return external
  const matches = lookupByModel(OPENAI_CONTEXT_WINDOWS, model, processEnv)
  return matches.exact ?? matches.prefix
}

export function getOpenAIContextWindowMatches(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): OpenAILimitOverrideMatches {
  return lookupExternalLimitMatches(
    'CLAUDE_CODE_OPENAI_CONTEXT_WINDOWS',
    model,
    processEnv,
  )
}

export function getOpenAIMaxOutputTokens(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): number | undefined {
  const external = lookupExternalLimit(
    'CLAUDE_CODE_OPENAI_MAX_OUTPUT_TOKENS',
    model,
    processEnv,
  )
  if (external !== undefined) return external
  const matches = lookupByModel(OPENAI_MAX_OUTPUT_TOKENS, model, processEnv)
  return matches.exact ?? matches.prefix
}

export function getOpenAIMaxOutputTokenMatches(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): OpenAILimitOverrideMatches {
  return lookupExternalLimitMatches(
    'CLAUDE_CODE_OPENAI_MAX_OUTPUT_TOKENS',
    model,
    processEnv,
  )
}
