import React, { useEffect } from 'react'
import { Box, Text } from 'ink'
import { clearConfig } from '../lib/config.js'

export const Logout = () => {
  useEffect(() => {
    clearConfig()
    setTimeout(() => process.exit(0), 500)
  }, [])

  return (
    <Box padding={1}>
      <Text color="green">✅ Logged out successfully</Text>
    </Box>
  )
}
