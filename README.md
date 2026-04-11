# OpenClaude

OpenClaude é uma CLI de agente de código open-source para provedores de modelos locais e na nuvem.

Use APIs compatíveis com OpenAI, Gemini, GitHub Models, Codex, Ollama, Atomic Chat e outros backends suportados, mantendo um fluxo de trabalho único no terminal: prompts, ferramentas, agentes, MCP, comandos slash e saída em streaming.

[![PR Checks](https://github.com/Gitlawb/openclaude/actions/workflows/pr-checks.yml/badge.svg?branch=main)](https://github.com/Gitlawb/openclaude/actions/workflows/pr-checks.yml)
[![Release](https://img.shields.io/github/v/tag/Gitlawb/openclaude?label=release&color=0ea5e9)](https://github.com/Gitlawb/openclaude/tags)
[![Discussions](https://img.shields.io/badge/discussions-open-7c3aed)](https://github.com/Gitlawb/openclaude/discussions)
[![Security Policy](https://img.shields.io/badge/security-policy-0f766e)](SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-2563eb)](LICENSE)

[Início Rápido](#início-rápido) | [Guias de Configuração](#guias-de-configuração) | [Provedores](#provedores-suportados) | [Build Local](#build-a-partir-do-código-fonte-e-desenvolvimento-local) | [Extensão VS Code](#extensão-vs-code) | [Comunidade](#comunidade)

## Por que OpenClaude

- Use uma única CLI para APIs na nuvem e backends de modelos locais
- Salve perfis de provedores dentro do app com `/provider`
- Funciona com OpenAI, Gemini, GitHub Models, Codex, Ollama, Atomic Chat e outros provedores suportados
- Mantenha fluxos de trabalho de agente de código em um só lugar: bash, ferramentas de arquivo, grep, glob, agentes, tarefas, MCP e ferramentas web
- Use a extensão VS Code incluída para integração de lançamento e suporte a temas

## Início Rápido

### Instalar

```bash
npm install -g github:DanonePlayer/openclaudeFree
```

Se após a instalação aparecer `ripgrep not found`, instale o ripgrep no sistema e confirme que `rg --version` funciona no terminal antes de iniciar o OpenClaude.

### Iniciar

```bash
openclaude
```

Dentro do OpenClaude:

- rode `/provider` para configuração guiada de provedores e perfis salvos
- rode `/onboard-github` para integração com GitHub Models

### Configuração rápida com OpenAI

macOS / Linux:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-sua-chave-aqui
export OPENAI_MODEL=gpt-4o

openclaude
```

Windows PowerShell:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-sua-chave-aqui"
$env:OPENAI_MODEL="gpt-4o"

openclaude
```

### Configuração rápida com Ollama local

macOS / Linux:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=qwen2.5-coder:7b

openclaude
```

Windows PowerShell:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:11434/v1"
$env:OPENAI_MODEL="qwen2.5-coder:7b"

openclaude
```

## Guias de Configuração

Guias para iniciantes:

- [Configuração para Não-Técnicos](docs/non-technical-setup.md)
- [Início Rápido no Windows](docs/quick-start-windows.md)
- [Início Rápido no macOS / Linux](docs/quick-start-mac-linux.md)

Guias avançados e build a partir do código:

- [Configuração Avançada](docs/advanced-setup.md)
- [Instalação no Android](ANDROID_INSTALL.md)

## Provedores Suportados

| Provedor | Forma de Configuração | Observações |
| --- | --- | --- |
| Compatível com OpenAI | `/provider` ou variáveis de ambiente | Funciona com OpenAI, OpenRouter, DeepSeek, Groq, Mistral, LM Studio e outros servidores `/v1` compatíveis |
| Gemini | `/provider` ou variáveis de ambiente | Suporta chave de API, token de acesso ou fluxo ADC local |
| GitHub Models | `/onboard-github` | Integração interativa com credenciais salvas |
| Codex | `/provider` | Usa credenciais Codex existentes quando disponíveis |
| Ollama | `/provider` ou variáveis de ambiente | Inferência local sem necessidade de chave de API |
| Atomic Chat | configuração avançada | Backend local para Apple Silicon |
| Bedrock / Vertex / Foundry | variáveis de ambiente | Integrações adicionais para ambientes suportados |

## O que Funciona

- **Fluxos de trabalho com ferramentas**: Bash, leitura/escrita/edição de arquivos, grep, glob, agentes, tarefas, MCP e comandos slash
- **Respostas em streaming**: Saída de tokens em tempo real e progresso das ferramentas
- **Chamada de ferramentas**: Loops multi-etapa com chamadas ao modelo, execução de ferramentas e respostas de acompanhamento
- **Imagens**: Entradas de imagem por URL e base64 para provedores que suportam visão
- **Perfis de provedores**: Configuração guiada e suporte a `.openclaude-profile.json` salvo
- **Backends locais e remotos**: APIs na nuvem, servidores locais e inferência local em Apple Silicon

## Notas sobre Provedores

O OpenClaude suporta múltiplos provedores, mas o comportamento não é idêntico entre todos.

- Funcionalidades específicas da Anthropic podem não existir em outros provedores
- A qualidade das ferramentas depende muito do modelo selecionado
- Modelos locais menores podem ter dificuldades com fluxos longos de múltiplas etapas
- Alguns provedores impõem limites de saída menores que os padrões da CLI, e o OpenClaude se adapta quando possível

Para melhores resultados, use modelos com bom suporte a chamadas de ferramentas/funções.

## Roteamento de Agentes

O OpenClaude pode rotear diferentes agentes para diferentes modelos através de configurações. Útil para otimização de custos ou divisão de trabalho por capacidade do modelo.

Adicione ao `~/.claude/settings.json`:

```json
{
  "agentModels": {
    "deepseek-chat": {
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-sua-chave"
    },
    "gpt-4o": {
      "base_url": "https://api.openai.com/v1",
      "api_key": "sk-sua-chave"
    }
  },
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "general-purpose": "gpt-4o",
    "frontend-dev": "deepseek-chat",
    "default": "gpt-4o"
  }
}
```

Quando nenhuma correspondência de roteamento é encontrada, o provedor global é usado como fallback.

> **Atenção:** Os valores de `api_key` no `settings.json` são armazenados em texto simples. Mantenha esse arquivo privado e não o envie para controle de versão.

## Busca e Acesso à Web

Por padrão, o `WebSearch` funciona em modelos não-Anthropic usando o DuckDuckGo. Isso dá ao GPT-4o, DeepSeek, Gemini, Ollama e outros provedores compatíveis com OpenAI um caminho gratuito de busca na web.

> **Atenção:** O fallback do DuckDuckGo funciona raspando resultados de busca e pode ser limitado por taxa, bloqueado ou sujeito aos Termos de Serviço do DuckDuckGo. Para uma opção mais confiável, configure o Firecrawl.

Para backends nativos da Anthropic e respostas Codex, o OpenClaude mantém o comportamento nativo de busca web do provedor.

O `WebFetch` funciona, mas seu caminho básico de HTTP + HTML para markdown pode falhar em sites renderizados por JavaScript ou que bloqueiam requisições HTTP simples.

Configure uma chave de API do [Firecrawl](https://firecrawl.dev) para busca/acesso com Firecrawl:

```bash
export FIRECRAWL_API_KEY=sua-chave-aqui
```

Com Firecrawl ativado:

- `WebSearch` pode usar a API de busca do Firecrawl enquanto o DuckDuckGo permanece o caminho gratuito padrão para modelos não-Claude
- `WebFetch` usa o endpoint de raspagem do Firecrawl em vez de HTTP puro, lidando corretamente com páginas renderizadas por JS

O plano gratuito em [firecrawl.dev](https://firecrawl.dev) inclui 500 créditos. A chave é opcional.

---

## Servidor gRPC Headless

O OpenClaude pode ser executado como um serviço gRPC headless, permitindo integrar suas capacidades de agente (ferramentas, bash, edição de arquivos) em outras aplicações, pipelines CI/CD ou interfaces personalizadas. O servidor usa streaming bidirecional para enviar chunks de texto em tempo real, chamadas de ferramentas e solicitar permissões para comandos sensíveis.

### 1. Iniciar o Servidor gRPC

Inicie o motor principal como serviço gRPC em `localhost:50051`:

```bash
npm run dev:grpc
```

#### Configuração

| Variável | Padrão | Descrição |
|-----------|-------------|------------------------------------------------|
| `GRPC_PORT` | `50051` | Porta em que o servidor gRPC escuta |
| `GRPC_HOST` | `localhost` | Endereço de bind. Use `0.0.0.0` para expor em todas as interfaces (não recomendado sem autenticação) |

### 2. Executar o Cliente CLI de Teste

Fornecemos um cliente CLI leve que se comunica exclusivamente via gRPC. Funciona como a CLI interativa principal, renderizando cores, transmitindo tokens e solicitando permissões de ferramentas (s/n) via evento `action_required` do gRPC.

Em outro terminal, execute:

```bash
npm run dev:grpc:cli
```

*Nota: As definições gRPC estão em `src/proto/openclaude.proto`. Use esse arquivo para gerar clientes em Python, Go, Rust ou qualquer outra linguagem.*

---

## Build a Partir do Código Fonte e Desenvolvimento Local

```bash
bun install
bun run build
node dist/cli.mjs
```

Comandos úteis:

- `bun run dev`
- `bun test`
- `bun run test:coverage`
- `bun run security:pr-scan -- --base origin/main`
- `bun run smoke`
- `bun run doctor:runtime`
- `bun run verify:privacy`
- execuções focadas com `bun test ...` para as áreas que você modificou

## Testes e Cobertura

O OpenClaude usa o executor de testes integrado do Bun para testes unitários.

Execute todos os testes unitários:

```bash
bun test
```

Gere cobertura de testes unitários:

```bash
bun run test:coverage
```

Abra o relatório visual de cobertura:

```bash
open coverage/index.html
```

Se você já tem `coverage/lcov.info` e quer apenas reconstruir a interface:

```bash
bun run test:coverage:ui
```

Use execuções focadas quando modificar apenas uma área:

- `bun run test:provider`
- `bun run test:provider-recommendation`
- `bun test caminho/para/arquivo.test.ts`

Validação recomendada antes de abrir um PR:

- `bun run build`
- `bun run smoke`
- `bun run test:coverage` para cobertura mais ampla quando sua mudança afeta runtime compartilhado ou lógica de provedor
- execuções focadas com `bun test ...` para os arquivos e fluxos que você alterou

A saída de cobertura é gravada em `coverage/lcov.info`, e o OpenClaude também gera um mapa de calor no estilo de atividade git em `coverage/index.html`.

## Estrutura do Repositório

- `src/` - CLI/runtime principal
- `scripts/` - scripts de build, verificação e manutenção
- `docs/` - documentação de configuração, contribuição e projeto
- `python/` - helpers Python independentes e seus testes
- `vscode-extension/openclaude-vscode/` - extensão VS Code
- `.github/` - automação do repositório, templates e configuração de CI
- `bin/` - entrypoints do lançador da CLI

## Extensão VS Code

O repositório inclui uma extensão VS Code em [`vscode-extension/openclaude-vscode`](vscode-extension/openclaude-vscode) para integração de lançamento do OpenClaude, interface de centro de controle com suporte a provedores e suporte a temas.

## Segurança

Se você acredita ter encontrado um problema de segurança, veja [SECURITY.md](SECURITY.md).

## Comunidade

- Use as [Discussões do GitHub](https://github.com/Gitlawb/openclaude/discussions) para perguntas, ideias e conversas da comunidade
- Use as [Issues do GitHub](https://github.com/Gitlawb/openclaude/issues) para bugs confirmados e trabalho de funcionalidades acionáveis

## Contribuindo

Contribuições são bem-vindas.

Para mudanças maiores, abra uma issue primeiro para que o escopo fique claro antes da implementação. Comandos úteis de validação:

- `bun run build`
- `bun run test:coverage`
- `bun run smoke`
- execuções focadas com `bun test ...` para áreas modificadas

## Aviso Legal

O OpenClaude é um projeto independente da comunidade e não é afiliado, endossado ou patrocinado pela Anthropic.

O OpenClaude originou-se do codebase do Claude Code e foi substancialmente modificado para suportar múltiplos provedores e uso aberto. "Claude" e "Claude Code" são marcas registradas da Anthropic PBC. Veja [LICENSE](LICENSE) para detalhes.

## Licença

Veja [LICENSE](LICENSE).
