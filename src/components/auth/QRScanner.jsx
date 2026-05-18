import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ELEMENT_ID = 'qr-scanner-region';

/**
 * 개설자가 참여자 QR을 스캔하는 컴포넌트.
 * - 카메라 권한 필요 (HTTPS 또는 localhost)
 * - QR 디코딩 → JSON 파싱 → onScanSuccess(payload) 호출
 * - 부모(ScheduleDetailPage)에서 api.schedules.verifyQR 호출
 *
 * @param {Object} props
 * @param {(payload: Object) => void} props.onScanSuccess - 스캔 성공 콜백
 * @param {() => void} props.onClose - 스캐너 닫기
 */
export default function QRScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let alive = true;
    let scanner = null;

    const start = async () => {
      try {
        scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' }, // 후면 카메라 우선
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
          },
          (decodedText) => {
            // 스캔 성공 → 한 번만 처리하고 멈춤
            if (!alive) return;
            let payload;
            try {
              payload = JSON.parse(decodedText);
            } catch {
              setError('QR 형식이 올바르지 않습니다.');
              return;
            }
            // 스캐너 정지 후 콜백
            scanner.stop().catch(() => {}).finally(() => {
              if (alive) onScanSuccess(payload);
            });
          },
          () => {
            // 디코딩 실패 프레임 — 무시 (계속 스캔)
          }
        );

        if (alive) setStarting(false);
      } catch (err) {
        if (!alive) return;
        const msg = err?.message || String(err);
        // 사용자 거부 / 권한 없음 / 카메라 없음 등
        setError(`카메라를 시작할 수 없습니다: ${msg}`);
        setStarting(false);
      }
    };

    start();

    return () => {
      alive = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess]);

  return (
    <div style={{
      padding: '16px',
      background: '#fff',
      borderRadius: '12px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>
          참여자 QR을 카메라에 비춰주세요
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#888',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      </div>

      <div
        id={SCANNER_ELEMENT_ID}
        style={{
          width: '100%',
          minHeight: '240px',
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />

      {starting && !error && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
          카메라 준비 중...
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#ff3b3020',
          color: '#ff3b30',
          fontSize: '13px',
          borderRadius: '8px',
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
