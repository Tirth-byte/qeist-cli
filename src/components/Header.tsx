import React from 'react'
import { Box, Text } from 'ink'
import { getConfig } from '../lib/config.js'

type Props = {
  title: string
  subtitle?: string
}

export const Header = ({ title, subtitle }: Props) => {
  const { email } = getConfig()
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box justifyContent="space-between">
        <Text color="green" bold>QEIST</Text>
        <Text color="gray" dimColor>{email}</Text>
      </Box>
      <Box>
        <Text dimColor>{'─'.repeat(50)}</Text>
      </Box>
      <Text bold color="white">{title}</Text>
      {subtitle && (
        <Text color="gray" dimColor>{subtitle}</Text>
      )}
      <Box marginTop={0}>
        <Text dimColor>{'─'.repeat(50)}</Text>
      </Box>
    </Box>
  )
}
