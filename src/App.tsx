import React, { useEffect, useState } from 'react'
import { getWelcomeMessage } from './wasmLoader'

function App() {
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Loading...')

  useEffect(() => {
    getWelcomeMessage()
      .then(message => setWelcomeMessage(message))
      .catch(error => {
        console.error('Failed to get welcome message from WASM:', error)
        setWelcomeMessage('Failed to load welcome message')
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>{welcomeMessage}</h1>
        <p>Welcome to your TypeScript + React app with WASM</p>
      </header>
    </div>
  )
}

export default App