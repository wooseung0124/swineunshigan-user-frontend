import { useNavigate } from 'react-router-dom';
import NaverLoginButton from '../components/auth/NaverLoginButton';
import KakaoLoginButton from '../components/auth/KakaoLoginButton';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '12px',
      padding: '0 24px',
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700' }}>쉬는시간</h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>짧지만 의미있게</p>
      <KakaoLoginButton />
      <NaverLoginButton />
      <button
        onClick={() => navigate('/home')}
        style={{
          marginTop: '16px',
          background: 'none',
          border: 'none',
          color: '#888',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        로그인 없이 둘러보기
      </button>
    </div>
  );
}