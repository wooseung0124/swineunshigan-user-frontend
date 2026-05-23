import { SCHEDULE_CATEGORY_LABEL, SCHEDULE_STATUS_LABEL } from '../../types/types';

const STATUS_COLOR = {
  PENDING: '#FEE500',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELED: '#ff3b30',
};



export default function ScheduleCard({ schedule, onClick }) {
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