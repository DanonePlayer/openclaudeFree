# Extensão OpenClaude para VS Code

Um companheiro prático do VS Code para o OpenClaude com um **Centro de Controle** ciente do projeto, comportamento de lançamento no terminal previsível e acesso rápido a fluxos de trabalho úteis do OpenClaude.

## Funcionalidades

- **Status real do Centro de Controle** na Barra de Atividades:
  - se o comando `openclaude` configurado está instalado
  - o comando de lançamento sendo usado
  - se o shim de lançamento injeta `CLAUDE_CODE_USE_OPENAI=1`
  - a pasta do workspace atual
  - o diretório de trabalho que será usado nas sessões do terminal
  - se `.openclaude-profile.json` existe na raiz do workspace atual
  - um resumo conservador do provedor derivado do perfil do workspace ou flags de ambiente conhecidas
- **Comportamento de lançamento ciente do projeto**:
  - `Lançar OpenClaude` inicia a partir do workspace do editor ativo quando possível
  - usa a primeira pasta do workspace como fallback quando necessário
  - evita lançar a partir de um diretório padrão arbitrário quando um projeto está aberto
- **Ações práticas na barra lateral**:
  - Lançar OpenClaude
  - Lançar na Raiz do Workspace
  - Abrir Perfil do Workspace
  - Abrir Repositório
  - Abrir Guia de Configuração
  - Abrir Paleta de Comandos
- **Tema escuro integrado**: `OpenClaude Terminal Black`

## Requisitos

- VS Code `1.95+`
- `openclaude` disponível no PATH do terminal (`npm install -g github:DanonePlayer/openclaudeFree`)

## Comandos

- `OpenClaude: Abrir Centro de Controle`
- `OpenClaude: Lançar no Terminal`
- `OpenClaude: Lançar na Raiz do Workspace`
- `OpenClaude: Abrir Repositório`
- `OpenClaude: Abrir Guia de Configuração`
- `OpenClaude: Abrir Perfil do Workspace`

## Configurações

- `openclaude.launchCommand` (padrão: `openclaude`)
- `openclaude.terminalName` (padrão: `OpenClaude`)
- `openclaude.useOpenAIShim` (padrão: `false`)

`openclaude.useOpenAIShim` apenas injeta `CLAUDE_CODE_USE_OPENAI=1` nos terminais lançados pela extensão. Ele não adivinha nem configura um provedor por conta própria.

## Notas sobre Detecção de Status

- O status do provedor prefere o arquivo real `.openclaude-profile.json` do workspace quando presente.
- Se nenhum perfil salvo existir, a extensão usa como fallback as flags de ambiente conhecidas disponíveis para o host da extensão do VS Code.
- Se a fonte de verdade não estiver clara, a extensão exibe `desconhecido` em vez de adivinhar.

## Desenvolvimento

A partir desta pasta:

```bash
npm run test
npm run lint
```

Para empacotar (opcional):

```bash
npm run package
```
