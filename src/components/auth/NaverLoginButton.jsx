export default function NaverLoginButton() {
    const handleNaverLogin = () => {
      const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
      const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI);
      const state = crypto.randomUUID();
  
      sessionStorage.setItem('naver_oauth_state', state);
  
      const url =
        `https://nid.naver.com/oauth2.0/authorize` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&state=${state}`;
  
      window.location.href = url;
    };
  
    return (
      <button
        onClick={handleNaverLogin}
        style={{
          width: '100%',
          maxWidth: '360px',
          height: '48px',
          background: '#03C75A',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        네이버로 시작하기
      </button>
    );
  }