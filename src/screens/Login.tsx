import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import { Logo } from '../components/Logo.js'
import { browserLogin } from '../lib/auth.js'
import { getConfig } from '../lib/config.js'

type Status = 'idle' | 'opening' | 'waiting' | 'success' | 'error'

type Props = {
  onSuccess: () => void
}

export const Login = ({ onSuccess }: Props) => {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [dots, setDots] = useState('.')
  const [email, setEmail] = useState('')

  // Animate dots only while waiting for browser auth
  useEffect(() => {
    if (status !== 'waiting') return
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    const login = async () => {
      try {
        setStatus('opening')
        await browserLogin(() => setStatus('waiting'))
        const { email: savedEmail } = getConfig()
        setEmail(savedEmail || '')
        setStatus('success')
        setTimeout(onSuccess, 1500)
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

      <Box marginTop={1} flexDirection="column" alignItems="center" gap={1}>
        {status === 'idle' && (
          <Text color="gray">Initializing...</Text>
        )}

        {status === 'opening' && (
          <Box flexDirection="column" alignItems="center" gap={1}>
            <Text color="green" bold>Opening browser to authenticate...</Text>
            <Text color="gray" dimColor>https://qeist.in/cli-auth</Text>
          </Box>
        )}

        {status === 'waiting' && (
          <Box flexDirection="column" alignItems="center" gap={1}>
            <Text color="green" bold>✓ Browser opened — sign in to continue</Text>
            <Text color="gray">Waiting for you to sign in{dots}</Text>
            <Text color="gray" dimColor>
              You can also visit qeist.in manually
            </Text>
          </Box>
        )}

        {status === 'success' && (
          <Box flexDirection="column" alignItems="center" gap={1}>
            <Text color="green" bold>
              ✅ Authenticated successfully{email ? ` as ${email}` : ''}!
            </Text>
            <Text color="gray">Loading your dashboard...</Text>
          </Box>
        )}

        {status === 'error' && (
          <Box flexDirection="column" alignItems="center" gap={1}>
            <Text color="red" bold>✗ {error}</Text>
            <Text color="gray" dimColor>Run qeist again to retry</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
