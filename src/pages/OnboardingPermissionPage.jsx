import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 권한 항목 (갤러리는 안내만 — 실제 동작은 요엘님 확인 후)
const PERMISSIONS = [
  { key: 'location', label: '위치', required: true, desc: '내 주변 일정과 장소를 보여드려요' },
  { key: 'camera', label: '카메라', required: true, desc: '약속 장소에서 QR 코드로 인증해요' },
  { key: 'gallery', label: '갤러리', required: false, desc: '프로필 사진을 등록할 때 사용해요' },
];

// 위치 권한 요청
function requestLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      console.log('[권한] geolocation 미지원');
      return resolve('unsupported');
    }
    navigator.geolocation.getCurrentPosition(
      () => { console.log('[권한] 위치 허용'); resolve('granted'); },
      (err) => { console.log('[권한] 위치 거부/실패:', err.code); resolve('denied'); },
      { timeout: 10000 }
    );
  });
}

// 카메라 권한 요청 (받자마자 스트림 정리)
async function requestCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.log('[권한] getUserMedia 미지원');
    return 'unsupported';
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop()); // 권한만 받고 즉시 끔
    console.log('[권한] 카메라 허용');
    return 'granted';
  } catch (err) {
    console.log('[권한] 카메라 거부/실패:', err.name);
    return 'denied';
  }
}

export default function OnboardingPermissionPage() {
  const navigate = useNavigate();
  const [requesting, setRequesting] = useState(false);

  const handleConfirm = async () => {
    if (requesting) return;
    setRequesting(true);

    // 순차 호출: 위치 → 카메라 (갤러리는 여기서 다루지 않음)
    await requestLocation();
    await requestCamera();

    // 권한 결과와 무관하게 다음으로 진행 (거부해도 앱은 이용 가능, 추후 기능별 재요청)
    navigate('/home');
    setRequesting(false);
  };

  return (
    <div style={S.page}>
      <div style={S.body}>
        <h1 style={S.title}>편리한 쉬는시간 앱 사용을 위해<br />아래 권한을 허용해주세요</h1>

        <ul style={S.list}>
          {PERMISSIONS.map((p) => (
            <li key={p.key} style={S.item}>
              <div style={S.itemHead}>
                <span style={S.itemLabel}>{p.label}</span>
                <span style={p.required ? S.tagRequired : S.tagOptional}>
                  {p.required ? '필수' : '선택'}
                </span>
              </div>
              <p style={S.itemDesc}>{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div style={S.footer}>
        <button onClick={handleConfirm} style={S.confirmBtn} disabled={requesting}>
          {requesting ? '권한 요청 중...' : '확인'}
        </button>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)',
    display: 'flex', flexDirection: 'column',
  },
  body: { flex: 1, padding: 'var(--spacing-8) var(--spacing-6) 0' },
  title: {
    fontSize: 'var(--font-size-heading-2)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', lineHeight: 1.4, margin: 0, marginBottom: 'var(--spacing-8)',
  },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' },
  item: {
    padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-light)', background: 'var(--color-card-light)',
  },
  itemHead: { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' },
  itemLabel: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' },
  tagRequired: {
    fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-primary-dark)', background: 'var(--color-primary-light)',
    padding: '2px var(--spacing-2)', borderRadius: 'var(--radius-round)',
  },
  tagOptional: {
    fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-gray)', background: 'var(--color-border-light)',
    padding: '2px var(--spacing-2)', borderRadius: 'var(--radius-round)',
  },
  itemDesc: { margin: 0, fontSize: 'var(--font-size-body)', color: 'var(--color-text-gray)', lineHeight: 1.5 },
  footer: { padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-10)' },
  confirmBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};