import { useEffect, useState } from 'react';
import './PermissionRequestSheet.css';

const ANIMATION_MS = 280;

const PERMISSIONS = [
  {
    id: 'location',
    title: '위치정보(필수)',
    description: '지도 확인, 약속 장소까지의 거리 안내, 주변 일정 추천',
    icon: 'location',
  },
  {
    id: 'camera',
    title: '카메라(필수)',
    description: 'QR 인증 매칭',
    icon: 'camera',
  },
  {
    id: 'gallery',
    title: '갤러리(선택)',
    description: '프로필, 일정 개설 및 수정',
    icon: 'gallery',
  },
];

/**
 * @param {'location'|'camera'|'gallery'} type
 */
function PermissionIcon({ type }) {
  if (type === 'camera') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4.5 8.5h2.2l1.3-2h8l1.3 2H19.5A1.5 1.5 0 0 1 21 10v8.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5V10A1.5 1.5 0 0 1 4.5 8.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === 'gallery') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="10" r="1.6" fill="currentColor" />
        <path
          d="M3.8 16.5 8.5 12l3.2 3.2 2.8-2.8 5.7 4.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6.5-5.2 6.5-11A6.5 6.5 0 0 0 12 3.5 6.5 6.5 0 0 0 5.5 10C5.5 15.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * 앱 권한 안내 바텀시트입니다.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onAllow: () => void,
 * }} props
 */
export default function PermissionRequestSheet({ open, onClose, onAllow }) {
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setEntered(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setEntered(false);
    const timer = window.setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  const sheetClass = entered
    ? 'permission-sheet permission-sheet--open'
    : 'permission-sheet';
  const backdropClass = entered
    ? 'permission-sheet__backdrop permission-sheet__backdrop--open'
    : 'permission-sheet__backdrop';

  return (
    <>
      <button
        type="button"
        className={backdropClass}
        onClick={onClose}
        aria-label="권한 안내 닫기"
      />
      <section className={sheetClass} role="dialog" aria-modal="true" aria-labelledby="permission-sheet-title">
        <h2 id="permission-sheet-title" className="permission-sheet__title">
          편리한 쉬는시간 앱 사용을 위해
          <br />
          아래 권한을 허용해주세요
        </h2>

        <ul className="permission-sheet__list">
          {PERMISSIONS.map((item) => (
            <li key={item.id} className="permission-sheet__item">
              <span className="permission-sheet__icon">
                <PermissionIcon type={item.icon} />
              </span>
              <div className="permission-sheet__text">
                <p className="permission-sheet__item-title">{item.title}</p>
                <p className="permission-sheet__item-desc">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="permission-sheet__note">
          허용하지 않으셔도 앱 이용은 가능하나, 일부 서비스에 이용이 제한이 있을 수 있습니다.
        </p>

        <div className="permission-sheet__actions">
          <button type="button" className="permission-sheet__btn permission-sheet__btn--cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="permission-sheet__btn permission-sheet__btn--allow" onClick={onAllow}>
            허용하기
          </button>
        </div>
      </section>
    </>
  );
}
