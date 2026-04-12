import * as React from 'react'
import { Box, Text } from '../../ink.js'

/**
 * Solid block-character dragon mascot for the spinner.
 * Same style as ClawdSolid — uses quadrant block elements for a filled
 * silhouette. Three rows, ~9 chars wide.
 *
 * default (wings folded):
 *   ▗▛███▜▖
 *  ▐▟█████▙▌
 *   ▝▘▄▖▘▝
 *
 * wings-up (sending / tool-use):
 *   ▘▛▀███▀▜▝
 *   ▐▟█████▙▌
 *   ▝▘▄▖▘▝
 *
 * look-left (thinking A):
 *   ▐▙███▜▖
 *  ▝▟█████▙▌
 *   ▝▘▄▖▘▝
 *
 * look-right (thinking B):
 *   ▗▛███▟▌
 *  ▐▙█████▟▘
 *   ▝▘▄▖▘▝
 */

export type DragonPose = 'default' | 'wings-up' | 'look-left' | 'look-right'

const ROWS: Record<DragonPose, [string, string, string]> = {
  'default': [
    ' ▗▛███▜▖',
    '▐▟█████▙▌',
    ' ▝▘▄▖▘▝ ',
  ],
  'wings-up': [
    '▘▛▀███▀▜▝',
    '▐▟█████▙▌',
    ' ▝▘▄▖▘▝ ',
  ],
  'look-left': [
    '▐▙███▜▖  ',
    '▝▟█████▙▌',
    ' ▝▘▄▖▘▝ ',
  ],
  'look-right': [
    '  ▗▛███▟▌',
    '▐▙█████▟▘',
    ' ▝▘▄▖▘▝ ',
  ],
}

type Props = {
  pose?: DragonPose
}

export function DragonSolid({ pose = 'default' }: Props): React.ReactNode {
  const [r1, r2, r3] = ROWS[pose]
  return (
    <Box flexDirection="column">
      <Text color="clawd_body">{r1}</Text>
      <Text color="clawd_body">{r2}</Text>
      <Text color="inactive">{r3}</Text>
    </Box>
  )
}
