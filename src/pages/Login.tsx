import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import API from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { username, password });
      const { token, nickname, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, nickname, role }));

      // Redirect to home dashboard
      navigate('/');
      window.location.reload(); // Refresh to update navbar state
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
          로그인
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
          IPSION 통합 입시 정보 플랫폼에 오신 것을 환영합니다.
        </p>

        {error && (
          <div style={errorContainerStyle}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>아이디</label>
            <div style={inputWrapperStyle}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>비밀번호</label>
            <div style={inputWrapperStyle}>
              <Lock size={18} style={iconStyle} />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          아직 계정이 없으신가요? <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>회원가입</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '20px'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: '8px',
  fontWeight: 500
};

const inputWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '16px',
  color: 'var(--text-muted)'
};

const errorContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '8px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#f87171',
  marginBottom: '20px',
  fontSize: '14px'
};

export default Login;
