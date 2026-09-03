import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import KakaoLoginButton from '../components/auth/KakaoLoginButton';
import NaverLoginButton from '../components/auth/NaverLoginButton';
import loginBg from '../assets/login-bg.png';
import loginLogo from '../assets/login-logo.png';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('login-route');

    return () => {
      document.documentElement.classList.remove('login-route');
    };
  }, []);

  const handleGuestBrowse = () => {
    // 이전 로그인 잔여값이 있어도 게스트로 진입
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.setItem('guest', 'true');
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-page__background" aria-hidden="true">
        <div className="login-page__background-white" />
        <div
          className="login-page__background-photo"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
      </div>

      <section className="login-page__hero" aria-labelledby="login-title">
        <img
          className="login-page__brand"
          src={loginLogo}
          alt="쉬는시간"
        />
        <h1 id="login-title" className="login-page__title">
          작은 결심이 필요한 순간,
          <br />
          쉬는시간
        </h1>
        <p className="login-page__tagline">
          나만의 속도로, 망설임 없이 시작해보세요
        </p>
      </section>

      <section className="login-page__footer" aria-label="로그인 및 안내">
        <div className="login-page__actions">
          <KakaoLoginButton />
          <NaverLoginButton />
          <GoogleLoginButton />
        </div>

        <button
          type="button"
          className="login-page__guest-link"
          onClick={handleGuestBrowse}
        >
          로그인 하지 않고 둘러보기
        </button>

        <p className="login-page__notice">
          로그인 하시면{' '}
          <a href="/privacy" className="login-page__notice-link">
            개인정보방침처리
          </a>
          {' '}및{' '}
          <a href="/terms" className="login-page__notice-link">
            이용약관
          </a>
          에 동의하는 것으로 간주됩니다
        </p>
      </section>
    </div>
  );
}
