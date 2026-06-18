export default function KakaoLoginButton() {
    const handleKakaoLogin = () => {
      const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI);
  
      const url =
        `https://kauth.kakao.com/oauth/authorize` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${redirectUri}`;
  
      window.location.href = url;
    };
  
    return (
      <button
        onClick={handleKakaoLogin}
        style={{
          width: '100%',
          maxWidth: '360px',
          height: '48px',
          background: '#FEE500',
          color: '#000',
          border: 'none',
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
        카카오로 시작하기
      </button>
    );
  }