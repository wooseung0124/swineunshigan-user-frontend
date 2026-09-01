/**
 * OAuth 리다이렉트 URI를 반환합니다.
 * 배포 환경에서는 현재 origin을 사용해 localhost 고정값으로 인한 오류를 방지합니다.
 * @param {string} callbackPath - 예: '/auth/kakao/callback'
 * @param {string | undefined} configuredUri - env에 설정된 URI
 */
export function resolveOAuthRedirectUri(callbackPath, configuredUri) {
  const normalizedPath = callbackPath.startsWith('/') ? callbackPath : `/${callbackPath}`;
  const configured = configuredUri?.trim();

  if (typeof window === 'undefined') {
    return configured || normalizedPath;
  }

  const origin = window.location.origin;
  const isLocalhost = (value) => /localhost|127\.0\.0\.1/i.test(value);

  if (configured && !(isLocalhost(configured) && !isLocalhost(origin))) {
    return configured;
  }

  return `${origin}${normalizedPath}`;
}
