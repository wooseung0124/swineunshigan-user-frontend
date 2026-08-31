import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/mypage-back.png';
import notifyIcon from '../assets/icons/mypage-notify.png';
import profileDefaultIcon from '../assets/icons/mypage-profile-default.png';
import './MyPage.css';

const MENU_ITEMS = [
  { id: 'notice', label: '공지사항' },
  { id: 'terms', label: '이용약관 및 정책' },
  { id: 'payments', label: '결제내역' },
  { id: 'settings', label: '설정' },
];

function ChevronIcon() {
  return (
    <svg
      className="mypage__chevron"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 5 12.5 10 7.5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getDisplayName() {
  if (sessionStorage.getItem('guest') === 'true') {
    return '게스트';
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') ?? 'null');
    return user?.name || user?.nickname || '이주영';
  } catch {
    return '이주영';
  }
}

export default function MyPage() {
  const navigate = useNavigate();
  const displayName = useMemo(() => getDisplayName(), []);

  const handleMenuClick = (itemId) => {
    alert(`${MENU_ITEMS.find((item) => item.id === itemId)?.label} 페이지 연결 예정`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('guest');
    navigate('/', { replace: true });
  };

  return (
    <div className="mypage">
      <header className="mypage__header">
        <button
          type="button"
          className="mypage__header-btn"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" />
        </button>

        <h1 className="mypage__title">마이페이지</h1>

        <button
          type="button"
          className="mypage__header-btn"
          onClick={() => alert('알림 목록 페이지 연결 예정')}
          aria-label="알림"
        >
          <img src={notifyIcon} alt="" />
        </button>
      </header>

      <button
        type="button"
        className="mypage__profile"
        onClick={() => alert('프로필 상세 페이지 연결 예정')}
      >
        <img className="mypage__avatar" src={profileDefaultIcon} alt="" />
        <span className="mypage__name">{displayName}</span>
        <ChevronIcon />
      </button>

      <div className="mypage__divider mypage__divider--thick" aria-hidden="true" />

      <nav className="mypage__menu" aria-label="마이페이지 메뉴">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mypage__menu-item"
            onClick={() => handleMenuClick(item.id)}
          >
            <span className="mypage__menu-label">{item.label}</span>
            <ChevronIcon />
          </button>
        ))}

        <div className="mypage__divider mypage__divider--thin" aria-hidden="true" />

        <button type="button" className="mypage__menu-item mypage__menu-item--logout" onClick={handleLogout}>
          <span className="mypage__menu-label">로그아웃</span>
        </button>
      </nav>

      <div className="mypage__spacer" aria-hidden="true" />
    </div>
  );
}
