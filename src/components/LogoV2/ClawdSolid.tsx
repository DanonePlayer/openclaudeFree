import * as React from 'react'
import { Box, Text } from '../../ink.js'

/**
 * Solid block-character version of Clawd, matching the visual style from
 * Claude Code v2.1.x. Uses quadrant block elements (▛▜▝▘ etc.) for a
 * filled silhouette look instead of the line-drawing version in Clawd.tsx.
 *
 *   ▐▛███▜▌   ← head
 *   ▝▜█████▛▘  ← body/shoulders
 *     ▘▘ ▝▝   ← feet
 */

export type ClawdSolidPose = 'default' | 'arms-up' | 'think-left' | 'think-right'

// Each row is split so only the changing parts re-render.
// All poses are rendered with color="clawd_body" to pick up the theme color.
const ROWS: Record<ClawdSolidPose, [string, string, string]> = {
  // row1 (head), row2 (body), row3 (feet)
  'default': [
    ' ▐▛███▜▌',
    '▝▜█████▛▘',
    '  ▘▘ ▝▝',
  ],
  'arms-up': [
    '\\▛███▜/',
    '▐██████▌',
    '  ▘▘ ▝▝',
  ],
  'think-left': [
    ' ▐▙███▜▌',
    '▝▜█████▛▘',
    '  ▘▘ ▝▝',
  ],
  'think-right': [
    ' ▐▛███▟▌',
    '▝▜█████▛▘',
    '  ▘▘ ▝▝',
  ],
}

type Props = {
  pose?: ClawdSolidPose
}

export function ClawdSolid({ pose = 'default' }: Props): React.ReactNode {
  const [r1, r2, r3] = ROWS[pose]
  return (
    <Box flexDirection="column">
      <Text color="clawd_body">{r1}</Text>
      <Text color="clawd_body">{r2}</Text>
      <Text color="inactive">{r3}</Text>
    </Box>
  )
}
