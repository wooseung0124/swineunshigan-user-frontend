import SocialLoginButton from './SocialLoginButton';
import { clearClientAuthState } from '../../utils/authSession';
import { resolveOAuthRedirectUri } from '../../utils/oauthRedirect';

export default function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    clearClientAuthState();

    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      resolveOAuthRedirectUri('/auth/kakao/callback', import.meta.env.VITE_KAKAO_REDIRECT_URI),
    );

    const url =
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&prompt=login`;

    window.location.href = url;
  };

  return <SocialLoginButton provider="kakao" onClick={handleKakaoLogin} />;
}
