import React from 'react';
/* 🌟 'HashRouter'를 사용해서 깃허브 경로 문제를 가장 확실하게 해결합니다! */
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Recommend from './pages/Recommend';
import Bookmarks from './pages/Bookmarks';
import Schedules from './pages/Schedules';

// Simple Route guard for checking login status
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    /* 🌟 <Router> 태그 안에 basename은 지우고 <HashRouter>로 변경했습니다! */
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* 🌟 깃허브 루트 경로("/") 문제를 무시하고 
                해시(#) 주소 방식을 써서 메인 화면을 무조건 띄웁니다! */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Student Routes */}
            <Route path="/search" element {
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } />
            <Route path="/recommend" element {
              <ProtectedRoute>
                <Recommend />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element {
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />
            <Route path="/schedules" element {
              <ProtectedRoute>
                <Schedules />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
