import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: '홈화면', path: '/home' },
  { label: '일정현황', path: '/schedule' },
  { label: '큐레이션', path: '/curation' },
  { label: '마이페이지', path: '/mypage' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
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
          onClick={() => navigate(tab.path)}
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
  );
}