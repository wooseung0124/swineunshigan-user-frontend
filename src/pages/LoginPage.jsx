import NaverLoginButton from '../components/auth/NaverLoginButton';
import KakaoLoginButton from '../components/auth/KakaoLoginButton';

export default function LoginPage() {
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
    </div>
  );
}