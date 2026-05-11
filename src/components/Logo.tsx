import React from 'react'
import { Box, Text } from 'ink'

export const Logo = () => (
  <Box flexDirection="column" alignItems="center" marginBottom={1}>
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
    <Text color="gray">The AI QA Engineer</Text>
    <Text color="gray" dimColor>qeist.in</Text>
  </Box>
)
