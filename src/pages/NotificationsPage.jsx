import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'schedule_cancelled',
    title: '일정이 취소되었습니다',
    body: '맞스터치 성수역점 - 점심 같이 먹어요 일정이 취소되었습니다.',
    time: '5분 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'schedule_joined',
    title: '새로운 참여자가 들어왔어요',
    body: '이수민님이 \'성수동 스터디 모임\'에 참여했습니다.',
    time: '1시간 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'schedule_reminder',
    title: '약속 시간이 다가오고 있어요',
    body: '독서 모임 시작까지 1시간 남았습니다.',
    time: '3시간 전',
    isRead: false,
  },
  {
    id: 4,
    type: 'schedule_completed',
    title: '일정이 완료되었습니다',
    body: '서울숲 카페 - 카페 모임이 완료되었습니다.',
    time: '어제',
    isRead: true,
  },
  {
    id: 5,
    type: 'system',
    title: '쉬는시간 서비스 안내',
    body: '새로운 큐레이션 콘텐츠가 등록되었어요. 확인해보세요!',
    time: '3일 전',
    isRead: true,
  },
];

const TYPE_ICON = {
  schedule_cancelled: '❌',
  schedule_joined: '👥',
  schedule_reminder: '⏰',
  schedule_completed: '✅',
  system: '📢',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <h1 style={{ flex: 1, fontSize: '18px', fontWeight: '700', color: '#000' }}>알림</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5DA80E',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 알림 리스트 */}
      <div>
        {notifications.length === 0 ? (
          <div style={{
            padding: '60px 0',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
          }}>
            알림이 없습니다
          </div>
        ) : (
          notifications.map(noti => (
            <div
              key={noti.id}
              onClick={() => handleMarkAsRead(noti.id)}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                borderBottom: '1px solid #eee',
                background: !noti.isRead ? '#f9f9f9' : '#fff',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseOut={e => e.currentTarget.style.background = !noti.isRead ? '#f9f9f9' : '#fff'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {TYPE_ICON[noti.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}>
                  <div style={{
                    flex: 1,
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    {noti.title}
                  </div>
                  {!noti.isRead && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#A8DC4F',
                    }} />
                  )}
                </div>
                <div style={{
                  color: '#666',
                  fontSize: '13px',
                  lineHeight: '18px',
                  marginBottom: '6px',
                }}>
                  {noti.body}
                </div>
                <div style={{ color: '#999', fontSize: '12px' }}>
                  {noti.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}