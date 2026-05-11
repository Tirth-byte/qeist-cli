import React, { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import { MiniLogo } from '../components/MiniLogo.js'
import { NavBar } from '../components/NavBar.js'
import { RiskBadge } from '../components/Badge.js'
import { ProgressBar } from '../components/ProgressBar.js'
import { TestCaseRow } from '../components/TestCase.js'
import {
  Checklist as CL,
  PR,
  updateProgress,
  deleteTestCase,
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
  const [deleteMode, setDeleteMode] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (checklist) {
      setCompleted(checklist.completedIndexes || [])
    }
  }, [checklist])

  const total = checklist?.testCases?.length || 0
  const done = completed.length

  useInput((input, key) => {
    if (!checklist) {
      if (key.leftArrow || input === 'b') onBack()
      if (input === 'q') process.exit(0)
      return
    }

    if (deleteMode) {
      if (key.escape || input === 'd') {
        setDeleteMode(false)
        return
      }
      if (key.return) {
        void handleDelete(selected)
        return
      }
      if (key.upArrow) setSelected(s => Math.max(0, s - 1))
      if (key.downArrow) setSelected(s => Math.min(total - 1, s + 1))
      if (input === 'q') process.exit(0)
      return
    }

    if (key.upArrow) setSelected(s => Math.max(0, s - 1))
    if (key.downArrow) setSelected(s => Math.min(total - 1, s + 1))

    if (input === ' ' || key.return) toggleTest(selected)
    if (key.leftArrow || input === 'b') onBack()
    if (input === 'a') void approveAll()
    if (input === 'c') onChat()
    if (input === 'd') setDeleteMode(true)
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

  const handleDelete = async (index: number) => {
    if (deleting || !checklist) return
    setDeleting(true)
    try {
      await deleteTestCase(pr.id, index)
      // Patch local state: splice test case and shift completedIndexes
      checklist.testCases.splice(index, 1)
      const newCompleted = completed
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i))
      setCompleted(newCompleted)
      setSelected(s => Math.min(s, checklist.testCases.length - 1))
      setDeleteMode(false)
    } finally {
      setDeleting(false)
    }
  }

  if (!checklist) {
    return (
      <Box flexDirection="column" padding={1}>
        <MiniLogo />
        <Box
          borderStyle="round"
          borderColor="gray"
          paddingLeft={1}
          paddingRight={1}
          paddingTop={0}
          paddingBottom={0}
          marginBottom={1}
        >
          <Box flexDirection="column">
            <Text bold color="white">{pr.prTitle}</Text>
            <Text color="gray" dimColor>{pr.repo} #{pr.prNumber}</Text>
          </Box>
        </Box>
        <Box flexDirection="column" gap={1} alignItems="center" marginTop={1}>
          <Text color="yellow" bold>⠿ AI is analyzing your PR...</Text>
          <Text color="gray" dimColor>This usually takes 20–30 seconds.</Text>
        </Box>
        <NavBar
          items={[
            { key: 'b', label: 'back' },
            { key: '←', label: 'back' },
            { key: 'q', label: 'quit' },
          ]}
        />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={1}>
      <MiniLogo />

      {/* PR info box */}
      <Box
        borderStyle="round"
        borderColor="gray"
        paddingLeft={1}
        paddingRight={1}
        paddingTop={0}
        paddingBottom={0}
        marginBottom={1}
      >
        <Box flexDirection="column">
          <Box gap={2}>
            <Text bold color="white">{pr.prTitle}</Text>
            <RiskBadge level={pr.riskLevel} />
            {saving && <Text color="gray" dimColor>saving...</Text>}
            {deleting && <Text color="red" dimColor>deleting...</Text>}
          </Box>
          <Text color="gray" dimColor>{pr.repo} #{pr.prNumber}</Text>
        </Box>
      </Box>

      {/* Delete mode warning */}
      {deleteMode && (
        <Box
          borderStyle="round"
          borderColor="red"
          paddingLeft={1}
          paddingRight={1}
          marginBottom={1}
        >
          <Text color="red" bold>
            ⚠ DELETE MODE — Enter to delete selected · d or Esc to cancel
          </Text>
        </Box>
      )}

      {/* AI summary */}
      <Box
        flexDirection="column"
        marginBottom={1}
        borderStyle="round"
        borderColor="gray"
        paddingLeft={1}
        paddingRight={1}
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
        <Text color="gray" dimColor>{done}/{total}</Text>
      </Box>

      {/* Legend */}
      <Box gap={2} marginBottom={1}>
        <Text color="cyan" dimColor>◆ AI Chat</Text>
        <Text color="gray" dimColor>◇ Auto</Text>
        <Text color="green" dimColor>✅ Done</Text>
        <Text color="gray" dimColor>☐ Pending</Text>
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
            deleteMode={deleteMode}
          />
        ))}
      </Box>

      <NavBar
        items={deleteMode ? [
          { key: '↑↓', label: 'navigate' },
          { key: 'Enter', label: 'delete' },
          { key: 'd', label: 'cancel delete' },
          { key: 'Esc', label: 'cancel' },
        ] : [
          { key: '↑↓', label: 'navigate' },
          { key: 'Space', label: 'check' },
          { key: 'a', label: 'approve all' },
          { key: 'c', label: 'AI chat' },
          { key: 'd', label: 'delete mode' },
          { key: 'b', label: 'back' },
          { key: 'q', label: 'quit' },
        ]}
        status={deleteMode ? 'DELETE MODE' : undefined}
        statusColor="red"
      />
    </Box>
  )
}
