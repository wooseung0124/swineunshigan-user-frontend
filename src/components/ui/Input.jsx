import './Input.css';

/**
 * 라벨·헬퍼 텍스트를 지원하는 입력 필드 컴포넌트.
 */
export default function Input({
  label,
  id,
  helperText,
  error,
  multiline = false,
  className = '',
  ...props
}) {
  const fieldId = id || (label ? `input-${label}` : undefined);
  const FieldTag = multiline ? 'textarea' : 'input';

  return (
    <div className={`ui-input ${className}`.trim()}>
      {label && (
        <label className="ui-input__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <FieldTag
        id={fieldId}
        className={`ui-input__field${multiline ? ' ui-input__field--textarea' : ''}`}
        {...props}
      />
      {error && <p className="ui-input__error">{error}</p>}
      {!error && helperText && <p className="ui-input__helper">{helperText}</p>}
    </div>
  );
}
