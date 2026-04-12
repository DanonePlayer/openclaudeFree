import type { Command } from '../../commands.js'

const saveContext: Command = {
  type: 'local',
  name: 'saveContext',
  description:
    'Save the current conversation history to a .txt file in ~/openclaude-history/ with date and time.',
  supportsNonInteractive: false,
  argumentHint: '<optional filename>',
  load: () => import('./saveContext.js'),
}

export default saveContext
