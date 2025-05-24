import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app/App.jsx'
import './index.css'

// Configure axios defaults
import axios from 'axios'
axios.defaults.baseURL = 'http://0.0.0.0:80'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
