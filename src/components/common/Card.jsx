import { useState } from 'react';

// 공통 Card 컴포넌트
// - 인라인 스타일 + tokens.css CSS 변수 사용
// - padding: sm / md / lg
// - onClick 있으면 클릭 가능 카드로 동작 (hover 그림자 강조)
//
// ※ 배경: 스펙대로 var(--color-card) 사용.
//   현재 토큰 값은 #1e1e1e (다크). 라이트 카드가 필요하면
//   tokens.css의 --color-card 값을 조정하거나 별도 --color-surface 추가 필요.

const PADDING_STYLES = {
  sm: 'var(--spacing-3)',
  md: 'var(--spacing-4)',
  lg: 'var(--spacing-6)',
};

export default function Card({
  children,
  padding = 'md',
  onClick,
  className,
}) {
  const [hovered, setHovered] = useState(false);
  const isClickable = typeof onClick === 'function';

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => isClickable && setHovered(true)}
      onMouseLeave={() => isClickable && setHovered(false)}
      style={{
        background: 'var(--color-card)',
        color: 'var(--color-text-white)',
        borderRadius: 'var(--radius-lg)',
        padding: PADDING_STYLES[padding],
        boxShadow: isClickable && hovered
          ? '0 4px 12px rgba(0, 0, 0, 0.12)'
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease, transform 0.05s ease',
        transform: isClickable && hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {children}
    </div>
  );
}
