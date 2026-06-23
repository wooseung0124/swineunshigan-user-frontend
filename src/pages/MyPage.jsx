import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/api';
import BellIcon from '../components/icons/BellIcon';

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    api.users.me()
      .then((u) => setUser(u))
      .catch((err) => console.error('마이페이지 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    setLogoutModal(false);
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const menus = [
    { label: '공지사항', to: null },
    { label: '이용약관 및 정책', to: null },
    { label: '결제내역', to: null },
    { label: '설정', to: '/settings' },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>마이페이지</h1>
        <button onClick={() => navigate('/notifications')} style={S.bellBtn} aria-label="알림">
          <BellIcon size={22} color="var(--color-text)" />
        </button>
      </div>

      <button onClick={() => navigate('/profile')} style={S.profileRow}>
        <div style={S.avatar}>
          {user.profileImageUrl
            ? <img src={user.profileImageUrl} alt="프로필" style={S.avatarImg} />
            : <PersonIcon />}
        </div>
        <span style={S.profileName}>{user.name ? `${user.name}님` : '-'}</span>
        <span style={S.chevron}>›</span>
      </button>

      <div style={S.divider} />

      <div style={S.menuList}>
        {menus.map((m) => (
          <button
            key={m.label}
            onClick={m.to ? () => navigate(m.to) : undefined}
            disabled={!m.to}
            style={{ ...S.menuItem, cursor: m.to ? 'pointer' : 'default' }}
          >
            <span style={S.menuLabel}>{m.label}</span>
            <span style={S.chevron}>›</span>
          </button>
        ))}
      </div>

      <button onClick={() => setLogoutModal(true)} style={S.logout}>로그아웃</button>

      {logoutModal && (
        <div style={S.overlay} onClick={() => setLogoutModal(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <p style={S.modalText}>로그아웃 하시겠습니까?</p>
            <div style={S.modalBtns}>
              <button onClick={() => setLogoutModal(false)} style={S.cancelBtn}>아니오</button>
              <button onClick={handleLogout} style={S.confirmBtn}>로그아웃 하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-text-light-gray)" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)' },
  center: { minHeight: '100vh', background: 'var(--color-background)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-light)',
  },
  backBtn: {
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-1)',
    fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', cursor: 'pointer',
    width: '28px', padding: 0, lineHeight: 1, textAlign: 'left',
  },
  headerTitle: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', margin: 0,
  },
  bellBtn: {
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-3)',
    cursor: 'pointer', width: '28px', padding: 0, textAlign: 'right',
  },
  profileRow: {
    display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
    width: '100%', padding: 'var(--spacing-5) var(--spacing-4)',
    background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
  },
  avatar: {
    width: '48px', height: '48px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-card-light)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  profileName: {
    flex: 1, fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text)',
  },
  divider: { height: '8px', background: 'var(--color-card-light)' },
  menuList: { padding: '0 var(--spacing-4)' },
  menuItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: 'var(--spacing-4) 0',
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    borderBottom: '1px solid var(--color-border-light)',
    background: 'transparent', textAlign: 'left',
  },
  menuLabel: { fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' },
  chevron: { color: 'var(--color-text-light-gray)', fontSize: 'var(--font-size-heading-3)' },
  logout: {
    display: 'block', padding: 'var(--spacing-5) var(--spacing-4)',
    background: 'transparent', border: 'none',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body-lg)',
    cursor: 'pointer', textAlign: 'left',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    width: '80%', maxWidth: '300px', background: 'var(--color-background)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6) var(--spacing-5) var(--spacing-5)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)', textAlign: 'center',
  },
  modalText: {
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text)', margin: '0 0 var(--spacing-5)',
  },
  modalBtns: { display: 'flex', gap: 'var(--spacing-3)' },
  cancelBtn: {
    flex: 1, padding: 'var(--spacing-3)',
    background: 'var(--color-background)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-base)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: 'var(--spacing-3)',
    background: 'var(--color-primary)', border: 'none',
    borderRadius: 'var(--radius-base)', color: 'var(--color-background)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};