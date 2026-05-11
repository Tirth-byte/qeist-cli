import React from 'react'
import { Box, Text } from 'ink'
import { getConfig } from '../lib/config.js'

export const MiniLogo = () => {
  const { email } = getConfig()
  return (
    <Box
      borderStyle="single"
      borderColor="green"
      paddingLeft={1}
      paddingRight={1}
      justifyContent="space-between"
      marginBottom={1}
    >
      <Box gap={1}>
        <Text color="green" bold>◆ QEIST</Text>
        <Text color="gray" dimColor>│</Text>
        <Text color="gray" dimColor>The AI QA Engineer</Text>
      </Box>
      {email ? (
        <Text color="gray" dimColor>{email}</Text>
      ) : null}
    </Box>
  )
}
