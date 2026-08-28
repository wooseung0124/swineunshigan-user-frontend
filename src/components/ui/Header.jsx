import './Header.css';

/**
 * 앱 상단 헤더 컴포넌트.
 */
export default function Header({
  title,
  variant = 'black',
  onBack,
  backLabel = '뒤로',
  rightAction,
  className = '',
}) {
  const classes = [
    'ui-header',
    variant === 'white' ? 'ui-header--white' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <div className="ui-header__side">
        {onBack && (
          <button
            type="button"
            className="ui-header__icon-btn"
            onClick={onBack}
            aria-label={backLabel}
          >
            ←
          </button>
        )}
      </div>

      {title && <h1 className="ui-header__title">{title}</h1>}

      <div className="ui-header__side ui-header__side--right">
        {rightAction}
      </div>
    </header>
  );
}
