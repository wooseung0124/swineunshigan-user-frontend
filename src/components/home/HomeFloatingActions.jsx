import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMySchedules } from '../../api/schedules';
import { resolveFloatingScheduleState } from '../../utils/floatingSchedule';
import { createLogger } from '../../utils/logger';
import './HomeFloatingActions.css';

const log = createLogger('HomeFloatingActions');
const HIDDEN = { visible: false, qrEnabled: false, activeSchedule: null };

function canUseFloating() {
  return Boolean(localStorage.getItem('token')) && sessionStorage.getItem('guest') !== 'true';
}

/**
 * 당일 일정 1시간 전 구간에 노출되는 QR/이동소식 플로팅 액션입니다.
 * @param {{ onAfterPermission?: () => void }} props
 */
export default function HomeFloatingActions({ onAfterPermission }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [state, setState] = useState(HIDDEN);
  const enabled = canUseFloating();

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;

    const load = async () => {
      try {
        const schedules = await fetchMySchedules();
        if (cancelled) return;
        setState(resolveFloatingScheduleState(schedules));
      } catch (error) {
        log.warn('schedule load failed', error);
      }
    };

    load();
    const timer = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled]);

  if (!enabled || !state.visible) return null;

  const requestPermissionThen = (action) => {
    setPermissionOpen(true);
    window.__homeFloatingPendingAction = action;
  };

  const confirmPermission = () => {
    setPermissionOpen(false);
    onAfterPermission?.();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => log.info('location permission granted'),
        (error) => log.warn('location permission denied', error),
        { timeout: 5000 },
      );
    }

    const action = window.__homeFloatingPendingAction;
    window.__homeFloatingPendingAction = null;
    action?.();
  };

  return (
    <div className="home-floating">
      {open && (
        <div className="home-floating__menu" role="menu">
          <button
            type="button"
            className="home-floating__menu-item"
            role="menuitem"
            onClick={() =>
              requestPermissionThen(() =>
                navigate('/move-news', { state: { schedule: state.activeSchedule } }),
              )
            }
          >
            멤버 이동소식
          </button>
          <button
            type="button"
            className="home-floating__menu-item"
            role="menuitem"
            disabled={!state.qrEnabled}
            onClick={() =>
              requestPermissionThen(() =>
                navigate('/verify', {
                  state: { mode: 'scan', schedule: state.activeSchedule },
                }),
              )
            }
          >
            QR 촬영{!state.qrEnabled ? ' (30분 전)' : ''}
          </button>
          <button
            type="button"
            className="home-floating__menu-item"
            role="menuitem"
            disabled={!state.qrEnabled}
            onClick={() =>
              requestPermissionThen(() =>
                navigate('/verify', {
                  state: { mode: 'show', schedule: state.activeSchedule },
                }),
              )
            }
          >
            QR 인증{!state.qrEnabled ? ' (30분 전)' : ''}
          </button>
        </div>
      )}

      <button
        type="button"
        className="home-floating__fab"
        aria-expanded={open}
        aria-label="일정 인증 메뉴"
        onClick={() => setOpen((prev) => !prev)}
      >
        +
      </button>

      {permissionOpen && (
        <div className="home-floating__dialog" role="dialog" aria-modal="true" aria-labelledby="loc-perm-title">
          <div className="home-floating__dialog-card">
            <h3 id="loc-perm-title">위치 권한이 필요합니다.</h3>
            <p>인증·이동 소식 기능을 위해 위치 권한을 허용해 주세요.</p>
            <div className="home-floating__dialog-actions">
              <button type="button" onClick={() => setPermissionOpen(false)}>
                취소
              </button>
              <button type="button" className="home-floating__dialog-confirm" onClick={confirmPermission}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
