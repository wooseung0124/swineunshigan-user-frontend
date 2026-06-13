export default function DeleteConfirmModal({ open, count, onClose, onConfirm }) {
    if (!open) return null;
  
    return (
      <div onClick={onClose} style={S.overlay}>
        <div onClick={(e) => e.stopPropagation()} style={S.box}>
          <h3 style={S.title}>일정 삭제</h3>
          <p style={S.desc}>
            선택한 {count}개의 일정을 삭제할까요?<br />삭제된 일정은 복구할 수 없습니다.
          </p>
          <div style={S.row}>
            <button onClick={onClose} style={S.btnGhost}>취소</button>
            <button onClick={onConfirm} style={S.btnDanger}>확인</button>
          </div>
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
      width: '85%', maxWidth: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    },
    title: {
      fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
      textAlign: 'center', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-2)',
    },
    desc: {
      fontSize: 'var(--font-size-body)', textAlign: 'center', color: 'var(--color-text-gray)',
      lineHeight: 1.5, margin: 0, marginBottom: 'var(--spacing-5)',
    },
    row: { display: 'flex', gap: 'var(--spacing-2)' },
    btnGhost: {
      flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)', background: 'var(--color-background)',
      color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
      fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
    },
    btnDanger: {
      flex: 1, padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-lg)',
      border: 'none', background: 'var(--color-error)', color: 'var(--color-text-white)',
      fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
    },
  };