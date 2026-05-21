import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHEDULE_CATEGORY_LABEL, SCHEDULE_STATUS_LABEL } from '../types/types';
import { api } from '../api/api';

const STATUS_COLOR = {
  PENDING: '#FEE500',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELED: '#ff3b30',
};

// YYYY-MM-DD HH:mm 형식으로 포맷
const formatDateTime = (iso) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState('CREATOR');   // 개설자(CREATOR) / 참여자(PARTICIPANT)
  const [statusFilter, setStatusFilter] = useState('all');  // all / PENDING / CANCELED
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.schedules.list()
      .then(data => { if (alive) setSchedules(data || []); })
      .catch(err => { console.error('[SchedulePage] list 실패', err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // 큰 탭 (개설자 / 참여자) 스타일
  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
    color: isActive ? '#000' : '#999',
    fontSize: '15px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  // 현황 칩 필터 스타일
  const chipStyle = (isActive) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: isActive ? '2px solid #A8DC4F' : '1px solid #ddd',
    background: isActive ? '#A8DC4F20' : '#fff',
    color: isActive ? '#5DA80E' : '#666',
    fontSize: '13px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  // 필터링: role 탭 + 현황 필터
  const filtered = schedules.filter(s => {
    if (s.myRole !== roleTab) return false;
    if (s.status === 'COMPLETED') return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000', textAlign: 'center' }}>일정</h1>
      </div>

      {/* 상단 큰 탭: 개설자 / 참여자 */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
        <button onClick={() => setRoleTab('CREATOR')} style={tabStyle(roleTab === 'CREATOR')}>개설자</button>
        <button onClick={() => setRoleTab('PARTICIPANT')} style={tabStyle(roleTab === 'PARTICIPANT')}>참여자</button>
      </div>

      {/* 현황 필터: 전체 / 모집중 / 취소됨 */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setStatusFilter('all')} style={chipStyle(statusFilter === 'all')}>전체</button>
        <button onClick={() => setStatusFilter('PENDING')} style={chipStyle(statusFilter === 'PENDING')}>모집중</button>
        <button onClick={() => setStatusFilter('CANCELED')} style={chipStyle(statusFilter === 'CANCELED')}>취소됨</button>
      </div>

      {/* 일정 리스트 */}
      <div style={{ padding: '0 16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontSize: '14px' }}>
            일정이 없습니다.
          </div>
        ) : (
          filtered.map(schedule => (
            <div
              key={schedule.id}
              onClick={() => navigate(`/schedule/${schedule.id}`)}
              style={{
                padding: '16px',
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                opacity: schedule.status === 'CANCELED' ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {schedule.status === 'CANCELED' && (
                <div style={{
                  background: '#ff3b3020',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  fontSize: '13px',
                  color: '#ff3b30',
                }}>
                  이 일정은 취소되었습니다.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: STATUS_COLOR[schedule.status] + '20',
                  color: STATUS_COLOR[schedule.status],
                  fontWeight: '600',
                }}>
                  {SCHEDULE_STATUS_LABEL[schedule.status]}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#000' }}>
                {schedule.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                📍 {schedule.place?.name}
              </p>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                📅 {formatDateTime(schedule.dateTime)}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#f5f5f5',
                  color: '#666',
                }}>
                  {SCHEDULE_CATEGORY_LABEL[schedule.category]}
                </span>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  👥 {schedule.currentParticipants}/{schedule.maxParticipants}명
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}