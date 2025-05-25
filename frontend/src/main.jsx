import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app/App.jsx'
import './index.css'

// Configure axios defaults
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
