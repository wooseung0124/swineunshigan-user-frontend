import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconProfile,
  IconSchedule,
  IconVerify,
} from './NavIcons';
import './BottomNav.css';

const tabs = [
  { label: '홈', path: '/home', Icon: IconHome },
  { label: '일정', path: '/schedule', Icon: IconSchedule },
  { label: '인증하기', path: '/verify', Icon: IconVerify },
  { label: '마이페이지', path: '/mypage', Icon: IconProfile },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="bottom-nav-shell">
      <nav className="bottom-nav" aria-label="하단 메뉴">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.Icon;

          return (
            <button
              key={tab.path}
              type="button"
              className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="bottom-nav__icon" />
              <span className="bottom-nav__label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="bottom-nav-shell__fill" aria-hidden="true" />
    </div>
  );
}
