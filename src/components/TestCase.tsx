import React from 'react'
import { Box, Text } from 'ink'
import { TestCase as TC } from '../lib/api.js'
import { PriorityBadge } from './Badge.js'

type Props = {
  testCase: TC
  index: number
  isCompleted: boolean
  isSelected: boolean
  deleteMode?: boolean
}

export const TestCaseRow = ({
  testCase,
  index,
  isCompleted,
  isSelected,
  deleteMode = false,
}: Props) => {
  const isDeleteTarget = deleteMode && isSelected
  const checkbox = isCompleted ? '✅' : '☐ '
  const dimmed = isCompleted && !isDeleteTarget
  const sourceIcon = testCase.source === 'chat' ? '◆' : '◇'

  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      paddingLeft={isSelected ? 0 : 1}
      borderStyle={isDeleteTarget ? 'round' : undefined}
      borderColor={isDeleteTarget ? 'red' : undefined}
    >
      <Box gap={1}>
        {isSelected && (
          <Text color={isDeleteTarget ? 'red' : 'green'}>
            {isDeleteTarget ? '✗' : '❯'}
          </Text>
        )}
        <Text dimColor={dimmed}>{checkbox}</Text>
        <Text
          bold
          dimColor={dimmed}
          color={isDeleteTarget ? 'red' : isSelected ? 'white' : undefined}
        >
          {index + 1}. {testCase.area.toUpperCase()}
        </Text>
        <PriorityBadge level={testCase.priority} />
        <Text color="gray" dimColor>{sourceIcon}</Text>
        {testCase.source === 'chat' && (
          <Text color="cyan" dimColor>[CHAT]</Text>
        )}
      </Box>

      {testCase.why && (
        <Box paddingLeft={4}>
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
        <Text dimColor={dimmed} color="gray">
          Expected: {testCase.expected}
        </Text>
      </Box>
    </Box>
  )
}
