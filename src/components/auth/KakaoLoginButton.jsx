import { buildOAuthUrl } from '../../config/oauth';

export default function KakaoLoginButton() {
    const handleKakaoLogin = () => {
      window.location.href = buildOAuthUrl('kakao');
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