import { useState } from 'react';
import { POLICY } from '../../config/policy';

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