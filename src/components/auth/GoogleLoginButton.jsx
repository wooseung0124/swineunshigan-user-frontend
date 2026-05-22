import { buildOAuthUrl } from '../../config/oauth';
import googleIcon from '../../assets/icons/google.svg';

// 구글 OAuth 버튼
// ※ Google Cloud Console에 OAuth 클라이언트 등록 후
//    .env에 VITE_GOOGLE_CLIENT_ID / VITE_GOOGLE_REDIRECT_URI 추가 필요
export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = buildOAuthUrl('google');
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        width: '100%',
        maxWidth: '360px',
        height: '46px',
        background: '#F2F2F2',
        color: 'var(--color-text)',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
      }}
    >
      <img
        src={googleIcon}
        alt=""
        style={{
          width: '24px',
          height: '24px',
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      구글 로그인
    </button>
  );
}
