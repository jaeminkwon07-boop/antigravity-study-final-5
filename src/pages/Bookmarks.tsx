import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, GraduationCap } from 'lucide-react';
import API from '../services/api';

interface BookmarkItem {
  id: number;
  universityId: number;
  universityName: string;
  region: string;
  logoUrl?: string;
}

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBookmark = async (universityId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Card click event bubble prevent
    try {
      await API.post(`/bookmarks/toggle/${universityId}`);
      setBookmarks(prev => prev.filter(b => b.universityId !== universityId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Star color="#f59e0b" fill="#f59e0b" size={28} />
          관심 대학 관리
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>저장한 대학교 목록을 확인하고 관리합니다.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>로딩 중...</p>
      ) : bookmarks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '64px 0', background: 'rgba(255,255,255,0.01)' }}>
          <GraduationCap size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>저장된 관심 대학이 없습니다.</p>
          <button onClick={() => navigate('/search')} className="gradient-btn">대학 찾기</button>
        </div>
      ) : (
        <div style={gridStyle}>
          {bookmarks.map(b => (
            <div
              key={b.id}
              className="glass-card"
              onClick={() => navigate('/search')}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt={b.universityName} style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'white', padding: '3px', borderRadius: '10px' }} />
                ) : (
                  <div style={placeholderLogoStyle}>{b.universityName.substring(0, 2)}</div>
                )}
                <div>
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{b.universityName}</h4>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{b.region}</span>
                </div>
              </div>

              <button
                onClick={(e) => handleDeleteBookmark(b.universityId, e)}
                style={trashBtnStyle}
                title="북마크 취소"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px'
};

const placeholderLogoStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  color: 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px'
};

const trashBtnStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#f87171',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default Bookmarks;
