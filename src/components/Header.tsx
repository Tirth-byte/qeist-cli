import React from 'react'
import { Box, Text } from 'ink'
import { MiniLogo } from './MiniLogo.js'

type Props = {
  title: string
  subtitle?: string
}

export const Header = ({ title, subtitle }: Props) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <MiniLogo />
      <Text dimColor>{'─'.repeat(50)}</Text>
      <Text bold color="white">{title}</Text>
      {subtitle && (
        <Text color="gray" dimColor>{subtitle}</Text>
      )}
      <Text dimColor>{'─'.repeat(50)}</Text>
    </Box>
  )
}
