import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { MiniLogo } from '../components/MiniLogo.js'
import { NavBar } from '../components/NavBar.js'
import { RiskBadge, StatusBadge } from '../components/Badge.js'
import { PR } from '../lib/api.js'

type Props = {
  prs: PR[]
  onSelect: (pr: PR) => void
  onBack: () => void
  onRefresh: () => void
  isLoading: boolean
}

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

export const PRList = ({
  prs, onSelect, onBack, onRefresh, isLoading
}: Props) => {
  const [selected, setSelected] = useState(0)

  useInput((input, key) => {
    if (key.upArrow && prs.length > 0) {
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
    if (input === 'r') {
      onRefresh()
    }
    if (input === 'q') process.exit(0)
  })

  // Group PRs by repo, preserving original flat index for selection
  const repoGroups = prs.reduce<Record<string, number[]>>((acc, pr, i) => {
    if (!acc[pr.repo]) acc[pr.repo] = []
    acc[pr.repo].push(i)
    return acc
  }, {})
  const repos = Object.keys(repoGroups).sort()

  return (
    <Box flexDirection="column" padding={1}>
      <MiniLogo />

      <Box gap={2} marginBottom={1}>
        <Text bold color="white">Pull Requests</Text>
        <Text color="gray" dimColor>
          {prs.length} open PR{prs.length !== 1 ? 's' : ''}
        </Text>
        {isLoading && <Text color="yellow">⟳ refreshing...</Text>}
      </Box>

      {!isLoading && prs.length === 0 && (
        <Box flexDirection="column" gap={1} marginTop={1}>
          <Text color="gray">No open pull requests found.</Text>
          <Text dimColor color="gray">
            Open a PR on GitHub and Qeist will analyze it automatically.
          </Text>
        </Box>
      )}

      <Box flexDirection="column">
        {repos.map(repo => (
          <Box key={repo} flexDirection="column" marginBottom={1}>
            {/* Repo header */}
            <Box gap={1} marginBottom={0}>
              <Text color="cyan" bold>⌥ {repo}</Text>
              <Text color="gray" dimColor>
                ({repoGroups[repo].length} PR{repoGroups[repo].length !== 1 ? 's' : ''})
              </Text>
            </Box>

            {/* PR cards under this repo */}
            {repoGroups[repo].map(flatIdx => {
              const pr = prs[flatIdx]
              const isSelected = selected === flatIdx
              return (
                <Box
                  key={pr.id}
                  flexDirection="column"
                  marginBottom={1}
                  paddingLeft={isSelected ? 0 : 2}
                  borderStyle={isSelected ? 'round' : undefined}
                  borderColor={isSelected ? 'green' : undefined}
                >
                  <Box gap={1} alignItems="center">
                    {isSelected && <Text color="green" bold>❯</Text>}
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
                  </Box>

                  <Box paddingLeft={isSelected ? 2 : 0} gap={2}>
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
        ))}
      </Box>

      <NavBar
        items={[
          { key: '↑↓', label: 'navigate' },
          { key: 'Enter', label: 'open' },
          { key: 'r', label: 'refresh' },
          { key: 'q', label: 'quit' },
        ]}
      />
    </Box>
  )
}
