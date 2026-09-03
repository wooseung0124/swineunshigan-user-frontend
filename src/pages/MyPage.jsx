import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui';
import backIcon from '../assets/icons/mypage-back.png';
import notifyIcon from '../assets/icons/mypage-notify.png';
import profileDefaultIcon from '../assets/icons/signup-profile-default.png';
import { clearClientAuthState } from '../utils/authSession';
import { getUserProfile, isGuestUser, syncUserFromServer } from '../utils/userProfile';
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

export default function MyPage() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profile, setProfile] = useState(() => getUserProfile());
  const isGuest = isGuestUser();
  const displayName = profile.name;
  const avatarSrc = profile.profileImageUrl || profileDefaultIcon;

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      await syncUserFromServer();

      if (isMounted) {
        setProfile(getUserProfile());
      }
    };

    if (!isGuest) {
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [isGuest]);

  const handleMenuClick = (itemId) => {
    alert(`${MENU_ITEMS.find((item) => item.id === itemId)?.label} 페이지 연결 예정`);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    clearClientAuthState();
    setIsLogoutModalOpen(false);
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
        onClick={() => navigate('/mypage/profile')}
      >
        <img className="mypage__avatar" src={avatarSrc} alt="" />
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

        <button
          type="button"
          className="mypage__menu-item mypage__menu-item--logout"
          onClick={handleLogoutClick}
        >
          <span className="mypage__menu-label">로그아웃</span>
        </button>
      </nav>

      <div className="mypage__spacer" aria-hidden="true" />

      <Modal
        isOpen={isLogoutModalOpen}
        title="로그아웃 하시겠습니까?"
        cancelLabel="아니오"
        confirmLabel="로그아웃 하기"
        actionsLayout="row"
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
