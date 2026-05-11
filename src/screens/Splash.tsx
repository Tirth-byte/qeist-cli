import React, { useEffect } from 'react'
import { Box, Text } from 'ink'

type Props = {
  onDone: () => void
}

export const Splash = ({ onDone }: Props) => {
  useEffect(() => {
    setTimeout(onDone, 1500)
  }, [])

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
      <Text color="gray" dimColor>qeist.in</Text>
      <Box marginTop={1}>
        <Text color="gray" dimColor>Loading...</Text>
      </Box>
    </Box>
  )
}
