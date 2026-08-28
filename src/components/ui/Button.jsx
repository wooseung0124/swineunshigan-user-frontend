import './Button.css';

const VARIANT_CLASS = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
};

const SIZE_CLASS = {
  md: 'ui-button--md',
  sm: 'ui-button--sm',
};

/**
 * 디자인 시스템 기본 버튼 컴포넌트.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'ui-button',
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
    SIZE_CLASS[size] ?? SIZE_CLASS.md,
    fullWidth ? 'ui-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
