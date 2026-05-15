import { buildOAuthUrl } from '../../config/oauth';

export default function NaverLoginButton() {
    const handleNaverLogin = () => {
      window.location.href = buildOAuthUrl('naver');
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