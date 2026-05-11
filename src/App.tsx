import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'
import { isLoggedIn } from './lib/config.js'
import { getPRs, getChecklist, PR, Checklist } from './lib/api.js'
import { Login } from './screens/Login.js'
import { PRList } from './screens/PRList.js'
import { ChecklistScreen } from './screens/Checklist.js'
import { Running } from './screens/Running.js'

type Screen =
  | 'login'
  | 'prs'
  | 'checklist'
  | 'running'

export const App = () => {
  const [screen, setScreen] = useState<Screen>(
    isLoggedIn() ? 'prs' : 'login'
  )
  const [prs, setPRs] = useState<PR[]>([])
  const [selectedPR, setSelectedPR] = useState<PR | null>(null)
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  // Bug fix: track actual checked indexes separately so Running screen is accurate
  const [runningCompleted, setRunningCompleted] = useState<number[]>([])
  const [loadingPRs, setLoadingPRs] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (screen === 'prs') {
      loadPRs()
    }
  }, [screen])

  const loadPRs = async () => {
    setLoadingPRs(true)
    setError('')
    try {
      const data = await getPRs()
      setPRs(data)
    } catch (e: any) {
      setError(e.response?.data?.error ||
        'Failed to load PRs. Check your connection.')
    } finally {
      setLoadingPRs(false)
    }
  }

  const handleSelectPR = async (pr: PR) => {
    setSelectedPR(pr)
    setChecklist(null)
    setScreen('checklist')
    try {
      const cl = await getChecklist(pr.id)
      setChecklist(cl)
    } catch {
      setChecklist(null)
    }
  }

  // Bug fix: receive completed indexes from ChecklistScreen so Running is accurate
  const handleApprove = (completedIndexes: number[]) => {
    setRunningCompleted(completedIndexes)
    setScreen('running')
  }

  if (error) {
    return (
      <Box flexDirection="column" padding={1} gap={1}>
        <Text color="red">✗ {error}</Text>
        <Text color="gray" dimColor>
          Run qeist login if your session expired
        </Text>
      </Box>
    )
  }

  if (screen === 'login') {
    return (
      <Login onSuccess={() => setScreen('prs')} />
    )
  }

  if (screen === 'prs') {
    return (
      <PRList
        prs={prs}
        isLoading={loadingPRs}
        onSelect={handleSelectPR}
        onBack={() => process.exit(0)}
      />
    )
  }

  if (screen === 'checklist' && selectedPR) {
    return (
      <ChecklistScreen
        pr={selectedPR}
        checklist={checklist}
        onBack={() => setScreen('prs')}
        onApprove={handleApprove}
      />
    )
  }

  if (screen === 'running' && selectedPR && checklist) {
    return (
      <Running
        testCases={checklist.testCases}
        completedIndexes={runningCompleted}
        onDone={() => setScreen('prs')}
      />
    )
  }

  return <Text color="gray">Loading...</Text>
}
