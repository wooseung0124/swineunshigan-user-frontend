import SocialLoginButton from './SocialLoginButton';

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    const scope = encodeURIComponent('openid email profile');

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = url;
  };

  return <SocialLoginButton provider="google" onClick={handleGoogleLogin} />;
}
