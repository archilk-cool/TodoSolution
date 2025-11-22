
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './globals.css';   // contains @tailwind and @layer base
import './styles.css';    // contains plain styling ONLY

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
