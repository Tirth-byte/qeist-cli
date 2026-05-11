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
}

export const ChecklistScreen = ({
  pr, checklist, onBack, onApprove
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
    // Bug fix: guard all input when checklist hasn't loaded yet
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
    // Bug fix: pass completed indexes so Running screen has correct data
    setTimeout(() => onApprove(all), 500)
  }

  if (!checklist) {
    return (
      <Box flexDirection="column" padding={1}>
        <Header
          title={pr.prTitle}
          subtitle={`${pr.repo} #${pr.prNumber}`}
        />
        <Box flexDirection="column" gap={1} alignItems="center" marginTop={2}>
          <Text color="yellow" bold>⠿ AI is analyzing your PR...</Text>
          <Text color="gray" dimColor>
            This usually takes 20–30 seconds.
          </Text>
          <Text color="gray" dimColor>
            b / ← to go back
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

      <Box gap={2} marginBottom={1}>
        <Text bold>Risk:</Text>
        <RiskBadge level={pr.riskLevel} />
        {saving && (
          <Text color="gray" dimColor>  saving...</Text>
        )}
      </Box>

      <Box
        flexDirection="column"
        marginBottom={1}
        borderStyle="round"
        borderColor="gray"
        padding={1}
      >
        <Text color="green" bold>AI SUMMARY</Text>
        <Text color="gray" wrap="wrap">
          {checklist.summary}
        </Text>
      </Box>

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

      <Box marginBottom={1} gap={1}>
        <Text bold>Progress</Text>
        <ProgressBar done={done} total={total} />
      </Box>

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

      <Box marginTop={1}>
        <Text dimColor color="gray">
          {'↑↓ navigate  Space/Enter check  1–'}
          {total}
          {' quick  a approve all  ← back  q quit'}
        </Text>
      </Box>
    </Box>
  )
}
