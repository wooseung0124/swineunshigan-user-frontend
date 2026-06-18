import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import locationIcon from '../components/icons/위치.svg';
import cameraIcon from '../components/icons/카메라.svg';
import galleryIcon from '../components/icons/갤러리.svg';
import notificationIcon from '../components/icons/알림.svg';

// 권한 항목 (시안 기준 + 요엘님 답: 알림 추가)
const PERMISSIONS = [
  { key: 'location', icon: locationIcon, label: '정보', required: true, desc: '지도 확인, 약속 장소까지의 거리 안내, 주변 일정 추천' },
  { key: 'camera', icon: cameraIcon, label: '카메라', required: true, desc: 'QR 인증 매칭' },
  { key: 'gallery', icon: galleryIcon, label: '갤러리', required: false, desc: '프로필, 일정 개설 및 수정' },
  { key: 'notification', icon: notificationIcon, label: '알림', required: false, desc: '일정 소식과 취소 안내 수신' },
];

function requestLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) { console.log('[권한] geolocation 미지원'); return resolve('unsupported'); }
    navigator.geolocation.getCurrentPosition(
      () => { console.log('[권한] 위치 허용'); resolve('granted'); },
      (err) => { console.log('[권한] 위치 거부/실패:', err.code); resolve('denied'); },
      { timeout: 10000 }
    );
  });
}

async function requestCamera() {
  if (!navigator.mediaDevices?.getUserMedia) { console.log('[권한] getUserMedia 미지원'); return 'unsupported'; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    console.log('[권한] 카메라 허용');
    return 'granted';
  } catch (err) {
    console.log('[권한] 카메라 거부/실패:', err.name);
    return 'denied';
  }
}

async function requestNotification() {
  if (!('Notification' in window)) { console.log('[권한] Notification 미지원'); return 'unsupported'; }
  try {
    const result = await Notification.requestPermission();
    console.log('[권한] 알림:', result);
    return result;
  } catch (err) {
    console.log('[권한] 알림 실패:', err);
    return 'denied';
  }
}

export default function OnboardingPermissionPage({ onClose }) {
    const navigate = useNavigate();
    const [requesting, setRequesting] = useState(false);
  
    const finish = () => {
      if (onClose) onClose();      // 팝업으로 쓰일 때: 그냥 닫기
      else navigate('/home');      // 라우트로 쓰일 때: 메인 이동
    };
  
    const handleAllow = async () => {
      if (requesting) return;
      setRequesting(true);
      await requestLocation();
      await requestCamera();
      await requestNotification();
      finish();
      setRequesting(false);
    };
  
    const handleSkip = () => finish();
    // ... 나머지 동일

  return (
    <div style={S.overlay}>
      <div style={S.box}>
        <button onClick={handleSkip} style={S.closeBtn} aria-label="닫기">✕</button>

        <h2 style={S.title}>편리한 쉬는시간 앱 사용을 위해<br />아래 권한을 허용해주세요</h2>

        <ul style={S.list}>
          {PERMISSIONS.map((p) => (
            <li key={p.key} style={S.item}>
              <div style={S.itemIcon}>
                {p.icon ? <img src={p.icon} alt="" width={28} height={28} /> : <span style={{ fontSize: '22px' }}>🔔</span>}
              </div>
              <div style={S.itemBody}>
                <div style={S.itemHead}>
                  <span style={S.itemLabel}>{p.label}</span>
                  <span style={p.required ? S.tagRequired : S.tagOptional}>
                    ({p.required ? '필수' : '선택'})
                  </span>
                </div>
                <p style={S.itemDesc}>{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <p style={S.notice}>
          허용하지 않아도 앱 이용은 가능하나, 일부 서비스에 이용이 제한될 수 있습니다.
        </p>

        <div style={S.btnRow}>
          <button onClick={handleSkip} style={S.cancelBtn} disabled={requesting}>취소</button>
          <button onClick={handleAllow} style={S.allowBtn} disabled={requesting}>
            {requesting ? '요청 중...' : '허용하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    padding: 'var(--spacing-4)',
  },
  box: {
    position: 'relative', background: 'var(--color-background)',
    borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-6)',
    width: '100%', maxWidth: '340px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  closeBtn: {
    position: 'absolute', top: 'var(--spacing-4)', right: 'var(--spacing-4)',
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-4)',
    color: 'var(--color-text-light-gray)', cursor: 'pointer', padding: 0, lineHeight: 1,
  },
  title: {
    fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', lineHeight: 1.4, margin: 0,
    marginBottom: 'var(--spacing-5)', paddingRight: 'var(--spacing-5)',
  },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' },
  item: { display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start' },
  itemIcon: { flexShrink: 0, width: '28px', display: 'flex', justifyContent: 'center' },
  itemBody: { flex: 1 },
  itemHead: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' },
  itemLabel: { fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' },
  tagRequired: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)' },
  tagOptional: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)' },
  itemDesc: { margin: 0, fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)', lineHeight: 1.4 },
  notice: {
    fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)',
    lineHeight: 1.4, margin: 0, marginTop: 'var(--spacing-5)', marginBottom: 'var(--spacing-4)',
  },
  btnRow: { display: 'flex', gap: 'var(--spacing-2)' },
  cancelBtn: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
  },
  allowBtn: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-primary-500)', background: 'var(--color-primary-500)',
    color: 'var(--color-text-white)', fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};