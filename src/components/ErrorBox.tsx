import React from 'react'
import { Box, Text } from 'ink'

type Props = {
  message: string
  hint?: string
}

export const ErrorBox = ({ message, hint }: Props) => (
  <Box
    flexDirection="column"
    borderStyle="round"
    borderColor="red"
    paddingLeft={1}
    paddingRight={1}
    marginTop={1}
  >
    <Text color="red" bold>✗ {message}</Text>
    {hint && (
      <Text color="gray" dimColor>{hint}</Text>
    )}
  </Box>
)
