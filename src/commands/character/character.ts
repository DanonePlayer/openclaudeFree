import { updateSettingsForSource } from '../../utils/settings/settings.js'
import { settingsChangeDetector } from '../../utils/settings/changeDetector.js'
import type { LocalCommandCall } from '../../types/command.js'

const VALID = ['clawd', 'dragon', 'none'] as const
type CharacterOption = (typeof VALID)[number]

const LABELS: Record<CharacterOption, string> = {
  clawd:  'Clawd  — personagem sólido padrão',
  dragon: 'Dragon — dragão animado',
  none:   'None   — sem personagem',
}

export const call: LocalCommandCall = async (args) => {
  const choice = args.trim().toLowerCase() as CharacterOption

  if (!choice) {
    const list = VALID.map(v => `  ${v.padEnd(6)} — ${LABELS[v]}`).join('\n')
    return {
      type: 'text',
      value: `Escolha um personagem para o spinner:\n\n${list}\n\nUso: /character <nome>`,
    }
  }

  if (!VALID.includes(choice)) {
    return {
      type: 'text',
      value: `Opção inválida: "${choice}". Use: ${VALID.join(', ')}`,
    }
  }

  const result = updateSettingsForSource('userSettings', {
    spinnerCharacter: choice,
  })

  if (result.error) {
    return {
      type: 'text',
      value: `Erro ao salvar: ${result.error}`,
    }
  }

  // Notifica o detector para que o AppState seja atualizado imediatamente
  settingsChangeDetector.notifyChange('userSettings')

  return {
    type: 'text',
    value: `Personagem definido: ${choice} (${LABELS[choice]})`,
  }
}
