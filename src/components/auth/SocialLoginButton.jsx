import googleIcon from '../../assets/icons/google.svg';
import kakaoIcon from '../../assets/icons/kakao.svg';
import naverIcon from '../../assets/icons/naver.svg';
import './SocialLoginButton.css';

const PROVIDER_CONFIG = {
  kakao: {
    className: 'social-login-button--kakao',
    label: '카카오 로그인',
    icon: kakaoIcon,
  },
  naver: {
    className: 'social-login-button--naver',
    label: '네이버 로그인',
    icon: naverIcon,
  },
  google: {
    className: 'social-login-button--google',
    label: '구글 로그인',
    icon: googleIcon,
  },
};

/**
 * 소셜 로그인 공통 버튼 컴포넌트.
 */
export default function SocialLoginButton({ provider, onClick }) {
  const config = PROVIDER_CONFIG[provider];

  if (!config) {
    return null;
  }

  return (
    <button
      type="button"
      className={`social-login-button ${config.className}`}
      onClick={onClick}
    >
      <img
        className="social-login-button__icon"
        src={config.icon}
        alt=""
        width={24}
        height={24}
      />
      <span className="social-login-button__label">{config.label}</span>
    </button>
  );
}
