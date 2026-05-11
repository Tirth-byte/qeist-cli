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
    if (mins > 0) return `${mins}m ago`
    return 'just now'
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header
        title="Pull Requests"
        subtitle={`${prs.length} open PR${prs.length !== 1 ? 's' : ''}`}
      />

      {isLoading && (
        <Box marginTop={1}>
          <Text color="gray">⠿ Loading pull requests...</Text>
        </Box>
      )}

      {!isLoading && prs.length === 0 && (
        <Box flexDirection="column" gap={1} marginTop={1}>
          <Text color="gray">No open pull requests found.</Text>
          <Text dimColor color="gray">
            Open a PR on GitHub and Qeist will analyze it automatically.
          </Text>
        </Box>
      )}

      {/* PR cards — blank line between each via marginBottom={1} */}
      <Box flexDirection="column" marginTop={1}>
        {prs.map((pr, i) => {
          const isSelected = selected === i
          return (
            <Box
              key={pr.id}
              flexDirection="column"
              marginBottom={1}
            >
              {/* Line 1: cursor · number · title · repo (all on one line) */}
              <Box gap={1} alignItems="center">
                {/* Always reserve cursor column so layout never shifts */}
                <Text color="green" bold>
                  {isSelected ? '❯' : ' '}
                </Text>
                <Text bold color={isSelected ? 'white' : 'gray'}>
                  #{pr.prNumber}
                </Text>
                <Text
                  bold={isSelected}
                  color={isSelected ? 'white' : 'gray'}
                  wrap="truncate-end"
                >
                  {pr.prTitle}
                </Text>
                <Text color="gray" dimColor>
                  ({pr.repo})
                </Text>
              </Box>

              {/* Line 2: risk badge · status · time */}
              <Box paddingLeft={2} gap={2}>
                <RiskBadge level={pr.riskLevel} />
                <StatusBadge status={pr.status} />
                <Text dimColor color="gray">
                  {timeAgo(pr.createdAt)}
                </Text>
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Hint bar */}
      {!isLoading && (
        <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text color="gray">
            {'↑↓'} navigate{'   '}
            <Text color="green" bold>Enter</Text>
            {' open checklist   '}
            {'q'} quit
          </Text>
        </Box>
      )}
    </Box>
  )
}
