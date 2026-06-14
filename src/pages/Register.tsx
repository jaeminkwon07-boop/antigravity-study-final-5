import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, Award, AlertCircle } from 'lucide-react';
import API from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/auth/register', { username, password, email, nickname });
      setSuccess('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
          회원가입
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>
          IPSION 계정을 생성하고 입시 추천 솔루션을 시작하세요.
        </p>

        {error && (
          <div style={errorContainerStyle}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={successContainerStyle}>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>아이디</label>
            <div style={inputWrapperStyle}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                placeholder="사용할 아이디"
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
                placeholder="비밀번호 입력"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>이메일</label>
            <div style={inputWrapperStyle}>
              <Mail size={18} style={iconStyle} />
              <input
                type="email"
                placeholder="이메일 주소"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>닉네임</label>
            <div style={inputWrapperStyle}>
              <Award size={18} style={iconStyle} />
              <input
                type="text"
                placeholder="서비스에서 사용할 닉네임"
                className="custom-input"
                style={{ paddingLeft: '44px' }}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? '가입 처리 중...' : '회원가입'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          이미 계정이 있으신가요? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>로그인</Link>
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

const successContainerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '8px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  color: '#34d399',
  marginBottom: '20px',
  fontSize: '14px'
};

export default Register;
