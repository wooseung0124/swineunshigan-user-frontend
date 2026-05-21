import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../../store/authStore';
import { api } from '../../api/api';
import ScheduleCard from '../schedule/ScheduleCard';
import LoginRequiredModal from './LoginRequiredModal';

export default function SlideUpPanel({ place, onClose }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // 장소 변경 시 해당 장소의 일정 fetch
  useEffect(() => {
    if (!place) return;
    let alive = true;
    setLoading(true);
    api.schedules.listByPlace(place.id)
      .then(data => { if (alive) setSchedules(data || []); })
      .catch(err => { console.error('[SlideUpPanel] listByPlace 실패', err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [place]);

  if (!place) return null;

  const handleCardClick = (schedule) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    onClose();
    navigate(`/schedule/${schedule.id}`);
  };

  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    onClose();
    navigate('/create-room', { state: { place } });
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999,
        }}
      />

      {/* 슬라이드 업 패널 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        zIndex: 1000,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out',
      }}>
        {/* 드래그 핸들 */}
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', background: '#ddd', borderRadius: '2px' }} />
        </div>

        {/* 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          {/* 장소 정보 */}
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#000' }}>
            {place.name}
          </h2>
          {place.category?.name && (
            <span style={{ fontSize: '13px', color: '#999', marginBottom: '12px', display: 'block' }}>
              {place.category.name}
            </span>
          )}
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>
            📍 {place.address}
          </p>
          {place.contact && (
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              📞 {place.contact}
            </p>
          )}

          {/* 일정 리스트 헤더 */}
          <div style={{
            borderTop: '1px solid #eee',
            paddingTop: '16px',
            marginTop: '16px',
            marginBottom: '12px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#000' }}>
              일정찾기 <span style={{ color: '#A8DC4F' }}>{schedules.length}</span>
            </h3>
          </div>

          {/* 일정 카드 리스트 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: '13px' }}>
              불러오는 중...
            </div>
          ) : schedules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999', fontSize: '13px' }}>
              아직 만들어진 일정이 없습니다.
            </div>
          ) : (
            schedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClick={() => handleCardClick(schedule)}
              />
            ))
          )}
        </div>

        {/* 하단 고정: 일정 개설하기 버튼 */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', flexShrink: 0 }}>
          <button
            onClick={handleCreateRoom}
            style={{
              width: '100%',
              padding: '14px',
              background: '#A8DC4F',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            일정 개설하기
          </button>
        </div>
      </div>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}