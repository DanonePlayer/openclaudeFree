import type { Command } from '../../commands.js'

const character: Command = {
  type: 'local',
  name: 'character',
  description:
    'Choose the character shown next to the spinner. Options: clawd, dragon, none.',
  supportsNonInteractive: false,
  argumentHint: '<clawd|dragon|none>',
  load: () => import('./character.js'),
}

export default character
