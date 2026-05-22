import { useNavigate } from 'react-router-dom';
import NaverLoginButton from '../components/auth/NaverLoginButton';
import KakaoLoginButton from '../components/auth/KakaoLoginButton';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import loginBg from '../assets/images/login-bg-coffee.jpg';
import logoImage from '../assets/icons/resttime-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      backgroundImage: `url(${loginBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px',
    }}>
      {/* 어두운 오버레이 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0,
      }} />

      {/* 컨텐츠 wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        flex: 1,
        maxWidth: '400px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* 상단: 로고 + 헤드라인 + 서브 */}
        <div>
          <img
            src={logoImage}
            alt="쉬는시간"
            style={{ width: '120px', height: 'auto' }}
          />

          <h2 style={{
            color: '#FFF',
            fontFamily: 'Pretendard',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '126%',
            letterSpacing: '-0.48px',
            marginTop: '20px',
          }}>
            필요할 때만<br />가볍게 만나요
          </h2>

          <p style={{
            color: '#FFF',
            fontFamily: 'Pretendard',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '140%',
            letterSpacing: '-0.32px',
            marginTop: '12px',
          }}>
            쉬는시간 이용을 위해 로그인 해주세요
          </p>
        </div>

        {/* 하단: 소셜 버튼 + 둘러보기 + 약관 */}
        <div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <KakaoLoginButton />
            <NaverLoginButton />
            <GoogleLoginButton />
          </div>

          <button
            onClick={() => navigate('/home')}
            style={{
              marginTop: '16px',
              background: 'none',
              border: 'none',
              color: '#FFF',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            로그인 없이 둘러보기
          </button>

          {/* TODO: 약관 페이지 라우트 추가 후 href 연결 */}
          <p style={{
            color: '#FFF',
            fontFamily: 'Pretendard',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '150%',
            letterSpacing: '-0.24px',
            textAlign: 'center',
            marginTop: '16px',
          }}>
            로그인 하시면{' '}
            <a href="#" style={{ color: '#FFF', textDecoration: 'underline' }}>
              개인정보처리방침
            </a>
            {' '}및{' '}
            <a href="#" style={{ color: '#FFF', textDecoration: 'underline' }}>
              이용약관
            </a>
            에 동의하는 것으로 간주됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
