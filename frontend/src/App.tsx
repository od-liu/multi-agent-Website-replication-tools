import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './index.css';

/**
 * 应用主组件
 * 配置路由和全局布局
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* 其他路由可以在这里添加 */}
      </Routes>
    </Router>
  );
}

export default App;
