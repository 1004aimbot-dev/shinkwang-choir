import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// ✅ 이 파일을 실제로 만들 것!
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
