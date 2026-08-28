import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  { label: '홈', path: '/home' },
  { label: '일정', path: '/schedule' },
  { label: '큐레이션', path: '/curation' },
  { label: '마이', path: '/mypage' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <button
            key={tab.path}
            type="button"
            className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
