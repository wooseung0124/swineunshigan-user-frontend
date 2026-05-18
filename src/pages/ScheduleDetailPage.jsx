import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SCHEDULE_CATEGORY_LABEL, SCHEDULE_STATUS_LABEL } from '../types/types';
import { api } from '../api/api';
import QRDisplay from '../components/auth/QRDisplay';
import QRScanner from '../components/auth/QRScanner';

const STATUS_COLOR = {
  PENDING: '#FEE500',
  IN_PROGRESS: '#2196F3',
  COMPLETED: '#4CAF50',
  CANCELED: '#ff3b30',
};

// 매칭 인증 활성화 임계값: 약속 시각 2시간 전부터 활성
const MATCH_AUTH_ACTIVATE_BEFORE_MS = 2 * 60 * 60 * 1000;

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

// "n시간 m분" 형식으로 남은 시간 포맷
const formatRemaining = (ms) => {
  if (ms <= 0) return '0분';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

export default function ScheduleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // QR 인증 관련 상태
  const [verifications, setVerifications] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState(null); // { type: 'success'|'error', text }

  // 매칭 인증 활성화 판단을 위해 1분마다 리렌더 트리거
  const [, setTick] = useState(0);

  // 일정 상세 + 인증 기록 로드
  const loadAll = useCallback(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      api.schedules.detail(id),
      api.schedules.verifications(id).catch(() => []),
    ])
      .then(([data, verifs]) => {
        if (!alive) return;
        if (!data) {
          setError('일정을 찾을 수 없습니다.');
          return;
        }
        setSchedule(data);
        setVerifications(verifs || []);
      })
      .catch(err => {
        if (alive) setError(err.message || '일정 조회 실패');
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  useEffect(() => loadAll(), [loadAll]);

  // 매칭 인증 활성화 라이브 갱신 (1분마다)
  useEffect(() => {
    if (!schedule) return;
    const timer = setInterval(() => setTick(t => t + 1), 60 * 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ color: '#ff3b30', marginBottom: '16px' }}>{error || '일정 정보가 없습니다.'}</p>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          돌아가기
        </button>
      </div>
    );
  }

  const isOwner = schedule.myRole === 'CREATOR';
  const isCancelled = schedule.status === 'CANCELED';
  const isCompleted = schedule.status === 'COMPLETED';
  const creator = schedule.participants?.find(p => p.role === 'CREATOR');

  // 매칭 인증 활성화 계산
  const appointmentMs = new Date(schedule.dateTime).getTime();
  const msUntilAppointment = appointmentMs - Date.now();
  const isMatchAuthActive =
    !isCancelled && !isCompleted &&
    msUntilAppointment <= MATCH_AUTH_ACTIVATE_BEFORE_MS;

  // "나" 식별: myRole과 일치하는 participant 중 첫 번째
  // (실서비스에서는 authStore.user.id로 매칭하지만 mock 단계에선 myRole 기반)
  const me = schedule.participants?.find(p => p.role === schedule.myRole);
  const myUserId = me?.userId;

  // 내가 이미 인증되었는지 (PARTICIPANT용)
  const meVerified = verifications.some(v => v.verifiedUserId === myUserId);

  // QR 스캔 성공 핸들러 (CREATOR용)
  const handleScanSuccess = useCallback(async (payload) => {
    setScannerOpen(false);
    setVerifyMessage(null);
    try {
      const result = await api.schedules.verifyQR(id, payload);
      const name = result?.participant?.user?.name || '참여자';
      setVerifyMessage({ type: 'success', text: `${name}님 인증 완료` });
      // 인증 목록 갱신
      const fresh = await api.schedules.verifications(id);
      setVerifications(fresh || []);
    } catch (err) {
      setVerifyMessage({ type: 'error', text: err.message || '인증 실패' });
    }
  }, [id]);

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
            개설자: {creator?.user?.name}
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
            {SCHEDULE_STATUS_LABEL[schedule.status]}
          </span>
          <span style={{ color: '#666', fontSize: '13px' }}>
            {isOwner ? '👑 개설자' : '참여자'}
          </span>
        </div>

        {/* 방 제목 */}
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
          {schedule.title}
        </h2>

        {/* === 매칭 인증 섹션 === */}
        {!isCancelled && !isCompleted && (
          <div style={{
            border: `2px solid ${isMatchAuthActive ? '#A8DC4F' : '#eee'}`,
            background: isMatchAuthActive ? '#A8DC4F10' : '#fafafa',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            transition: 'all 0.2s',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>{isMatchAuthActive ? '🟢' : '🔒'}</span>
              <span style={{
                fontSize: '15px',
                fontWeight: '700',
                color: isMatchAuthActive ? '#5DA80E' : '#888',
              }}>
                매칭 인증 {isMatchAuthActive ? '활성화' : '대기'}
              </span>
            </div>

            {isMatchAuthActive ? (
              <>
                <p style={{ color: '#333', fontSize: '13px', lineHeight: '20px', marginBottom: '12px' }}>
                  {isOwner
                    ? '참여자의 QR 코드를 스캔해서 만남을 인증해주세요.'
                    : '아래 QR 코드를 개설자에게 보여주세요.'}
                </p>

                {/* 결과 메시지 */}
                {verifyMessage && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: verifyMessage.type === 'success' ? '#A8DC4F20' : '#ff3b3020',
                    color: verifyMessage.type === 'success' ? '#5DA80E' : '#ff3b30',
                  }}>
                    {verifyMessage.type === 'success' ? '✅ ' : '⚠️ '}{verifyMessage.text}
                  </div>
                )}

                {/* 개설자 → 스캐너 / 참여자 → QR 표시 */}
                {isOwner ? (
                  <>
                    {scannerOpen ? (
                      <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onClose={() => setScannerOpen(false)}
                      />
                    ) : (
                      <button
                        onClick={() => { setScannerOpen(true); setVerifyMessage(null); }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: '#A8DC4F',
                          color: '#000',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        📷 QR 스캔 시작
                      </button>
                    )}

                    {/* 인증된 참여자 목록 */}
                    {verifications.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                          인증 완료 ({verifications.length}명)
                        </div>
                        {verifications.map(v => {
                          const p = schedule.participants?.find(pp => pp.userId === v.verifiedUserId);
                          return (
                            <div key={v.id} style={{
                              fontSize: '12px',
                              color: '#5DA80E',
                              padding: '4px 0',
                            }}>
                              ✅ {p?.user?.name || `userId:${v.verifiedUserId}`}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  myUserId != null ? (
                    <QRDisplay
                      scheduleId={schedule.id}
                      userId={myUserId}
                      verified={meVerified}
                    />
                  ) : (
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      참여자 정보를 찾을 수 없습니다.
                    </div>
                  )
                )}
              </>
            ) : (
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '20px' }}>
                약속 시각 2시간 전부터 활성화됩니다.<br />
                <span style={{ color: '#999', fontSize: '12px' }}>
                  남은 시간: 약 {formatRemaining(msUntilAppointment - MATCH_AUTH_ACTIVATE_BEFORE_MS)} 뒤 활성화
                </span>
              </p>
            )}
          </div>
        )}

        {/* 장소 정보 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📍 장소</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {schedule.place?.name}
          </div>
          <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>{schedule.place?.address}</div>
          {schedule.place?.contact && (
            <div style={{ color: '#666', fontSize: '13px' }}>📞 {schedule.place.contact}</div>
          )}
        </div>

        {/* 약속 시간 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📅 약속 시간</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600' }}>
            {formatDateTime(schedule.dateTime)}
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
            {SCHEDULE_CATEGORY_LABEL[schedule.category]}
          </span>
        </div>

        {/* 활동 계획 */}
        {schedule.description && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>📝 활동 계획</div>
            <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>
              {schedule.description}
            </div>
          </div>
        )}

        {/* 인원 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>👥 모집 인원</div>
          <div style={{ color: '#000', fontSize: '16px', fontWeight: '600' }}>
            {schedule.currentParticipants}/{schedule.maxParticipants}명
          </div>
        </div>

        {/* 참여자 목록 */}
        {schedule.participants?.length > 0 && (
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
                  {p.user?.name?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#000', fontSize: '14px', fontWeight: '600' }}>
                    {p.user?.name} {p.role === 'CREATOR' && '👑'}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{p.profile?.mbti}</div>
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
        )}

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
