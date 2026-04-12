import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import type { LocalCommandCall } from '../../types/command.js'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function now(): { date: string; time: string; full: string } {
  const d = new Date()
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const time = `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
  const full = `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return { date, time, full }
}

function extractText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  const parts: string[] = []
  for (const block of content) {
    if (!block || typeof block !== 'object') continue
    const b = block as Record<string, unknown>
    if (b.type === 'text' && typeof b.text === 'string') {
      parts.push(b.text)
    } else if (b.type === 'tool_use') {
      const input = b.input ? JSON.stringify(b.input, null, 2) : ''
      parts.push(`[Tool: ${b.name ?? 'unknown'}]\n${input}`)
    } else if (b.type === 'tool_result') {
      const resultContent = Array.isArray(b.content)
        ? (b.content as Array<Record<string, unknown>>)
            .filter(c => c.type === 'text')
            .map(c => c.text as string)
            .join('\n')
        : typeof b.content === 'string'
          ? b.content
          : ''
      parts.push(`[Tool result]\n${resultContent}`)
    }
  }
  return parts.join('\n')
}

export const call: LocalCommandCall = async (args, context) => {
  const { messages } = context
  const { date, time, full } = now()

  // Determine save directory
  const saveDir = join(homedir(), 'openclaude-history')
  if (!existsSync(saveDir)) {
    mkdirSync(saveDir, { recursive: true })
  }

  // Determine filename
  const customName = args.trim()
  const filename = customName
    ? customName.endsWith('.txt')
      ? customName
      : `${customName}.txt`
    : `${date}_${time}.txt`
  const filePath = join(saveDir, filename)

  // Build .txt content
  const lines: string[] = [
    '='.repeat(60),
    '  OpenClaude — Conversa Salva',
    `  Data: ${full}`,
    '='.repeat(60),
    '',
  ]

  let turnCount = 0
  for (const msg of messages) {
    // Skip meta (system/internal) messages
    if (msg.isMeta) continue

    const role = msg.type === 'user' ? 'Você' : 'Assistente'
    const text = extractText(msg.message?.content)
    if (!text.trim()) continue

    turnCount++
    lines.push(`[${role}]`)
    lines.push(text.trim())
    lines.push('')
  }

  if (turnCount === 0) {
    return {
      type: 'text',
      value: 'Nenhuma mensagem para salvar ainda.',
    }
  }

  lines.push('='.repeat(60))
  lines.push(`  ${turnCount} mensagens salvas em ${full}`)
  lines.push('='.repeat(60))

  writeFileSync(filePath, lines.join('\n'), 'utf8')

  return {
    type: 'text',
    value: `Conversa salva em:\n  ${filePath}\n\n${turnCount} mensagens exportadas.`,
  }
}
