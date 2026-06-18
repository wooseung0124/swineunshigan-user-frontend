// 지도 위에 떠있는 동그란 컨트롤 버튼 (현재 위치 / 줌인 / 줌아웃 등)
// HomePage의 기존 📍 버튼 스타일을 그대로 추출한 재사용 컴포넌트.
//
// 색상은 한솔님 토큰 확정 시 한번에 토큰화 예정 (현재는 하드코딩 유지).
//
// 부모는 반드시 position: relative 인 컨테이너여야 함
// (이 버튼이 position: absolute로 그 안에 떠있음).

/**
 * @param {Object} props
 * @param {React.ReactNode|string} props.icon - 버튼 안에 표시할 아이콘 또는 이모지
 * @param {() => void} props.onClick - 클릭 핸들러
 * @param {number} [props.bottom=20] - 부모 기준 bottom 거리 (px)
 * @param {number} [props.right=16]  - 부모 기준 right 거리 (px)
 * @param {string} [props.ariaLabel] - 접근성 라벨 (스크린리더용)
 */
export default function MapControlButton({
  icon,
  onClick,
  bottom = 20,
  right = 16,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        bottom: `${bottom}px`,
        right: `${right}px`,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {icon}
    </button>
  );
}
