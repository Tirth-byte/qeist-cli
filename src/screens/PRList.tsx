import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { Header } from '../components/Header.js'
import { RiskBadge, StatusBadge } from '../components/Badge.js'
import { PR } from '../lib/api.js'

type Props = {
  prs: PR[]
  onSelect: (pr: PR) => void
  onBack: () => void
  isLoading: boolean
}

export const PRList = ({
  prs, onSelect, onBack, isLoading
}: Props) => {
  const [selected, setSelected] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) {
      setSelected(s => Math.max(0, s - 1))
    }
    // Bug fix: guard against prs.length === 0 which sent selected to -1
    if (key.downArrow && prs.length > 0) {
      setSelected(s => Math.min(prs.length - 1, s + 1))
    }
    if (key.return && prs[selected]) {
      onSelect(prs[selected])
    }
    if (key.leftArrow || input === 'b') {
      onBack()
    }
    if (input === 'q') process.exit(0)
  })

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ago`
    if (hrs > 0) return `${hrs}h ago`
    return `${mins}m ago`
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header
        title="Pull Requests"
        subtitle={`${prs.length} open PRs`}
      />

      {isLoading && (
        <Text color="gray">Loading pull requests...</Text>
      )}

      {!isLoading && prs.length === 0 && (
        <Box flexDirection="column" gap={1}>
          <Text color="gray">No open pull requests found.</Text>
          <Text dimColor color="gray">
            Open a PR on GitHub and Qeist will analyze it automatically.
          </Text>
        </Box>
      )}

      {prs.map((pr, i) => (
        <Box
          key={pr.id}
          flexDirection="column"
          marginBottom={1}
          paddingLeft={selected === i ? 0 : 1}
        >
          <Box gap={1} alignItems="center">
            {selected === i && (
              <Text color="green" bold>❯</Text>
            )}
            <Text bold color={selected === i ? 'white' : 'gray'}>
              #{pr.prNumber}
            </Text>
            <Text
              bold={selected === i}
              color={selected === i ? 'white' : 'gray'}
              wrap="truncate-end"
            >
              {pr.prTitle}
            </Text>
          </Box>
          <Box paddingLeft={3} gap={2}>
            <Text dimColor color="gray" italic>
              {pr.repo}
            </Text>
            <RiskBadge level={pr.riskLevel} />
            <StatusBadge status={pr.status} />
            <Text dimColor color="gray">
              {timeAgo(pr.createdAt)}
            </Text>
          </Box>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text dimColor color="gray">
          ↑↓ navigate  Enter open  ← back  q quit
        </Text>
      </Box>
    </Box>
  )
}
