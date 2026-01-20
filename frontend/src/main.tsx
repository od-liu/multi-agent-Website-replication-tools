import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 注意：图标字体已通过 index.css 中的 @import "/fonts/home/iconfont.css" 导入
// 不要再导入 kyfw-iconfont.css，否则会覆盖正确的图标定义

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


