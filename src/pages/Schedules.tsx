import React, { useEffect, useState } from 'react';
import { Calendar, Bell, CheckCircle } from 'lucide-react';
import API from '../services/api';

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  eventTime: string;
  isRead: boolean;
}

const Schedules: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id: number) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${y}년 ${m}월 ${day}일 ${h}:${min}`;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar color="#6366f1" size={28} />
            입시 일정 및 알림 센터
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>중요한 대학 입시 마감 일정과 실시간 알림을 받아봅니다.</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>로딩 중...</p>
      ) : notifications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 0', background: 'rgba(255,255,255,0.01)' }}>
          <Bell size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)' }}>현재 생성된 입시 일정이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              className="glass-card"
              style={{
                background: n.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(99, 102, 241, 0.04)',
                borderLeft: n.isRead ? 'var(--glass-border)' : '4px solid #6366f1'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: 'bold', background: 'rgba(168,85,247,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      일정: {formatDateTime(n.eventTime)}
                    </span>
                    {!n.isRead && (
                      <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 'bold', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{n.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{n.content}</p>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleRead(n.id)}
                    style={readBtnStyle}
                    title="읽음 표시"
                  >
                    <CheckCircle size={18} />
                    <span>읽음 처리</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const readBtnStyle: React.CSSProperties = {
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  color: '#34d399',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 600,
  transition: 'all 0.2s'
};

export default Schedules;
