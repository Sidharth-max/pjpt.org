import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// Prevent right-click save on media elements
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') e.preventDefault();
});

// Prevent Ctrl+S (save page) and Ctrl+U (view source)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === 's' || e.key === 'u')) e.preventDefault();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
