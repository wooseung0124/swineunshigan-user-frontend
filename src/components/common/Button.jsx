// 공통 Button 컴포넌트
// - 인라인 스타일 + tokens.css CSS 변수 사용
// - variant: primary / secondary / ghost
// - size:    sm / md / lg

const VARIANT_STYLES = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-text-white)',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text)',
    border: 'none',
  },
};

const SIZE_STYLES = {
  sm: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    fontSize: 'var(--font-size-body-sm)',
  },
  md: {
    padding: 'var(--spacing-3) var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
  },
  lg: {
    padding: 'var(--spacing-4) var(--spacing-6)',
    fontSize: 'var(--font-size-body-lg)',
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  children,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        borderRadius: 'var(--radius-md)',
        fontWeight: 'var(--font-weight-semibold)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s ease, transform 0.05s ease',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
