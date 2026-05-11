import Conf from 'conf'

const config = new Conf({
  projectName: 'qeist',
  schema: {
    token: { type: 'string' },
    companyId: { type: 'string' },
    email: { type: 'string' },
    companyName: { type: 'string' },
    savedAt: { type: 'number' }
  }
})

export const getConfig = () => ({
  token: config.get('token') as string,
  companyId: config.get('companyId') as string,
  email: config.get('email') as string,
  companyName: config.get('companyName') as string,
  savedAt: config.get('savedAt') as number
})

export const saveConfig = (data: {
  token: string
  companyId: string
  email: string
  companyName: string
}) => {
  config.set('token', data.token)
  config.set('companyId', data.companyId)
  config.set('email', data.email)
  config.set('companyName', data.companyName)
  config.set('savedAt', Date.now())
}

export const clearConfig = () => config.clear()

export const isLoggedIn = (): boolean => {
  const token = config.get('token') as string | undefined
  const savedAt = config.get('savedAt') as number | undefined

  // Token must be a non-empty string
  if (!token || typeof token !== 'string' || token.trim() === '') return false

  // savedAt must be a positive number
  if (!savedAt || typeof savedAt !== 'number' || savedAt <= 0) return false

  const eightHours = 8 * 60 * 60 * 1000
  return (Date.now() - savedAt) < eightHours
}
