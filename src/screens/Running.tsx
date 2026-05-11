import React from 'react'
import { Box, Text, useInput } from 'ink'
import { Header } from '../components/Header.js'
import { TestCase } from '../lib/api.js'

type Props = {
  testCases: TestCase[]
  completedIndexes: number[]
  onDone: () => void
}

export const Running = ({
  testCases,
  completedIndexes,
  onDone
}: Props) => {
  useInput((input, key) => {
    if (input === 'b' || key.leftArrow || key.return) {
      onDone()
    }
    if (input === 'q') process.exit(0)
  })

  const doneCount = completedIndexes.length
  const total = testCases.length

  return (
    <Box flexDirection="column" padding={1}>
      <Header title="QA Results" subtitle="Synced to dashboard" />

      <Box flexDirection="column">
        {testCases.map((tc, i) => {
          const isDone = completedIndexes.includes(i)
          return (
            <Box key={i} gap={2}>
              <Text color={isDone ? 'green' : 'gray'}>
                {isDone ? '✅' : '○ '}
              </Text>
              <Text color={isDone ? 'white' : 'gray'} dimColor={!isDone}>
                {tc.area}
              </Text>
              <Text color={isDone ? 'green' : 'gray'} dimColor>
                {isDone ? 'completed' : 'pending'}
              </Text>
            </Box>
          )
        })}
      </Box>

      <Box marginTop={2} flexDirection="column" gap={1}>
        <Text color="green" bold>
          ✅ {doneCount}/{total} tests completed · results synced
        </Text>
        <Text color="gray" dimColor>
          View full report at qeist.in/dashboard
        </Text>
      </Box>

      {/* Bottom hint bar */}
      <Box
        borderStyle="round"
        borderColor="gray"
        paddingLeft={1}
        paddingRight={1}
        marginTop={1}
      >
        <Text color="gray" dimColor>
          <Text color="green" bold>b</Text>
          {' / '}
          <Text color="green" bold>←</Text>
          {' / '}
          <Text color="green" bold>Enter</Text>
          {' back to PR list  '}
          <Text color="green" bold>q</Text>
          {' quit'}
        </Text>
      </Box>
    </Box>
  )
}
