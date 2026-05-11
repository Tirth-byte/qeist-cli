import axios from 'axios'
import { getConfig } from './config.js'

const BASE = 'https://qeist-api.onrender.com'

const client = () => {
  const { token, companyId } = getConfig()
  return axios.create({
    baseURL: BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      'x-company-id': companyId,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  })
}

export type PR = {
  id: string
  prNumber: number
  prTitle: string
  repo: string
  riskLevel: 'high' | 'medium' | 'low' | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  prUrl: string
  createdAt: string
}

export type TestCase = {
  area: string
  priority: 'critical' | 'important' | 'nice_to_have'
  why: string
  step: string
  expected: string
  source?: 'ai' | 'chat'
  addedAt?: string
}

export type Checklist = {
  id: string
  prId: string
  riskLevel: 'high' | 'medium' | 'low'
  summary: string
  regressionAreas: string[]
  testCases: TestCase[]
  completedIndexes: number[]
}

export const getPRs = async (): Promise<PR[]> => {
  const res = await client().get('/api/prs')
  return res.data.prs || res.data || []
}

export const getChecklist = async (
  prId: string
): Promise<Checklist | null> => {
  try {
    const res = await client()
      .get(`/api/prs/${prId}/checklist`)
    return res.data
  } catch (e: any) {
    if (e.response?.status === 404) return null
    throw e
  }
}

export const sendChatMessage = async (
  prId: string,
  message: string
): Promise<{
  response: string
  newTestCases: TestCase[]
  totalTestCases: number
}> => {
  const res = await client().post(
    `/api/prs/${prId}/checklist/chat`,
    { message }
  )
  return res.data
}

export const getChatHistory = async (
  prId: string
): Promise<{
  messages: Array<{
    id: string
    userEmail: string
    message: string
    response: string
    addedTestCases: TestCase[]
    createdAt: string
  }>
}> => {
  const res = await client().get(
    `/api/prs/${prId}/checklist/chat/history`
  )
  return res.data
}

export const updateProgress = async (
  prId: string,
  completedIndexes: number[]
): Promise<void> => {
  await client().patch(
    `/api/prs/${prId}/checklist/progress`,
    { completedIndexes }
  )
}
