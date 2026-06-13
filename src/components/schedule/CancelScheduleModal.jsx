import { useState } from 'react';

// 일정 취소 모달: 1단계 확인 → 2단계 사유 입력
// onConfirm(reason) 호출 시 부모가 실제 취소 API 처리
export default function CancelScheduleModal({ open, onClose, onConfirm }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'reason'
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    setStep('confirm');
    setReason('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(reason.trim());
      // 성공 시 부모가 닫음 → 여기선 상태만 정리
      setStep('confirm');
      setReason('');
    } catch {
      // 실패해도 모달은 유지 (부모가 에러 토스트 띄움)
      setSubmitting(false);
    }
  };

  return (
    <div onClick={handleClose} style={S.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={S.box}>
        {step === 'confirm' ? (
          <>
            <h3 style={S.title}>일정을 정말 취소하시겠습니까?</h3>
            <div style={S.row}>
              <button onClick={handleClose} style={S.btnGhost}>아니오</button>
              <button onClick={() => setStep('reason')} style={S.btnPrimary}>일정 취소</button>
            </div>
          </>
        ) : (
          <>
            <h3 style={S.title}>취소 사유</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 400))}
              placeholder="취소 사유를 자세하게 입력해주세요"
              style={S.textarea}
              autoFocus
            />
            <div style={S.counter}>{reason.length}/400</div>
            <div style={S.row}>
              <button onClick={handleClose} style={S.btnGhost} disabled={submitting}>닫기</button>
              <button
                onClick={handleSubmit}
                disabled={!reason.trim() || submitting}
                style={reason.trim() && !submitting ? S.btnPrimary : S.btnDisabled}
              >
                {submitting ? '취소 중...' : '취소하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  box: {
    background: 'var(--color-background)', borderRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-5)',
    width: '85%', maxWidth: '340px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    textAlign: 'center', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-5)',
  },
  textarea: {
    width: '100%', minHeight: '120px', resize: 'none', boxSizing: 'border-box',
    padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text)', fontSize: 'var(--font-size-body)',
    fontFamily: 'inherit', lineHeight: 1.5, outline: 'none',
  },
  counter: {
    textAlign: 'right', fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-light-gray)', marginTop: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-4)',
  },
  row: { display: 'flex', gap: 'var(--spacing-2)' },
  btnGhost: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
  },
  btnPrimary: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
  btnDisabled: {
    flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-border-light)', color: 'var(--color-text-light-gray)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'not-allowed',
  },
};