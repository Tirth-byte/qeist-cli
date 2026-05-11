import React from 'react'
import { Text } from 'ink'

type RiskProps = {
  level: 'high' | 'medium' | 'low' | null
}

export const RiskBadge = ({ level }: RiskProps) => {
  if (!level) return <Text color="gray">[UNKNOWN]</Text>
  const colors = {
    high: 'red',
    medium: 'yellow',
    low: 'green'
  } as const
  return (
    <Text color={colors[level]} bold>
      [{level.toUpperCase()}]
    </Text>
  )
}

type PriorityProps = {
  level: 'critical' | 'important' | 'nice_to_have'
}

export const PriorityBadge = ({ level }: PriorityProps) => {
  const config = {
    critical: { color: 'red', label: 'CRITICAL' },
    important: { color: 'yellow', label: 'IMPORTANT' },
    nice_to_have: { color: 'gray', label: 'NICE TO HAVE' }
  } as const
  const { color, label } = config[level]
  return <Text color={color}>[{label}]</Text>
}

type StatusProps = {
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export const StatusBadge = ({ status }: StatusProps) => {
  const config = {
    pending: { color: 'gray', label: 'QUEUED' },
    processing: { color: 'yellow', label: 'ANALYZING' },
    completed: { color: 'green', label: 'READY' },
    failed: { color: 'red', label: 'FAILED' }
  } as const
  const { color, label } = config[status]
  return <Text color={color}>{label}</Text>
}
