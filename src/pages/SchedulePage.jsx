import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 임시 더미 데이터
const DUMMY_SCHEDULES = [
  {
    id: 1,
    title: '성수동 스터디 모임',
    placeName: '맞스터치 성수역점',
    address: '서울 성동구 성수동2가',
    date: '2026-04-28',
    time: '14:00',
    category: '스터디',
    maxParticipants: 4,
    currentParticipants: 2,
    status: 'waiting',
    role: 'owner',
  },
  {
    id: 2,
    title: '점심 같이 먹어요',
    placeName: '서울숲 카페',
    address: '서울 성동구 서울숲길',
    date: '2026-04-29',
    time: '12:00',
    category: '식사',
    maxParticipants: 3,
    currentParticipants: 3,
    status: 'waiting',
    role: 'participant',
  },
  {
    id: 3,
    title: '독서 모임',
    placeName: '성수 북카페',
    address: '서울 성동구 연무장길',
    date: '2026-04-25',
    time: '10:00',
    category: '문화활동',
    maxParticipants: 4,
    currentParticipants: 4,
    status: 'completed',
    role: 'participant',
  },
  {
    id: 4,
    title: '운동 같이 해요',
    placeName: '성수 체육관',
    address: '서울 성동구 성수일로',
    date: '2026-04-24',
    time: '09:00',
    category: '스포츠',
    maxParticipants: 4,
    currentParticipants: 2,
    status: 'cancelled',
    role: 'owner',
  },
];

const STATUS_MAP = {
  waiting: '대기중',
  completed: '완료됨',
  cancelled: '취소됨',
};

const STATUS_COLOR = {
  waiting: '#FEE500',
  completed: '#4CAF50',
  cancelled: '#ff3b30',
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  let filtered = DUMMY_SCHEDULES.filter(s => {
    if (typeFilter === 'owner' && s.role !== 'owner') return false;
    if (typeFilter === 'participant' && s.role !== 'participant') return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
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
          <button onClick={() => setStatusFilter('waiting')} style={chipStyle(statusFilter === 'waiting')}>대기중</button>
          <button onClick={() => setStatusFilter('completed')} style={chipStyle(statusFilter === 'completed')}>완료</button>
          <button onClick={() => setStatusFilter('cancelled')} style={chipStyle(statusFilter === 'cancelled')}>취소</button>
        </div>
      </div>

      {/* 일정 리스트 */}
      <div style={{ padding: '0 16px 20px' }}>
        {filtered.length === 0 ? (
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
              {schedule.status === 'cancelled' && (
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
                  {STATUS_MAP[schedule.status]}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {schedule.role === 'owner' ? '개설자' : '참여자'}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px', color: '#000' }}>
                {schedule.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                📍 {schedule.placeName}
              </p>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                📅 {schedule.date} {schedule.time}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#f5f5f5',
                  color: '#666',
                }}>
                  {schedule.category}
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