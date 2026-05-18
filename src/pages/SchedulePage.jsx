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
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const chipStyle = (isActive) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: isActive ? '2px solid #A8DC4F' : '1px solid #ddd',
    background: isActive ? '#A8DC4F20' : '#fff',
    color: isActive ? '#5DA80E' : '#666',
    fontSize: '12px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  let filtered = schedules.filter(s => {
    if (typeFilter === 'owner' && s.myRole !== 'CREATOR') return false;
    if (typeFilter === 'participant' && s.myRole !== 'PARTICIPANT') return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(a.dateTime);
    const dateB = new Date(b.dateTime);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>일정 현황</h1>
      </div>

      {/* 필터 영역 */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#666', minWidth: '40px' }}>정렬</span>
          <button onClick={() => setSortOrder('asc')} style={chipStyle(sortOrder === 'asc')}>오름차순</button>
          <button onClick={() => setSortOrder('desc')} style={chipStyle(sortOrder === 'desc')}>내림차순</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#666', minWidth: '40px' }}>종류</span>
          <button onClick={() => setTypeFilter('all')} style={chipStyle(typeFilter === 'all')}>전체</button>
          <button onClick={() => setTypeFilter('owner')} style={chipStyle(typeFilter === 'owner')}>개설</button>
          <button onClick={() => setTypeFilter('participant')} style={chipStyle(typeFilter === 'participant')}>참여</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#666', minWidth: '40px' }}>현황</span>
          <button onClick={() => setStatusFilter('all')} style={chipStyle(statusFilter === 'all')}>전체</button>
          <button onClick={() => setStatusFilter('PENDING')} style={chipStyle(statusFilter === 'PENDING')}>모집중</button>
          <button onClick={() => setStatusFilter('COMPLETED')} style={chipStyle(statusFilter === 'COMPLETED')}>완료</button>
          <button onClick={() => setStatusFilter('CANCELED')} style={chipStyle(statusFilter === 'CANCELED')}>취소</button>
        </div>
      </div>

      {/* 일정 리스트 */}
      <div style={{ padding: '0 16px 20px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#666',
            fontSize: '14px',
          }}>
            불러오는 중...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#666',
            fontSize: '14px',
          }}>
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
                opacity: schedule.status === 'cancelled' ? 0.6 : 1,
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
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {schedule.myRole === 'CREATOR' ? '개설자' : '참여자'}
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