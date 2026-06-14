import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Star, Bell, LogOut, LogIn, Award } from 'lucide-react';
import API from '../services/api';

interface NotificationItem {
  id: number;
  title: string;
  isRead: boolean;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleReadNotification = async (id: number) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      background: 'rgba(10, 11, 16, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{
          textDecoration: 'none',
          fontSize: '24px',
          fontWeight: 800,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <GraduationCap size={32} color="#6366f1" />
          <span className="gradient-text" style={{ fontFamily: 'Outfit' }}>IPSION</span>
        </Link>

        {token && (
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/search" style={linkStyle}>
              <BookOpen size={18} />
              대학 검색
            </Link>
            <Link to="/recommend" style={linkStyle}>
              <Award size={18} />
              성적 추천
            </Link>
            <Link to="/bookmarks" style={linkStyle}>
              <Star size={18} />
              관심 대학
            </Link>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {token ? (
          <>
            {/* Notification Dropdown Container */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Bell size={22} color={unreadCount > 0 ? '#a855f7' : '#9ca3af'} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '320px',
                  background: '#141623',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 1010
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '8px'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>입시 알림</span>
                    <Link to="/schedules" onClick={() => setShowNotifDropdown(false)} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none' }}>전체 보기</Link>
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>새로운 알림이 없습니다.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.isRead) handleReadNotification(n.id);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                            marginBottom: '4px',
                            borderLeft: n.isRead ? 'none' : '3px solid #6366f1'
                          }}
                        >
                          <div style={{ fontWeight: n.isRead ? 'normal' : '600', color: 'white' }}>{n.title}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              <strong style={{ color: 'white' }}>{user?.nickname}</strong> 님
            </span>

            <button onClick={handleLogout} style={authBtnStyle}>
              <LogOut size={16} />
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            ...authBtnStyle,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            border: 'none',
            color: 'white'
          }}>
            <LogIn size={16} />
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#9ca3af',
  fontSize: '15px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'color 0.2s',
  padding: '6px 12px',
  borderRadius: '8px'
};

const authBtnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s'
};

export default Navbar;
