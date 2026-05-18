import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// QR 만료 시간 (mockDb.schedules.verifyQR과 일치)
const QR_TTL_MS = 5 * 60 * 1000;
// QR 자동 재발급 주기 (만료 30초 전)
const QR_REFRESH_MS = QR_TTL_MS - 30 * 1000;

/**
 * 참여자가 보여주는 QR 코드.
 * - 일정과 본인 식별 정보를 QR로 인코딩
 * - 5분마다 자동 재발급 (replay 공격 방지)
 *
 * @param {Object} props
 * @param {number} props.scheduleId
 * @param {number} props.userId - 본인 userId (스케줄의 participants에서 매칭됨)
 * @param {boolean} [props.verified] - 이미 인증 완료된 경우 true
 */
export default function QRDisplay({ scheduleId, userId, verified = false }) {
  const [payload, setPayload] = useState(() => buildPayload(scheduleId, userId));
  const [, setTick] = useState(0);

  // QR 자동 재발급
  useEffect(() => {
    if (verified) return;
    const timer = setInterval(() => {
      setPayload(buildPayload(scheduleId, userId));
    }, QR_REFRESH_MS);
    return () => clearInterval(timer);
  }, [scheduleId, userId, verified]);

  // 1초마다 남은 시간 갱신
  useEffect(() => {
    if (verified) return;
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [verified]);

  if (verified) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '24px',
        background: '#A8DC4F20',
        borderRadius: '12px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#5DA80E' }}>
          인증 완료
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          개설자가 QR을 확인했어요
        </div>
      </div>
    );
  }

  const secondsLeft = Math.max(
    0,
    Math.floor((payload.issuedAt + QR_TTL_MS - Date.now()) / 1000)
  );

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      background: '#fff',
      borderRadius: '12px',
    }}>
      <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
        개설자에게 이 QR을 보여주세요
      </div>

      <div style={{
        display: 'inline-block',
        padding: '16px',
        background: '#fff',
        border: '2px solid #A8DC4F',
        borderRadius: '12px',
      }}>
        <QRCodeSVG
          value={JSON.stringify(payload)}
          size={200}
          level="M"
          includeMargin={false}
        />
      </div>

      <div style={{
        marginTop: '12px',
        fontSize: '12px',
        color: secondsLeft <= 30 ? '#ff3b30' : '#888',
        fontWeight: secondsLeft <= 30 ? '600' : '400',
      }}>
        ⏱ {secondsLeft}초 후 자동 재발급
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// QR 페이로드 빌더
// -------------------------------------------------------------
function buildPayload(scheduleId, userId) {
  return {
    scheduleId,
    userId,
    issuedAt: Date.now(),
    nonce: Math.random().toString(36).slice(2, 10),
  };
}
