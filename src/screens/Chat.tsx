import React, { useState, useEffect } from 'react'
import { Box, Text, useStdin } from 'ink'
import { PR, TestCase, sendChatMessage, getChatHistory } from '../lib/api.js'
import { MiniLogo } from '../components/MiniLogo.js'
import { PriorityBadge } from '../components/Badge.js'

type HistoryMessage = {
  id: string
  userEmail: string
  message: string
  response: string
  addedTestCases: TestCase[]
  createdAt: string
}

type Props = {
  pr: PR
  onBack: () => void
  onTestCasesAdded: (testCases: TestCase[]) => void
}

export const Chat = ({ pr, onBack, onTestCasesAdded }: Props) => {
  const [messages, setMessages] = useState<HistoryMessage[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'loading' | 'idle' | 'sending' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const { stdin, setRawMode } = useStdin()

  const totalAdded = messages.reduce((sum, m) => sum + (m.addedTestCases?.length || 0), 0)

  useEffect(() => {
    setRawMode?.(true)
    loadHistory()
    return () => setRawMode?.(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getChatHistory(pr.id)
      setMessages(data.messages || [])
      setStatus('idle')
    } catch {
      setStatus('idle')
    }
  }

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || status === 'sending') return

    setInput('')
    setStatus('sending')
    setErrorMsg('')

    const tempMsg: HistoryMessage = {
      id: Date.now().toString(),
      userEmail: 'you',
      message: msg,
      response: '',
      addedTestCases: [],
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempMsg])

    try {
      const result = await sendChatMessage(pr.id, msg)

      setMessages(prev => prev.map(m =>
        m.id === tempMsg.id
          ? { ...m, response: result.response, addedTestCases: result.newTestCases || [] }
          : m
      ))

      if (result.newTestCases?.length > 0) {
        onTestCasesAdded(result.newTestCases)
      }

      setStatus('idle')
    } catch (e: any) {
      setMessages(prev => prev.map(m =>
        m.id === tempMsg.id
          ? { ...m, response: 'Failed. Please try again.' }
          : m
      ))
      setErrorMsg(e.message || 'Failed to send')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  useEffect(() => {
    if (!stdin || status === 'loading' || status === 'sending') return

    const handleData = (chunk: Buffer | string) => {
      const key = typeof chunk === 'string' ? chunk : chunk.toString()

      if (key === '\r' || key === '\n') {
        if (input.trim() === 'exit' || input.trim() === 'quit') {
          onBack()
          return
        }
        if (input.trim()) {
          void handleSend()
        }
        return
      }

      if (key === '') {
        onBack()
        return
      }

      if (key === '' || key === '\b') {
        setInput(prev => prev.slice(0, -1))
        return
      }

      if (key.length === 1 && key.charCodeAt(0) >= 32) {
        setInput(prev => prev + key)
      }
    }

    stdin.on('data', handleData)
    return () => {
      stdin.removeListener('data', handleData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stdin, input, status])

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  return (
    <Box flexDirection="column" padding={1}>
      <MiniLogo />

      <Box flexDirection="column" marginBottom={1}>
        <Box gap={2}>
          <Text bold color="white">AI Chat</Text>
          <Text color="gray" dimColor>{pr.repo} #{pr.prNumber}</Text>
          {totalAdded > 0 && (
            <Text color="green" dimColor>+{totalAdded} test case{totalAdded !== 1 ? 's' : ''} added</Text>
          )}
        </Box>
        <Text color="gray" dimColor wrap="truncate-end">{pr.prTitle}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor color="gray">{'─'.repeat(50)}</Text>
      </Box>

      {status === 'loading' && (
        <Text color="gray">Loading chat history...</Text>
      )}

      {messages.length === 0 && status !== 'loading' && (
        <Box flexDirection="column" gap={1} marginBottom={1}>
          <Text color="gray" dimColor>No messages yet. Try asking:</Text>
          <Text color="gray" dimColor>{'· "Add test cases for mobile view"'}</Text>
          <Text color="gray" dimColor>{'· "Add edge cases for error handling"'}</Text>
          <Text color="gray" dimColor>{'· "Add accessibility test cases"'}</Text>
        </Box>
      )}

      {messages.map((msg, msgIdx) => (
        <Box key={msg.id} flexDirection="column" marginBottom={1}>
          <Box gap={1}>
            <Text color="green" bold>You:</Text>
            <Text color="white">{msg.message}</Text>
            <Text color="gray" dimColor>{timeAgo(msg.createdAt)}</Text>
          </Box>

          {msg.response ? (
            <Box flexDirection="column" paddingLeft={2}>
              <Box gap={1}>
                <Text color="cyan" bold>AI:</Text>
                <Text color="gray">{msg.response}</Text>
              </Box>

              {msg.addedTestCases?.map((tc, i) => (
                <Box key={i} flexDirection="column" paddingLeft={4} marginTop={0}>
                  <Box gap={1}>
                    <Text color="gray">{'☐'}</Text>
                    <Text bold color="white">{tc.area.toUpperCase()}</Text>
                    <PriorityBadge level={tc.priority} />
                    <Text color="cyan">[CHAT]</Text>
                  </Box>
                  {tc.why && (
                    <Box paddingLeft={2}>
                      <Text color="yellow" dimColor>Why: {tc.why}</Text>
                    </Box>
                  )}
                  <Box paddingLeft={2}>
                    <Text color="gray">{'→ '}{tc.step}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box paddingLeft={2} gap={1}>
              <Text color="cyan" bold>AI:</Text>
              <Text color="yellow">⠋ Generating...</Text>
            </Box>
          )}

          {msgIdx < messages.length - 1 && (
            <Box>
              <Text dimColor color="gray">{'─'.repeat(50)}</Text>
            </Box>
          )}
        </Box>
      ))}

      {/* Bordered input line */}
      <Box
        borderStyle="round"
        borderColor={status === 'sending' ? 'yellow' : 'green'}
        paddingLeft={1}
        paddingRight={1}
        marginTop={1}
      >
        <Box gap={1}>
          <Text color="green" bold>❯</Text>
          <Text color="white">{input}</Text>
          {status !== 'sending' && <Text color="green">█</Text>}
          {status === 'sending' && <Text color="yellow">⠋</Text>}
        </Box>
      </Box>

      <Box marginTop={1} borderStyle="round" borderColor="gray" paddingLeft={1} paddingRight={1}>
        <Text color="gray" dimColor>
          {'Enter send  ·  type '}
          <Text color="green">exit</Text>
          {' or Ctrl+C to go back'}
          {status === 'sending' && (
            <Text color="yellow"> · Sending...</Text>
          )}
          {status === 'error' && (
            <Text color="red"> · {errorMsg}</Text>
          )}
          {messages.length > 0 && (
            <Text color="gray"> · {messages.length} message{messages.length !== 1 ? 's' : ''}</Text>
          )}
        </Text>
      </Box>
    </Box>
  )
}
