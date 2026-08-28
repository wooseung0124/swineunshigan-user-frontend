import SocialLoginButton from './SocialLoginButton';

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

  return <SocialLoginButton provider="kakao" onClick={handleKakaoLogin} />;
}
