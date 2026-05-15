import { buildOAuthUrl } from '../../config/oauth';

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
        height: '48px',
        background: '#fff',
        color: '#000',
        border: '1px solid #ddd',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <span style={{
        fontFamily: 'sans-serif',
        fontWeight: '700',
        color: '#4285F4',
      }}>
        G
      </span>
      구글로 시작하기
    </button>
  );
}
