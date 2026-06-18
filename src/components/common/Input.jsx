import { useState } from 'react';

// 공통 Input 컴포넌트
// - 인라인 스타일 + tokens.css CSS 변수 사용
// - error / focus / disabled 상태에 따라 테두리/배경 전환
// - placeholder 색상은 ::placeholder 의사선택자 필요 → 작은 <style> 블록으로 처리
//   (인라인 스타일로는 ::placeholder를 지정할 수 없음)

const PLACEHOLDER_STYLE_TAG = `
  .common-input::placeholder {
    color: var(--color-text-placeholder);
    opacity: 1;
  }
`;

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  error = false,
  disabled = false,
  name,
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'var(--color-error)'
    : focused && !disabled
    ? 'var(--color-primary)'
    : 'var(--color-border)';

  return (
    <>
      <style>{PLACEHOLDER_STYLE_TAG}</style>
      <input
        className="common-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: 'var(--spacing-3)',
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-text)',
          background: disabled
            ? 'var(--color-card-light)' /* ※ --color-surface-light 미정의 → card-light로 대체 */
            : 'var(--color-background)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s ease',
        }}
      />
    </>
  );
}
