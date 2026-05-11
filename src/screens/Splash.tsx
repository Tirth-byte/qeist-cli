import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'

const VERSION = 'v1.0.0'
const DURATION_MS = 1500
const STEPS = 20
const STEP_MS = DURATION_MS / STEPS
const BAR_WIDTH = 30

type Props = {
  onDone: () => void
}

export const Splash = ({ onDone }: Props) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(STEPS, p + 1))
    }, STEP_MS)
    const timer = setTimeout(() => {
      clearInterval(interval)
      onDone()
    }, DURATION_MS)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filled = Math.round((progress / STEPS) * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  const pct = Math.round((progress / STEPS) * 100)

  return (
    <Box flexDirection="column" alignItems="center" padding={2}>
      <Text color="green" bold>
{`
  ██████╗ ███████╗██╗███████╗████████╗
 ██╔═══██╗██╔════╝██║██╔════╝╚══██╔══╝
 ██║   ██║█████╗  ██║███████╗   ██║
 ██║▄▄ ██║██╔══╝  ██║╚════██║   ██║
 ╚██████╔╝███████╗██║███████║   ██║
  ╚══▀▀═╝ ╚══════╝╚═╝╚══════╝   ╚═╝
`}
      </Text>
      <Text color="green">The AI QA Engineer</Text>
      <Box gap={2}>
        <Text color="gray" dimColor>qeist.in</Text>
        <Text color="gray" dimColor>{VERSION}</Text>
      </Box>
      <Box marginTop={1} gap={1}>
        <Text color="green">{bar}</Text>
        <Text color="gray" dimColor>{pct}%</Text>
      </Box>
    </Box>
  )
}
