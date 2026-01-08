import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// ❗ index.css 없으면 이 줄 삭제
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
