import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, Star, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import API from '../services/api';

interface GradeInfo {
  gpa: number;
  koreanStandard?: number;
  mathStandard?: number;
  englishGrade?: number;
}

interface BookmarkItem {
  id: number;
  universityName: string;
  region: string;
}

const Home: React.FC = () => {
  const token = localStorage.getItem('token');
  const [grade, setGrade] = useState<GradeInfo | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const gradeRes = await API.get('/grades');
      setGrade(gradeRes.data);

      const bookmarkRes = await API.get('/bookmarks');
      setBookmarks(bookmarkRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={heroContainerStyle} className="fade-in">
        <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px', lineHeight: '1.2' }}>
          대한민국 수험생을 위한<br />
          <span className="gradient-text">단 하나의 입시 솔루션</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
          대학 검색, 전형 정보 분석, 실시간 경쟁률, 입시 결과부터 성적 기반 맞춤 추천 및 디테일한 스케줄 알림까지, 한곳에서 완벽하게 준비하세요.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/login" className="gradient-btn" style={{ textDecoration: 'none', padding: '16px 32px', fontSize: '16px' }}>
            시작하기 <ArrowRight size={20} />
          </Link>
          <Link to="/login" style={{
            ...btnSecondaryStyle,
            padding: '16px 32px',
            fontSize: '16px'
          }}>
            대학 검색 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          나의 입시 대시보드
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>현재 등록된 성적과 주요 입시 상황을 요약해서 보여줍니다.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>데이터를 로딩 중입니다...</p>
      ) : (
        <div style={dashboardGridStyle}>
          {/* 1. 성적 정보 요약 */}
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <div style={cardHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck color="#6366f1" size={24} />
                <h3 style={{ fontSize: '20px' }}>등록된 성적 분석</h3>
              </div>
              <Link to="/recommend" style={cardLinkStyle}>관리하기</Link>
            </div>
            {grade ? (
              <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>내신 평균 등급</div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#6366f1' }}>{grade.gpa.toFixed(2)}</div>
                </div>
                {(grade.koreanStandard || grade.mathStandard) && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>수능 표준점수 (국/수)</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#a855f7' }}>
                      {grade.koreanStandard || 0} / {grade.mathStandard || 0}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>등록된 성적이 없습니다. 성적을 입력하고 대학 추천을 받아보세요.</p>
                <Link to="/recommend" className="gradient-btn" style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 16px' }}>성적 등록하러 가기</Link>
              </div>
            )}
          </div>

          {/* 2. 관심 대학 */}
          <div className="glass-card">
            <div style={cardHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Star color="#f59e0b" size={24} />
                <h3 style={{ fontSize: '20px' }}>관심 대학</h3>
              </div>
              <Link to="/bookmarks" style={cardLinkStyle}>전체보기</Link>
            </div>
            <div style={{ marginTop: '16px' }}>
              {bookmarks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
                  저장된 대학이 없습니다.<br />검색창에서 대학을 추가해 보세요.
                </p>
              ) : (
                bookmarks.slice(0, 3).map(b => (
                  <div key={b.id} style={bookmarkItemStyle}>
                    <span style={{ fontWeight: 'bold' }}>{b.universityName}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.region}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <Link to="/search" style={quickLinkStyle}>
              <Search size={28} color="#6366f1" />
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>대학 검색</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>전형 및 입시결과 검색</p>
              </div>
            </Link>
            <Link to="/recommend" style={quickLinkStyle}>
              <Award size={28} color="#a855f7" />
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>맞춤 대학 추천</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>내신/수능기반 추천 매칭</p>
              </div>
            </Link>
            <Link to="/schedules" style={quickLinkStyle}>
              <Calendar size={28} color="#3b82f6" />
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>입시 일정 알림</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>일정 캘린더 및 알림 센터</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const heroContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  padding: '0 20px'
};

const btnSecondaryStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  padding: '12px 24px',
  fontWeight: '600',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)',
  textDecoration: 'none'
};

const dashboardGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '30px'
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '12px'
};

const cardLinkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6366f1',
  textDecoration: 'none',
  fontWeight: 600
};

const bookmarkItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  marginBottom: '8px'
};

const quickLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '12px',
  textDecoration: 'none',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'var(--transition-smooth)'
};
quickLinkStyle[':hover'] = {
  background: 'rgba(255, 255, 255, 0.08)'
};

export default Home;
