import { useNavigate, useLocation, useParams } from 'react-router-dom';

const DUMMY_DETAIL = {
  id: 1,
  title: '성수동 스터디 모임',
  placeName: '맞스터치 성수역점',
  address: '서울 성동구 성수동2가 289-10',
  phone: '02-1234-5678',
  date: '2026-04-28',
  time: '14:00',
  category: '스터디',
  activityPlan: '각자 공부할 자료를 가져와서 조용히 작업하는 모임입니다. 중간에 짧은 휴식 시간도 있어요.',
  maxParticipants: 4,
  currentParticipants: 2,
  status: 'waiting',
  role: 'owner',
  participants: [
    { id: 1, name: '김진우', mbti: 'INFP', isOwner: true },
    { id: 2, name: '이수민', mbti: 'ENFJ', isOwner: false },
  ],
};

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

export default function ScheduleDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const schedule = location.state?.schedule || DUMMY_DETAIL;
  const isOwner = schedule.role === 'owner';
  const isCancelled = schedule.status === 'cancelled';

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}>
        <button
            onClick={() => navigate(-1)}
            style={{
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                fontWeight: '700',
                color: '#000',
                cursor: 'pointer',
                padding: '4px 8px',
            }}
            >
            ←
            </button>
        <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#000' }}>일정 상세</h1>
      </div>

      {/* 취소된 경우 안내 */}
      {isCancelled && (
        <div style={{
          background: '#ff3b3020',
          padding: '16px',
          margin: '16px',
          borderRadius: '12px',
        }}>
          <div style={{ color: '#ff3b30', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
            이 일정은 취소되었습니다
          </div>
          <div style={{ color: '#ff8a85', fontSize: '13px' }}>
            개설자: {schedule.participants[0].name}
          </div>
        </div>
      )}

      {/* 장소 이미지 영역 */}
      <div style={{
        height: '200px',
        background: '#f5f5f5',
        margin: '16px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '60px',
      }}>
        📍
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* 상태 + 역할 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            background: STATUS_COLOR[schedule.status] + '20',
            color: STATUS_COLOR[schedule.status],
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {STATUS_MAP[schedule.status]}
          </span>
          <span style={{ color: '#666', fontSize: '13px' }}>
            {isOwner ? '👑 개설자' : '참여자'}
          </span>
        </div>

        {/* 방 제목 */}
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
          {schedule.title}
        </h2>

        {/* 장소 정보 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📍 장소</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {schedule.placeName}
          </div>
          <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>{schedule.address}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>📞 {schedule.phone}</div>
        </div>

        {/* 약속 시간 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📅 약속 시간</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600' }}>
            {schedule.date} {schedule.time}
          </div>
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>🏷️ 카테고리</div>
          <span style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: '#f5f5f5',
            borderRadius: '12px',
            color: '#5DA80E',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {schedule.category}
          </span>
        </div>

        {/* 활동 계획 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📝 활동 계획</div>
          <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>
            {schedule.activityPlan}
          </div>
        </div>

        {/* 인원 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>👥 모집 인원</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600' }}>
            {schedule.currentParticipants}/{schedule.maxParticipants}명
          </div>
        </div>

        {/* 참여자 목록 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>참여자</div>
          {schedule.participants.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '12px',
                marginBottom: '8px',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#A8DC4F',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: '700',
                color: '#000',
              }}>
                {p.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#000', fontSize: '14px', fontWeight: '600' }}>
                  {p.name} {p.isOwner && '👑'}
                </div>
                <div style={{ color: '#888', fontSize: '12px' }}>{p.mbti}</div>
              </div>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#5DA80E',
                fontSize: '13px',
                cursor: 'pointer',
              }}>
                더보기
              </button>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        {!isCancelled && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              disabled={!isOwner}
              style={{
                flex: 1,
                padding: '14px',
                background: isOwner ? '#A8DC4F' : '#eee',
                color: isOwner ? '#000' : '#999',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: isOwner ? 'pointer' : 'not-allowed',
              }}
            >
              수정하기
            </button>
            <button
              disabled={!isOwner}
              style={{
                flex: 1,
                padding: '14px',
                background: '#fff',
                color: isOwner ? '#ff3b30' : '#999',
                border: `1px solid ${isOwner ? '#ff3b30' : '#eee'}`,
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: isOwner ? 'pointer' : 'not-allowed',
              }}
            >
              취소하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}