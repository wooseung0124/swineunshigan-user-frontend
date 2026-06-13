import { SCHEDULE_CATEGORY_LABEL, SCHEDULE_STATUS_LABEL } from '../../types/types';

const STATUS_COLOR = {
  PENDING: '#FEE500',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELED: '#ff3b30',
};

export default function ScheduleCard({
  schedule,
  onClick,
  // 편집 모드 props (안 넘기면 기존 동작과 동일)
  editMode = false,
  selectable = false,
  selecting = false, // ○ 단계 (선택됐지만 아직 ✓ 전)
  selected = false,  // ✓ 단계
}) {
  // 편집 모드 + 아직 이 카드가 선택 안 됨 → 흐림
  const dimmed = editMode && !selecting && !selected;
  // 체크 자리 노출 여부 (선택돼서 ○ 또는 ✓ 상태)
  const showCheck = editMode && selectable && (selecting || selected);

  return (
    <div
      onClick={() => onClick?.(schedule)}
      style={{
        padding: '16px',
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '12px',
        marginBottom: '12px',
        cursor: 'pointer',
        // 기존엔 취소면 0.6이었는데, 편집모드에선 dim 로직이 우선
        opacity: editMode ? (dimmed ? 0.35 : 1) : (schedule.status === 'CANCELED' ? 0.6 : 1),
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

      {/* 제목 줄: 체크 자리 + 제목 (선택되면 체크 크기만큼 옆으로 밀림) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        {showCheck && (
          <span style={{
            flexShrink: 0,
            width: '22px', height: '22px', borderRadius: '50%',
            border: selected ? 'none' : '2px solid #ccc',
            background: selected ? '#A8DC4F' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: '700',
          }}>
            {selected ? '✓' : ''}
          </span>
        )}
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>
          {schedule.title}
        </h3>
      </div>

      <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
        📍 {schedule.place?.name}
      </p>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
        📅 {schedule.scheduledAt}
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
  );
}