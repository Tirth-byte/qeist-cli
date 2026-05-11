import open from 'open'
import { saveConfig } from './config.js'

const API = 'https://qeist-api.onrender.com'

export const browserLogin = async (
  onWaiting: () => void
): Promise<void> => {
  const sessionId = Math.random()
    .toString(36).substring(2, 15)

  const url = `https://qeist.in/cli-auth?session=${sessionId}`

  await open(url)
  onWaiting()

  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 90

    const poll = setInterval(async () => {
      attempts++
      if (attempts > maxAttempts) {
        clearInterval(poll)
        reject(new Error(
          'Authentication timed out after 3 minutes'
        ))
        return
      }

      try {
        const res = await fetch(
          `${API}/cli/session/${sessionId}`
        )
        const data = await res.json()

        if (data.ready) {
          clearInterval(poll)
          saveConfig({
            token: data.token,
            companyId: data.companyId,
            email: data.email,
            companyName: data.companyName
          })
          resolve()
        }
      } catch {
        // keep polling
      }
    }, 2000)
  })
}
