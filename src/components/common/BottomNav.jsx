import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore';
import QRAuthModal from './QRAuthModal';

const tabs = [
  { label: '홈화면', path: '/home' },
  { label: '일정현황', path: '/schedule' },
  { label: '인증하기', path: '__qr__' },        // 특수 경로 (라우팅 X, 모달 트리거)
  { label: '마이페이지', path: '/mypage' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    // 인증하기: QR 모달 열기
    if (tab.path === '__qr__') {
      setQrModalOpen(true);
      return;
    }

    // 마이페이지만 로그인 필요
    if (!isAuthenticated && tab.path === '/mypage') {
      if (confirm('로그인이 필요합니다. 로그인 하시겠습니까?')) {
        navigate('/');
      }
      return;
    }

    navigate(tab.path);
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        borderTop: '1px solid #eee',
        background: '#fff',
        position: 'sticky',
        bottom: 0,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.path}
            onClick={() => handleTabClick(tab)}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: pathname === tab.path ? '700' : '400',
              color: pathname === tab.path ? '#FEE500' : '#888',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <QRAuthModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </>
  );
}