/**
 * 연필(수정) 아이콘 — 피그마 시안 export.
 * 윤곽선은 currentColor(부모 color로 제어), 안쪽 채움은 흰색 유지(배경 원 위에 올라감).
 */
export default function PencilIcon({ size = 18, color = 'currentColor', style }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={style}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4322 4.80019C15.9006 4.33153 16.6602 4.33121 17.129 4.79948L19.1994 6.86755C19.6684 7.33602 19.6687 8.096 19.2001 8.56486L9.42645 18.3439C9.25931 18.5111 9.04649 18.6253 8.81472 18.672L4.44873 19.5517L5.33003 15.1908C5.37678 14.9595 5.49068 14.7471 5.65749 14.5802L15.4322 4.80019Z"
          fill="white"
        />
        <path
          d="M13.4487 6.95168L15.2487 8.75168L17.0487 10.5517M4.44873 19.5517L8.81472 18.672C9.04649 18.6253 9.25931 18.5111 9.42645 18.3439L19.2001 8.56486C19.6687 8.096 19.6684 7.33602 19.1994 6.86755L17.129 4.79948C16.6602 4.33121 15.9006 4.33153 15.4322 4.80019L5.65749 14.5802C5.49068 14.7471 5.37678 14.9595 5.33003 15.1908L4.44873 19.5517Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }