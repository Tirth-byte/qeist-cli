import React from 'react'
import { Box, Text } from 'ink'

type Props = {
  done: number
  total: number
  width?: number
}

export const ProgressBar = ({
  done, total, width = 30
}: Props) => {
  const pct = total > 0
    ? Math.round((done / total) * 100) : 0
  const filled = Math.round((done / total) * width) || 0
  const empty = width - filled

  return (
    <Box gap={1}>
      <Text color="green">{'█'.repeat(filled)}</Text>
      <Text color="gray" dimColor>{'░'.repeat(empty)}</Text>
      <Text color="gray"> {done}/{total}</Text>
      <Text color="gray" dimColor>({pct}%)</Text>
    </Box>
  )
}
