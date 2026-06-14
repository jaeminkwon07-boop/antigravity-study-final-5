import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Globe, Star, Heart, ArrowRight } from 'lucide-react';
import API from '../services/api';

interface UniversitySummary {
  id: number;
  name: string;
  region: string;
  logoUrl?: string;
}

interface CompetitionRate {
  year: number;
  rate: number;
}

interface AdmissionResult {
  year: number;
  cutOffGpa?: number;
  cutOffStandard?: number;
}

interface AdmissionType {
  id: number;
  name: string;
  category: string;
  type: string;
  description: string;
  competitionRates: CompetitionRate[];
  admissionResults: AdmissionResult[];
}

interface UniversityDetail {
  id: number;
  name: string;
  region: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  admissionTypes: AdmissionType[];
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [universities, setUniversities] = useState<UniversitySummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UniversityDetail | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      fetchUniversityDetail(selectedId);
      checkBookmarkStatus(selectedId);
    }
  }, [selectedId]);

  const fetchUniversities = async (searchQuery = '') => {
    setLoadingList(true);
    try {
      const res = await API.get(`/universities?query=${searchQuery}`);
      setUniversities(res.data);
      if (res.data.length > 0 && selectedId === null) {
        setSelectedId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchUniversityDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const res = await API.get(`/universities/${id}`);
      setDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const checkBookmarkStatus = async (id: number) => {
    try {
      const res = await API.get(`/bookmarks/check/${id}`);
      setIsBookmarked(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async () => {
    if (selectedId === null) return;
    try {
      await API.post(`/bookmarks/toggle/${selectedId}`);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUniversities(query);
  };

  return (
    <div style={containerStyle} className="fade-in">
      {/* Left Pane - Search & List */}
      <div style={leftPaneStyle}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <SearchIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="대학명 검색..."
              className="custom-input"
              style={{ paddingLeft: '44px' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="gradient-btn" style={{ padding: '0 20px' }}>검색</button>
        </form>

        <div style={listContainerStyle}>
          {loadingList ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>로딩 중...</p>
          ) : universities.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>검색 결과가 없습니다.</p>
          ) : (
            universities.map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                style={{
                  ...cardStyle,
                  borderColor: selectedId === u.id ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                  background: selectedId === u.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {u.logoUrl ? (
                    <img src={u.logoUrl} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: 'white', padding: '2px' }} />
                  ) : (
                    <div style={placeholderLogoStyle}>{u.name.substring(0, 2)}</div>
                  )}
                  <div>
                    <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>{u.name}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.region}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane - Detail View */}
      <div style={rightPaneStyle}>
        {loadingDetail ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>대학교 상세 정보 로딩 중...</p>
        ) : detail ? (
          <div>
            <div style={detailHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {detail.logoUrl && (
                  <img src={detail.logoUrl} alt={detail.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', background: 'white', padding: '6px' }} />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800 }}>{detail.name}</h2>
                    <button
                      onClick={handleToggleBookmark}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isBookmarked ? '#f59e0b' : '#9ca3af',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                    >
                      <Star size={28} fill={isBookmarked ? '#f59e0b' : 'none'} />
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    {detail.region} • {detail.websiteUrl && (
                      <a href={detail.websiteUrl} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={14} /> 공식 홈페이지 방문
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '15px', lineHeight: '1.6', margin: '20px 0', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
              {detail.description || '대학 소개 정보가 비어있습니다.'}
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '32px 0 16px' }}>전형 정보 및 경쟁률/입시결과</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {detail.admissionTypes.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>등록된 입시 전형이 없습니다.</p>
              ) : (
                detail.admissionTypes.map(t => (
                  <div key={t.id} className="glass-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{t.name}</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={t.category === '수시' ? categorySusiStyle : categoryJungsiStyle}>{t.category}</span>
                        <span className="badge badge-moderate" style={{ textTransform: 'uppercase' }}>{t.type}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                      {t.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                      {/* 경쟁률 */}
                      <div>
                        <h5 style={{ fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>경쟁률 추이</h5>
                        {t.competitionRates.length === 0 ? (
                          <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>자료 없음</span>
                        ) : (
                          t.competitionRates.map(r => (
                            <div key={r.year} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{r.year}년도</span>
                              <strong style={{ color: '#a855f7' }}>{r.rate.toFixed(2)} : 1</strong>
                            </div>
                          ))
                        )}
                      </div>

                      {/* 입시결과 */}
                      <div>
                        <h5 style={{ fontSize: '14px', color: 'white', marginBottom: '8px', fontWeight: 600 }}>최종 합격 70% 컷</h5>
                        {t.admissionResults.length === 0 ? (
                          <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>자료 없음</span>
                        ) : (
                          t.admissionResults.map(res => (
                            <div key={res.year} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{res.year}년도</span>
                              <strong style={{ color: '#10b981' }}>
                                {res.cutOffGpa ? `내신 ${res.cutOffGpa.toFixed(2)} 등급` : ''}
                                {res.cutOffStandard ? `수능 표점합 ${res.cutOffStandard}점` : ''}
                              </strong>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>왼쪽 목록에서 대학을 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '360px 1fr',
  gap: '40px',
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  height: 'calc(100vh - 80px)'
};

const leftPaneStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  paddingRight: '20px'
};

const rightPaneStyle: React.CSSProperties = {
  height: '100%',
  overflowY: 'auto',
  paddingRight: '10px'
};

const listContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const cardStyle: React.CSSProperties = {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const placeholderLogoStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  color: 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px'
};

const detailHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  paddingBottom: '20px'
};

const categorySusiStyle: React.CSSProperties = {
  background: 'rgba(99, 102, 241, 0.15)',
  color: '#818cf8',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const categoryJungsiStyle: React.CSSProperties = {
  background: 'rgba(168, 85, 247, 0.15)',
  color: '#c084fc',
  border: '1px solid rgba(168, 85, 247, 0.3)',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold'
};

export default Search;
