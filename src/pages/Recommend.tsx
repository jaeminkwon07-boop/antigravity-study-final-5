import React, { useEffect, useState } from 'react';
import { Award, Save, RefreshCw, Info } from 'lucide-react';
import API from '../services/api';

interface RecommendItem {
  universityId: number;
  universityName: string;
  region: string;
  logoUrl?: string;
  admissionTypeName: string;
  category: string;
  type: string;
  cutOffGpa?: number;
  cutOffStandard?: number;
  matchScore: string; // "안정", "적정", "소신", "상향"
  description: string;
}

const Recommend: React.FC = () => {
  const [gpa, setGpa] = useState('');
  const [korean, setKorean] = useState('');
  const [math, setMath] = useState('');
  const [english, setEnglish] = useState('');
  const [inquiry1, setInquiry1] = useState('');
  const [inquiry2, setInquiry2] = useState('');

  const [recommendations, setRecommendations] = useState<RecommendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchGradesAndRecommendations();
  }, []);

  const fetchGradesAndRecommendations = async () => {
    setLoading(true);
    try {
      // 1. Get current grades
      const gradeRes = await API.get('/grades');
      if (gradeRes.data) {
        const d = gradeRes.data;
        setGpa(d.gpa ? d.gpa.toString() : '');
        setKorean(d.koreanStandard ? d.koreanStandard.toString() : '');
        setMath(d.mathStandard ? d.mathStandard.toString() : '');
        setEnglish(d.englishGrade ? d.englishGrade.toString() : '');
        setInquiry1(d.inquiry1Standard ? d.inquiry1Standard.toString() : '');
        setInquiry2(d.inquiry2Standard ? d.inquiry2Standard.toString() : '');

        // 2. If grades exist, fetch recommendations
        const recRes = await API.get('/recommendations');
        setRecommendations(recRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = {
      gpa: parseFloat(gpa),
      koreanStandard: korean ? parseInt(korean) : null,
      mathStandard: math ? parseInt(math) : null,
      englishGrade: english ? parseInt(english) : null,
      inquiry1Standard: inquiry1 ? parseInt(inquiry1) : null,
      inquiry2Standard: inquiry2 ? parseInt(inquiry2) : null,
    };

    try {
      await API.post('/grades', payload);
      setMsg('성적이 성공적으로 저장되었습니다!');

      // Re-fetch recommendations
      const recRes = await API.get('/recommendations');
      setRecommendations(recRes.data);
    } catch (err: any) {
      console.error(err);
      setMsg('성적 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const getMatchBadgeClass = (score: string) => {
    switch (score) {
      case '안정': return 'badge-safe';
      case '적정': return 'badge-moderate';
      case '소신': return 'badge-challenging';
      case '상향': return 'badge-danger';
      default: return 'badge-moderate';
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      {/* Left Column - Score Form */}
      <div className="glass-card" style={{ height: 'fit-content' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Award size={24} color="#6366f1" />
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>내 성적 입력</h3>
        </div>

        {msg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: msg.includes('성공') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: msg.includes('성공') ? '#34d399' : '#f87171',
            border: `1px solid ${msg.includes('성공') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSaveGrades} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>내신 평균 등급 (필수)</label>
            <input
              type="number"
              step="0.01"
              min="1.0"
              max="9.0"
              placeholder="예: 1.54"
              className="custom-input"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              required
            />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', color: 'white', marginBottom: '12px' }}>수능 성적 (선택)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={subLabelStyle}>국어 표준점수</label>
                <input
                  type="number"
                  placeholder="표준점수"
                  className="custom-input"
                  value={korean}
                  onChange={(e) => setKorean(e.target.value)}
                />
              </div>
              <div>
                <label style={subLabelStyle}>수학 표준점수</label>
                <input
                  type="number"
                  placeholder="표준점수"
                  className="custom-input"
                  value={math}
                  onChange={(e) => setMath(e.target.value)}
                />
              </div>
              <div>
                <label style={subLabelStyle}>영어 등급</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  placeholder="등급"
                  className="custom-input"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                />
              </div>
              <div>
                <label style={subLabelStyle}>탐구1 표준점수</label>
                <input
                  type="number"
                  placeholder="표준점수"
                  className="custom-input"
                  value={inquiry1}
                  onChange={(e) => setInquiry1(e.target.value)}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={subLabelStyle}>탐구2 표준점수</label>
                <input
                  type="number"
                  placeholder="표준점수"
                  className="custom-input"
                  value={inquiry2}
                  onChange={(e) => setInquiry2(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', marginTop: '8px' }} disabled={saving}>
            <Save size={18} />
            {saving ? '저장 중...' : '성적 저장 및 추천 분석'}
          </button>
        </form>
      </div>

      {/* Right Column - Recommendations */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>합격 가능 대학 추천</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              내 성적을 기준으로 대학별 입시결과 70% 컷라인과 비교합니다.
            </p>
          </div>
          <button onClick={fetchGradesAndRecommendations} style={refreshBtnStyle}>
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>추천 리스트 분석 중...</p>
        ) : recommendations.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px 0', background: 'rgba(255,255,255,0.01)' }}>
            <Info size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>왼쪽 폼에 성적을 입력하고 저장해야 추천 분석을 받을 수 있습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((r, i) => (
              <div key={i} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {r.logoUrl && (
                    <img src={r.logoUrl} alt={r.universityName} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', background: 'white', padding: '3px' }} />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>{r.universityName}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.region}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#818cf8', fontWeight: 600, marginTop: '4px' }}>
                      {r.admissionTypeName} ({r.category})
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '500px', lineHeight: '1.4' }}>
                      {r.description}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '13px' }}>
                      {r.cutOffGpa && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          전년도 70% 컷 내신: <strong style={{ color: 'white' }}>{r.cutOffGpa.toFixed(2)} 등급</strong>
                        </span>
                      )}
                      {r.cutOffStandard && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          전년도 70% 컷 수능: <strong style={{ color: 'white' }}>{r.cutOffStandard} 점</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className={`badge ${getMatchBadgeClass(r.matchScore)}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                    {r.matchScore}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>합격선 대비 분석</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '400px 1fr',
  gap: '40px',
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  fontWeight: 600
};

const subLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--text-light)',
  marginBottom: '4px'
};

const refreshBtnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: 600
};

export default Recommend;
