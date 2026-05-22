import { buildOAuthUrl } from '../../config/oauth';
import naverIcon from '../../assets/icons/naver.svg';

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
          height: '46px',
          background: '#03A94D',
          color: 'var(--color-background)',
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
          src={naverIcon}
          alt=""
          style={{
            width: '18px',
            height: '18px',
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        네이버 로그인
      </button>
    );
  }