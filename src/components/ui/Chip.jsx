import './Chip.css';

/**
 * 필터·카테고리 선택용 칩 버튼 컴포넌트.
 */
export default function Chip({
  children,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) {
  const classes = [
    'ui-chip',
    selected ? 'ui-chip--selected' : '',
    disabled ? 'ui-chip--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
