// =============================================================
// 소셜 로그인 (OAuth 2.0) 설정 + 인가 URL 빌더 + state 검증
// -------------------------------------------------------------
// - 지원 provider: kakao / naver / google (MVP에서 apple 제외)
// - 환경 변수 (.env):
//     VITE_KAKAO_CLIENT_ID
//     VITE_KAKAO_REDIRECT_URI
//     VITE_NAVER_CLIENT_ID
//     VITE_REDIRECT_URI            (네이버 콜백 URI - 기존 변수명 유지)
//     VITE_GOOGLE_CLIENT_ID        (※ 아직 미발급)
//     VITE_GOOGLE_REDIRECT_URI     (※ 아직 미발급)
// =============================================================

const env = import.meta.env;

/**
 * provider별 OAuth 설정.
 * - useState: true면 CSRF 방지용 state 파라미터를 발급/저장한다.
 * - stateStorageKey: state를 임시 저장할 sessionStorage 키.
 * - scope: 구글처럼 필수인 경우만 지정.
 */
export const OAUTH_PROVIDERS = {
  kakao: {
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    clientId: env.VITE_KAKAO_CLIENT_ID,
    redirectUri: env.VITE_KAKAO_REDIRECT_URI,
    scope: null,
    useState: false, // 기존 동작 유지. 필요 시 true로 변경 가능
    stateStorageKey: 'kakao_oauth_state',
  },
  naver: {
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: env.VITE_NAVER_CLIENT_ID,
    redirectUri: env.VITE_REDIRECT_URI,
    scope: null,
    useState: true,
    stateStorageKey: 'naver_oauth_state',
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: env.VITE_GOOGLE_REDIRECT_URI,
    // 구글은 openid + email + profile 정도면 일반적 (이메일/이름/프로필이미지 획득)
    scope: 'openid email profile',
    useState: true,
    stateStorageKey: 'google_oauth_state',
  },
};

/**
 * 인가(Authorization) URL을 만들어 반환.
 * useState=true 인 provider면 state를 발급해 sessionStorage에 저장한다.
 * @param {'kakao'|'naver'|'google'} provider
 * @returns {string} 인가 URL
 */
export function buildOAuthUrl(provider) {
  const cfg = OAUTH_PROVIDERS[provider];
  if (!cfg) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }
  if (!cfg.clientId || !cfg.redirectUri) {
    // 개발자 콘솔 등록 전이면 여기서 막힘 (특히 google MVP 초기)
    console.warn(`[oauth] ${provider} clientId/redirectUri 미설정 (.env 확인 필요)`);
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: cfg.clientId ?? '',
    redirect_uri: cfg.redirectUri ?? '',
  });
  if (cfg.scope) {
    params.set('scope', cfg.scope);
  }
  if (cfg.useState) {
    const state = crypto.randomUUID();
    sessionStorage.setItem(cfg.stateStorageKey, state);
    params.set('state', state);
  }
  return `${cfg.authUrl}?${params.toString()}`;
}

/**
 * 콜백에서 돌려받은 state가 저장된 state와 일치하는지 검증.
 * 검증 후에는 일회용으로 sessionStorage에서 제거한다.
 * - useState=false 인 provider는 항상 true 반환.
 *
 * @param {'kakao'|'naver'|'google'} provider
 * @param {string|null} receivedState
 * @returns {boolean}
 */
export function verifyOAuthState(provider, receivedState) {
  const cfg = OAUTH_PROVIDERS[provider];
  if (!cfg?.useState) return true;

  const saved = sessionStorage.getItem(cfg.stateStorageKey);
  sessionStorage.removeItem(cfg.stateStorageKey);
  return !!receivedState && receivedState === saved;
}

// =============================================================
// Mock 인증 응답 (백엔드 미연동 상태에서 풀 플로우 테스트용)
// -------------------------------------------------------------
// - VITE_USE_MOCK_AUTH=true 일 때만 동작
// - 콜백에서 백엔드 호출 대신 이 함수를 호출해 가짜 { token, user } 반환
// - user 객체는 types.js의 User typedef를 따른다
// - 백엔드 붙으면 환경변수 false 또는 제거 → 자동으로 진짜 호출로 복귀
// =============================================================

/** @returns {boolean} mock 모드 활성화 여부 */
export function isMockAuthEnabled() {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
}

/**
 * provider별 mock user (types.js User typedef 준수).
 * 어떤 provider로 로그인했는지 구분 가능하게 name/id를 다르게 둠.
 * @type {Record<'kakao'|'naver'|'google', import('../types/types').User>}
 */
// const MOCK_USERS = {
//   kakao: {
//     id: 1001,
//     name: '카카오목업',
//     gender: 'MALE',
//     status: 'ACTIVE',
//     withdrawalDate: null,
//   },
//   naver: {
//     id: 1002,
//     name: '네이버목업',
//     gender: 'FEMALE',
//     status: 'ACTIVE',
//     withdrawalDate: null,
//   },
//   google: {
//     id: 1003,
//     name: '구글목업',
//     gender: 'MALE',
//     status: 'ACTIVE',
//     withdrawalDate: null,
//   },
// };

const MOCK_USERS = {
  kakao: {
    id: 101,
    name: '김진우',
    email: 'jinwoo@kakao.com',
    gender: 'MALE',
    status: 'ACTIVE',
    withdrawalDate: null,
  },
  naver: {
    id: 102,
    name: '이수민',
    email: 'sumin@naver.com',
    gender: 'FEMALE',
    status: 'ACTIVE',
    withdrawalDate: null,
  },
  google: {
    id: 103,
    name: '박지수',
    email: 'jisu@gmail.com',
    gender: 'FEMALE',
    status: 'ACTIVE',
    withdrawalDate: null,
  },
};



/**
 * 백엔드 콜백 응답을 흉내낸 mock 데이터 생성.
 * 반환 형식은 실제 백엔드 응답 가정과 동일하게 `{ token, user }`.
 * @param {'kakao'|'naver'|'google'} provider
 */
export function getMockAuthResponse(provider) {
  const user = MOCK_USERS[provider];
  if (!user) {
    throw new Error(`No mock user for provider: ${provider}`);
  }
  return {
    token: `mock-token-${provider}-${Date.now()}`,
    user,
  };
}
