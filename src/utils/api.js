/**
 * API 요청 기본 URL을 반환합니다.
 * 로컬 개발: VITE_API_BASE_URL 비우면 Vite 프록시(/api → 8080) 사용
 */
export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || '';
}

/**
 * API 경로 전체 URL을 만듭니다.
 * @param {string} path - `/api/...` 형식
 */
export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
