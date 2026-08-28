import SocialLoginButton from './SocialLoginButton';

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

  return <SocialLoginButton provider="naver" onClick={handleNaverLogin} />;
}
