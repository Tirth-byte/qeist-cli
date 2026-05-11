import React from 'react'
import { render } from 'ink'
import { App } from './App.js'
import { Logout } from './commands/logout.js'  // resolves to logout.tsx

const command = process.argv[2]

if (command === 'logout') {
  render(<Logout />)
} else {
  const { waitUntilExit } = render(<App />)
  waitUntilExit()
}
