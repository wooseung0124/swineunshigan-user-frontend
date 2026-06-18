import { buildOAuthUrl } from '../../config/oauth';
import kakaoIcon from '../../assets/icons/kakao.svg';

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
          height: '46px',
          background: '#FEE500',
          color: 'var(--color-text)',
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
          src={kakaoIcon}
          alt=""
          style={{
            width: '24px',
            height: '24px',
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        카카오 로그인
      </button>
    );
  }