import { root } from '@lynx-js/react'
import { App } from './App.jsx'

// Initialize the app with proper error handling
try {
  console.log('Starting Nearby Share App...')
  
  // Check if we're in a development environment
  const isDev = process.env.NODE_ENV !== 'production'
  if (isDev) {
    console.log('Running in development mode')
  }
  
  // Render the main app component
  root.render(<App />)
  
  // Enable hot module replacement if available
  if (import.meta.webpackHot) {
    import.meta.webpackHot.accept()
  }
  
  console.log('App successfully rendered')
} catch (error) {
  console.error('Failed to initialize app:', error)
}
