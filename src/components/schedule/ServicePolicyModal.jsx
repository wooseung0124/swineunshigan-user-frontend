import { useState } from 'react';

// 운영방침 전문 (디자인팀 보드). big=true는 제5조~ (폰트 큰 그룹)
const POLICY = [
  { title: '제1조 (목적)', body: '이 운영정책은 쉬는 시간 서비스 내에서 회원이 안전하고 쾌적하게 서비스를 이용할 수 있도록 서비스 운영 기준과 회원 관리 기준을 규정하는 것을 목적으로 합니다.' },
  { title: '제2조 (서비스 이용 기본 원칙)', body: "쉬는 시간은 '어색함도, 강제적인 교류도 없는, 무애프터(無 After), 느슨한 연결'을 지향합니다. 회원은 다음 기본 원칙을 준수하여야 합니다.\n· 상대방의 의사를 존중하고 어떠한 형태의 강요·압박도 하지 않습니다.\n· 일정 참여는 자유의사에 기반하며, 당일 혹은 그 이후 별도의 연락·교류·연락처·SNS 공유 등을 강요하지 않습니다.\n· 이성 관계나 연애 감정을 목적으로 서비스를 이용하거나 이를 일방적으로 표시·요구하는 행위를 하지 않습니다.\n· 서비스의 목적(이향인들 간의 부담 없는 소수 오프라인 만남)에 부합하는 방식으로만 이용합니다." },
  { title: '제3조 (일정 개설)', body: '회원은 다음 조건을 충족하면 일정을 개설할 수 있습니다.\n· 카메라·갤러리·위치 앱 권한 3가지에 모두 동의한 회원만 일정을 개설할 수 있습니다.\n· 동일한 날짜에 하루 1개의 일정만 개설할 수 있습니다.\n· 일정을 개설하기 전에 서비스 운영 정책에 동의하여야 합니다.\n· 입력 항목: 일정 제목(필수), 활동 소개(필수), 활동 카테고리(스터디/식사/문화활동/스포츠/기타, 필수), 날짜·시간(약속 시각 최소 3시간 전까지, 필수), 성별 조건(동성만/이성 포함/성별 무관, 필수), 인원수(2~4명, 필수), 장소(개설 후 변경 불가, 필수)' },
  { title: '제4조 (일정 참여)', body: '회원은 다음 조건을 모두 충족한 경우에 일정에 참여 신청할 수 있습니다.\n· 카메라·갤러리·위치 앱 권한 3가지에 모두 동의한 경우\n· 마이페이지 프로필 상세 정보를 모두 입력 완료한 경우\n· 일정에 설정된 성별 조건을 충족할 것\n· 해당 일정 약속 시각 기준 앞뒤 3시간 이내에 이미 참여 중인 다른 일정이 없을 것\n· 일정 최대 인원이 초과되지 않을 것' },
  { title: '제5조 (일정 수정)', big: true, body: '일정 개설자는 다음 조건을 모두 충족한 경우에만 일정을 수정할 수 있습니다.\n· 일정이 아직 모집 중인 상태(대기중)이어야 합니다.\n· 현재 참여 신청한 회원이 한 명도 없어야 합니다.\n· 수정 가능 항목은 일정 제목, 날짜·시간, 활동 소개, 활동 카테고리, 인원수(3~4명)이며, 장소와 성별 조건은 변경할 수 없습니다.' },
  { title: '제6조 (일정 취소)', big: true, body: '일정 취소는 모집 중인 상태(대기중)에서만 가능하며, 약속 당일과 전날에는 취소할 수 없습니다.\n· 일정 개설자가 취소하는 경우: 참여 신청한 회원이 없으면 별도 사유 없이 즉시 취소됩니다. 참여 신청한 회원이 1명 이상이면 취소 사유를 반드시 입력해야 하며, 참여 중인 회원 전원에게 취소 사실이 안내됩니다.\n· 일정 참여자가 취소하는 경우: 해당 회원만 일정에서 이탈하며, 일정 자체는 유지됩니다. 일정 개설자에게 이탈 사실이 안내됩니다.' },
  { title: '제7조 (현장 도착 인증)', big: true, body: "회사는 일정 당일 참여자 간 현장 도착을 상호 확인할 수 있는 QR 인증 기능을 제공합니다.\n· 현장 도착 인증 기능은 약속 시각 2시간 전부터 활성화됩니다.\n· 인증을 위해서는 카메라와 위치 권한 동의가 필요합니다.\n· 인증 코드(QR)는 생성 후 30초간 유효하며, 만료 후 재발급할 수 있습니다.\n· 본인이 생성한 인증 코드를 본인이 직접 사용하는 행위는 허용되지 않습니다.\n· 인증 코드 위·변조 또는 목적지 외 장소에서의 인증 시도는 금지되며, 적발 시 운영 조치를 받을 수 있습니다.\n· 카메라 고장 등 부득이한 사유로 QR 스캔이 어려운 경우, 이동 현황 전달 기능에서 '목적지 대기중'을 선택하여 전송하면 운영팀이 확인 후 도착 처리합니다." },
  { title: '제8조 (패널티 및 징계)', big: true, body: '패널티 기준\n다음 행위에 대해 패널티가 부과됩니다.' },
];

export default function ServicePolicyModal({ open, onClose, onAgree }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [checked, setChecked] = useState(false);        // 체크박스 직접 클릭
  const [detailAgreed, setDetailAgreed] = useState(false); // 자세히보기에서 동의
  const canAgree = checked && detailAgreed;

  if (!open) return null;

  return (
    <>
      {/* 1단계: 동의 안내 패널 */}
      <div onClick={onClose} style={S.overlay}>
        <div onClick={(e) => e.stopPropagation()} style={S.sheet}>
          <h3 style={S.title}>서비스 운영 방침 동의 안내</h3>
          <p style={S.sub}>서비스 운영 방침에 동의해야 일정을 참여할 수 있어요.</p>

          <div style={S.agreeRow}>
          <button
              onClick={() => setChecked(!checked)}
              style={{ ...S.checkbox, ...(checked ? S.checkboxOn : {}) }}
            >
              {checked && <span style={S.checkMark}>✓</span>}
            </button>
            <span style={S.agreeText}>[필수] 서비스 운영 방침 동의</span>
            <button onClick={() => setDetailOpen(true)} style={S.detailBtn}>자세히 보기</button>
          </div>

          <div style={S.btnRow}>
            <button onClick={onClose} style={S.btnGhost}>닫기</button>
            <button
              onClick={onAgree}
              disabled={!canAgree}
              style={{ ...S.btnPrimary, ...(canAgree ? {} : S.btnDisabled) }}
            >
              동의하기
            </button>
          </div>
        </div>
      </div>

      {/* 2단계: 자세히 보기 — 운영방침 전문 */}
      {detailOpen && (
        <div style={S.overlay2}>
          <div style={S.detailBox}>
            <button onClick={() => setDetailOpen(false)} style={S.closeX} aria-label="닫기">✕</button>
            <h3 style={S.detailTitle}>서비스 운영 방침 안내</h3>

            <div style={S.policyScroll}>
              {POLICY.map((sec, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={sec.big ? S.secTitleBig : S.secTitle}>{sec.title}</div>
                  <div style={sec.big ? S.secBodyBig : S.secBody}>{sec.body}</div>
                </div>
              ))}
            </div>

            <p style={S.detailFoot}>서비스 운영 방침에 동의해야 일정을 참여할 수 있어요.</p>
            <button
              onClick={() => { setDetailAgreed(true); setDetailOpen(false); }}
              style={S.detailAgreeBtn}
            >
              동의하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const S = {
  // 1단계 패널 (하단 시트)
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000,
  },
  sheet: {
    background: 'var(--color-background)',
    borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-6)', width: '100%', maxWidth: '440px',
  },
  title: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-2)', textAlign: 'center' },
  sub: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)', margin: 0, marginBottom: 'var(--spacing-5)', textAlign: 'center' },
  agreeRow: { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-5)' },
  checkbox: {
    width: '22px', height: '22px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
    border: '1.5px solid var(--color-border)', background: 'var(--color-background)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
  },
  checkboxOn: { background: 'var(--color-primary-500)', borderColor: 'var(--color-primary-500)' },
  checkMark: { color: 'var(--color-text-white)', fontSize: '14px', fontWeight: 700 },
  agreeText: { flex: 1, fontSize: 'var(--font-size-body)', color: 'var(--color-text)', fontWeight: 'var(--font-weight-medium)' },
  detailBtn: { background: 'transparent', border: 'none', color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body-sm)', textDecoration: 'underline', cursor: 'pointer' },
  btnRow: { display: 'flex', gap: 'var(--spacing-2)' },
  btnGhost: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
  },
  btnPrimary: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary-500)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
  btnDisabled: { background: 'var(--color-border)', color: 'var(--color-text-light-gray)', cursor: 'not-allowed' },

  // 2단계 자세히보기 (전체 모달)
  overlay2: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 'var(--spacing-4)',
  },
  detailBox: {
    position: 'relative', background: 'var(--color-background)', borderRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-6)', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column',
    maxHeight: '80vh',
  },
  closeX: { position: 'absolute', top: 'var(--spacing-4)', right: 'var(--spacing-4)', background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-4)', color: 'var(--color-text-gray)', cursor: 'pointer' },
  detailTitle: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-4)', textAlign: 'center' },
  policyScroll: { flex: 1, overflowY: 'auto', marginBottom: 'var(--spacing-4)' },
  secTitle: { color: '#242423', fontSize: '14px', fontWeight: 600, lineHeight: 1.5, letterSpacing: '-0.28px', marginBottom: '6px' },
  secBody: { color: '#656563', fontSize: '12px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.24px', whiteSpace: 'pre-line' },
  secTitleBig: { color: '#242423', fontSize: '16px', fontWeight: 600, lineHeight: 1.8, letterSpacing: '-0.32px', marginBottom: '6px' },
  secBodyBig: { color: '#656563', fontSize: '14px', fontWeight: 400, lineHeight: 1.8, letterSpacing: '-0.28px', whiteSpace: 'pre-line' },
  detailFoot: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)', textAlign: 'center', margin: 0, marginBottom: 'var(--spacing-3)' },
  detailAgreeBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: 'none',
    background: 'var(--color-primary-500)', color: 'var(--color-text)', fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};