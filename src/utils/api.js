/**
 * API 요청 기본 URL을 반환합니다.
 * 로컬 개발: VITE_API_BASE_URL 비우면 Vite 프록시(/api → 운영 API) 사용
 * 운영: 미설정 시 api.shineunsigan.com 사용 (Vercel SPA rewrite 회피)
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || '';
  if (configured) return configured;
  if (import.meta.env.DEV) return '';
  return 'https://api.shineunsigan.com';
}

/**
 * API 경로 전체 URL을 만듭니다.
 * @param {string} path - `/api/...` 형식
 */
export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
