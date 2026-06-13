import { useEffect, useState } from 'react';

// 하단 토스트: 3초 뒤 서서히 사라짐
export default function Toast({ message, open, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 2700); // 페이드 시작
    const doneTimer = setTimeout(() => onDone?.(), 3000);         // 완전 제거
    return () => { clearTimeout(hideTimer); clearTimeout(doneTimer); };
  }, [open, onDone]);

  if (!open) return null;

  return (
    <div style={{ ...S.wrap, opacity: visible ? 1 : 0 }}>
      <div style={S.toast}>{message}</div>
    </div>
  );
}

const S = {
  wrap: {
    position: 'fixed', left: 0, right: 0, bottom: 'var(--spacing-10)',
    display: 'flex', justifyContent: 'center', zIndex: 2000,
    transition: 'opacity 0.3s ease', pointerEvents: 'none',
  },
  toast: {
    background: 'var(--color-background-dark)', color: 'var(--color-text-white)',
    padding: 'var(--spacing-3) var(--spacing-5)', borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)', maxWidth: '85%',
  },
};