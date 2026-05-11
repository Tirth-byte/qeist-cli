import React from 'react'
import { Box, Text } from 'ink'
import { TestCase as TC } from '../lib/api.js'
import { PriorityBadge } from './Badge.js'

type Props = {
  testCase: TC
  index: number
  isCompleted: boolean
  isSelected: boolean
}

export const TestCaseRow = ({
  testCase,
  index,
  isCompleted,
  isSelected
}: Props) => {
  const checkbox = isCompleted ? '✅' : '☐ '
  const dimmed = isCompleted

  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      paddingLeft={isSelected ? 0 : 1}
    >
      <Box gap={1}>
        {isSelected && <Text color="green">❯</Text>}
        <Text dimColor={dimmed}>{checkbox}</Text>
        <Text bold dimColor={dimmed} color={isSelected ? 'white' : undefined}>
          {index + 1}. {testCase.area.toUpperCase()}
        </Text>
        <PriorityBadge level={testCase.priority} />
      </Box>
      {testCase.why && (
        <Box paddingLeft={4}>
          {/* Bug fix: dimColor was hardcoded true — should match completed state */}
          <Text color="yellow" dimColor={dimmed} italic>
            Why: {testCase.why}
          </Text>
        </Box>
      )}
      <Box paddingLeft={4}>
        <Text dimColor={dimmed} color="gray">
          → {testCase.step}
        </Text>
      </Box>
      <Box paddingLeft={4}>
        {/* Bug fix: dimColor was hardcoded true — should match completed state */}
        <Text dimColor={dimmed} color="gray">
          Expected: {testCase.expected}
        </Text>
      </Box>
    </Box>
  )
}
