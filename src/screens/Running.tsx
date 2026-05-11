import React from 'react'
import { Box, Text, useInput } from 'ink'
import { MiniLogo } from '../components/MiniLogo.js'
import { NavBar } from '../components/NavBar.js'
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
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <Box flexDirection="column" padding={1}>
      <MiniLogo />

      <Box gap={2} marginBottom={1}>
        <Text bold color="white">QA Results</Text>
        <Text color="gray" dimColor>synced to dashboard</Text>
      </Box>

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
          ✅ {doneCount}/{total} tests completed ({pct}%) · results synced
        </Text>
        <Text color="gray" dimColor>
          View full report at qeist.in/dashboard
        </Text>
      </Box>

      <NavBar
        items={[
          { key: 'b', label: 'back to PRs' },
          { key: '←', label: 'back' },
          { key: 'Enter', label: 'back' },
          { key: 'q', label: 'quit' },
        ]}
      />
    </Box>
  )
}
