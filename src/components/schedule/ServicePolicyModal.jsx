export default function ServicePolicyModal({ open, onClose, onAgree }) {
    if (!open) return null;
  
    return (
      <div onClick={onClose} style={S.overlay}>
        <div onClick={(e) => e.stopPropagation()} style={S.box}>
          <h3 style={S.title}>서비스 운영방침 동의</h3>
          <div style={S.policyBox}>
            쉬는시간은 즉흥 동행 서비스로, 참여 시 아래 내용에 동의하게 됩니다.{'\n\n'}
            · 약속 장소와 시간을 지켜주세요.{'\n'}
            · 상대방을 존중하고 안전하게 만나주세요.{'\n'}
            · 부적절한 행위 시 이용이 제한될 수 있습니다.
          </div>
          <label style={S.agreeRow}>
            <span style={S.agreeText}>위 운영방침에 동의합니다</span>
          </label>
          <div style={S.btnRow}>
            <button onClick={onClose} style={S.btnGhost}>취소</button>
            <button onClick={onAgree} style={S.btnPrimary}>동의하고 계속</button>
          </div>
        </div>
      </div>
    );
  }
  
  const S = {
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: 'var(--spacing-4)',
    },
    box: {
      background: 'var(--color-background)', borderRadius: 'var(--radius-xl)',
      padding: 'var(--spacing-6)', width: '100%', maxWidth: '340px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    },
    title: {
      fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-4)', textAlign: 'center',
    },
    policyBox: {
      background: 'var(--color-card-light)', borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-4)', fontSize: 'var(--font-size-body-sm)',
      color: 'var(--color-text-gray)', lineHeight: 1.6, whiteSpace: 'pre-line',
      marginBottom: 'var(--spacing-4)', maxHeight: '180px', overflowY: 'auto',
    },
    agreeRow: { display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-4)' },
    agreeText: { fontSize: 'var(--font-size-body)', color: 'var(--color-text)', fontWeight: 'var(--font-weight-medium)' },
    btnRow: { display: 'flex', gap: 'var(--spacing-2)' },
    btnGhost: {
      flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)', background: 'var(--color-background)',
      color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
      fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
    },
    btnPrimary: {
      flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
      border: 'none', background: 'var(--color-primary-500)', color: 'var(--color-text)',
      fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
    },
  };