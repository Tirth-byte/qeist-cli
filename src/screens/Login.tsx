import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import { Logo } from '../components/Logo.js'
import { browserLogin } from '../lib/auth.js'

type Props = {
  onSuccess: () => void
}

export const Login = ({ onSuccess }: Props) => {
  const [status, setStatus] = useState<
    'idle' | 'opening' | 'waiting' | 'success' | 'error'
  >('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const login = async () => {
      try {
        setStatus('opening')
        await browserLogin(() => setStatus('waiting'))
        setStatus('success')
        setTimeout(onSuccess, 1000)
      } catch (e: any) {
        setStatus('error')
        setError(e.message)
      }
    }
    login()
  }, [])

  return (
    <Box flexDirection="column" padding={1}>
      <Logo />
      <Box marginTop={1} flexDirection="column" alignItems="center">
        {status === 'idle' && (
          <Text color="gray">Initializing...</Text>
        )}
        {status === 'opening' && (
          <Text color="green">
            Opening browser to authenticate...
          </Text>
        )}
        {status === 'waiting' && (
          <Box flexDirection="column" alignItems="center" gap={1}>
            <Text color="green">
              ✓ Browser opened
            </Text>
            <Text color="gray">
              Waiting for you to sign in...
            </Text>
            <Text dimColor color="gray">
              Already signed in? The terminal will update automatically.
            </Text>
          </Box>
        )}
        {status === 'success' && (
          <Text color="green" bold>
            ✅ Logged in successfully!
          </Text>
        )}
        {status === 'error' && (
          <Box flexDirection="column" alignItems="center">
            <Text color="red">✗ {error}</Text>
            <Text color="gray" dimColor>
              Run qeist login to try again
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
