import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import { Header } from '../components/Header.js'
import { RiskBadge } from '../components/Badge.js'
import { ProgressBar } from '../components/ProgressBar.js'
import { TestCaseRow } from '../components/TestCase.js'
import {
  Checklist as CL,
  PR,
  updateProgress
} from '../lib/api.js'

type Props = {
  pr: PR
  checklist: CL | null
  onBack: () => void
  onApprove: (completedIndexes: number[]) => void
  onChat: () => void
}

export const ChecklistScreen = ({
  pr, checklist, onBack, onApprove, onChat
}: Props) => {
  const [selected, setSelected] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  // Sync completed state when checklist loads async after mount
  useEffect(() => {
    if (checklist) {
      setCompleted(checklist.completedIndexes || [])
    }
  }, [checklist])

  const total = checklist?.testCases?.length || 0
  const done = completed.length

  useInput((input, key) => {
    // Guard all input when checklist hasn't loaded yet
    if (!checklist) {
      if (key.leftArrow || input === 'b') onBack()
      if (input === 'q') process.exit(0)
      return
    }

    if (key.upArrow) {
      setSelected(s => Math.max(0, s - 1))
    }
    if (key.downArrow) {
      setSelected(s => Math.min(total - 1, s + 1))
    }
    if (input === ' ' || key.return) {
      toggleTest(selected)
    }
    if (key.leftArrow || input === 'b') {
      onBack()
    }
    if (input === 'a') {
      approveAll()
    }
    if (input === 'c') {
      onChat()
    }
    if (input === 'q') process.exit(0)

    const num = parseInt(input)
    if (!isNaN(num) && num >= 1 && num <= total) {
      toggleTest(num - 1)
    }
  })

  const toggleTest = async (index: number) => {
    const next = completed.includes(index)
      ? completed.filter(i => i !== index)
      : [...completed, index]
    setCompleted(next)
    setSaving(true)
    try {
      await updateProgress(pr.id, next)
    } finally {
      setSaving(false)
    }
  }

  const approveAll = async () => {
    const all = Array.from({ length: total }, (_, i) => i)
    setCompleted(all)
    await updateProgress(pr.id, all)
    setTimeout(() => onApprove(all), 500)
  }

  // Analyzing state — checklist not yet loaded
  if (!checklist) {
    return (
      <Box flexDirection="column" padding={1}>
        <Header
          title={pr.prTitle}
          subtitle={`${pr.repo} #${pr.prNumber}`}
        />
        <Box flexDirection="column" gap={1} alignItems="center" marginTop={2}>
          <Text color="yellow" bold>⠿ AI is analyzing your PR...</Text>
          <Text color="gray" dimColor>This usually takes 20–30 seconds.</Text>
        </Box>
        <Box
          borderStyle="round"
          borderColor="gray"
          paddingLeft={1}
          paddingRight={1}
          marginTop={2}
        >
          <Text color="gray" dimColor>
            <Text color="green" bold>b</Text>
            {' / '}
            <Text color="green" bold>←</Text>
            {' back to PR list  '}
            <Text color="green" bold>q</Text>
            {' quit'}
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header
        title={pr.prTitle}
        subtitle={`${pr.repo} #${pr.prNumber}`}
      />

      {/* Risk + save indicator */}
      <Box gap={2} marginBottom={1}>
        <Text bold>Risk:</Text>
        <RiskBadge level={pr.riskLevel} />
        {saving && <Text color="gray" dimColor>  saving...</Text>}
      </Box>

      {/* AI summary */}
      <Box
        flexDirection="column"
        marginBottom={1}
        borderStyle="round"
        borderColor="gray"
        paddingLeft={1}
        paddingRight={1}
        paddingTop={0}
        paddingBottom={0}
      >
        <Text color="green" bold>AI SUMMARY</Text>
        <Text color="gray" wrap="wrap">{checklist.summary}</Text>
      </Box>

      {/* Regression areas */}
      {checklist.regressionAreas.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="yellow" bold>⚠ REGRESSION RISK AREAS</Text>
          <Box flexWrap="wrap">
            {checklist.regressionAreas.map((area, i) => (
              <Text key={i} color="yellow">  • {area}</Text>
            ))}
          </Box>
        </Box>
      )}

      {/* Progress bar */}
      <Box marginBottom={1} gap={1}>
        <Text bold>Progress</Text>
        <ProgressBar done={done} total={total} />
      </Box>

      {/* Test cases */}
      <Box flexDirection="column">
        {checklist.testCases.map((tc, i) => (
          <TestCaseRow
            key={i}
            testCase={tc}
            index={i}
            isCompleted={completed.includes(i)}
            isSelected={selected === i}
          />
        ))}
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
          {'↑↓ navigate  '}
          <Text color="green" bold>Space</Text>
          {' check  '}
          <Text color="green" bold>a</Text>
          {' approve all  '}
          <Text color="green" bold>c</Text>
          {' chat with AI  '}
          <Text color="green" bold>b</Text>
          {' back  '}
          <Text color="green" bold>q</Text>
          {' quit'}
        </Text>
      </Box>
    </Box>
  )
}
