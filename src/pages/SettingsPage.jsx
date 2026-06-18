import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuthStore } from '../store/authStore';

// 설정 페이지 (디자인 시안 수령 후 본격 구현 예정)
// 라우트: /settings (로그인 필요)

const MENU_ITEMS = [
  { key: 'location', label: '현재 위치 권한' },
  { key: 'camera', label: '카메라 권한' },
  { key: 'gallery', label: '갤러리 권한' },
  { key: 'logout', label: '로그아웃' },
  { key: 'withdrawal', label: '회원 탈퇴' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleMenuClick = (key) => {
    switch (key) {
      case 'withdrawal':
        navigate('/withdrawal');
        break;
      case 'logout':
        if (confirm('로그아웃 하시겠습니까?')) {
          logout();
          navigate('/');
        }
        break;
      // 권한 항목은 시안/스펙 확정 후 구현
      default:
        break;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text)',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <Button variant="ghost" size="md" onClick={() => navigate(-1)}>←</Button>
        <h1 style={{
          fontSize: 'var(--font-size-heading-3)',
          fontWeight: 'var(--font-weight-bold)',
          margin: 0,
        }}>
          설정
        </h1>
      </header>

      <div style={{ padding: 'var(--spacing-4)' }}>
        <Card padding="sm">
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}>
            {MENU_ITEMS.map((item, idx) => (
              <li
                key={item.key}
                onClick={() => handleMenuClick(item.key)}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-2)',
                  fontSize: 'var(--font-size-body)',
                  cursor: 'pointer',
                  borderBottom: idx === MENU_ITEMS.length - 1
                    ? 'none'
                    : '1px solid var(--color-border-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.label}</span>
                <span style={{ color: 'var(--color-text-light-gray)' }}>›</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
