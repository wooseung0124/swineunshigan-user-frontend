import {
  clearProfileExtension,
  flattenUserRecord,
  getCachedProfileForEmail,
  mergeUserRecords,
  persistProfileExtension,
  saveUserToStorage,
} from './userProfile';
import { clearSignupProfileDraft, getSignupProfileDraft } from './signupProfileDraft';

const SIGNUP_TOKEN_KEY = 'signupToken';
const REQUIRED_FIELDS_KEY = 'requiredFields';
const SOCIAL_USER_KEY = 'socialUser';

/**
 * @param {unknown} tokenData
 */
function parseAuthTokens(tokenData) {
  if (!tokenData) {
    return { accessToken: '', refreshToken: '' };
  }

  if (typeof tokenData === 'string') {
    return { accessToken: tokenData, refreshToken: '' };
  }

  if (typeof tokenData !== 'object') {
    return { accessToken: '', refreshToken: '' };
  }

  const record = /** @type {Record<string, unknown>} */ (tokenData);

  return {
    accessToken: String(
      record.accessToken ?? record.access_token ?? record.token ?? '',
    ),
    refreshToken: String(record.refreshToken ?? record.refresh_token ?? ''),
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} parsed
 * @param {unknown} raw
 */
function resolveAuthTokens(parsed, raw) {
  const fromToken = parseAuthTokens(parsed?.token ?? raw?.token);
  if (fromToken.accessToken) {
    return fromToken;
  }

  const root = parsed ?? raw ?? {};

  return {
    accessToken: String(root.accessToken ?? root.access_token ?? ''),
    refreshToken: String(root.refreshToken ?? root.refresh_token ?? ''),
  };
}

export function clearClientAuthState() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  clearProfileExtension();
  clearSignupProfileDraft();
  sessionStorage.removeItem('guest');
  clearSignupDraft();
}

/**
 * @param {unknown} data
 */
export function parseAuthResponse(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const root = data.data && typeof data.data === 'object' ? data.data : data;

  return {
    authStatus: root.authStatus ?? data.authStatus ?? null,
    signupToken: root.signupToken ?? data.signupToken ?? null,
    requiredFields: root.requiredFields ?? data.requiredFields ?? [],
    socialUser: root.socialUser ?? data.socialUser ?? null,
    token: root.token ?? data.token ?? root,
    user: root.user ?? data.user ?? root,
    accessToken: root.accessToken ?? data.accessToken ?? null,
    refreshToken: root.refreshToken ?? data.refreshToken ?? null,
  };
}

/**
 * @param {unknown} data
 * @param {Record<string, unknown>} [profilePatch]
 */
export function saveAuthSession(data, profilePatch = {}) {
  const parsed = parseAuthResponse(data) ?? data;
  const tokens = resolveAuthTokens(parsed, data);
  const signupDraft = getSignupProfileDraft();
  const mergedPatch = mergeUserRecords(signupDraft, profilePatch);
  const apiUser = flattenUserRecord(parsed.user, data, parsed.socialUser);
  const email = String(apiUser.email || mergedPatch.email || '');
  const cachedProfile = getCachedProfileForEmail(email);
  const user = mergeUserRecords(
    mergeUserRecords(apiUser, cachedProfile),
    mergedPatch,
  );

  if (!tokens.accessToken) {
    throw new Error('액세스 토큰을 받지 못했습니다.');
  }

  localStorage.setItem('token', tokens.accessToken);

  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  saveUserToStorage(user);
  persistProfileExtension(user);
  clearSignupProfileDraft();

  sessionStorage.removeItem('guest');
  clearSignupDraft();
}

export function saveSignupDraft(data) {
  const parsed = parseAuthResponse(data) ?? data;
  const signupToken =
    parsed.signupToken ??
    parsed?.data?.signupToken ??
    parsed?.result?.signupToken;

  if (!signupToken) {
    return false;
  }

  sessionStorage.setItem(SIGNUP_TOKEN_KEY, String(signupToken));
  sessionStorage.setItem(
    REQUIRED_FIELDS_KEY,
    JSON.stringify(parsed.requiredFields ?? []),
  );
  sessionStorage.setItem(
    SOCIAL_USER_KEY,
    JSON.stringify(parsed.socialUser ?? null),
  );
  return true;
}

export function getSignupDraft() {
  const signupToken = sessionStorage.getItem(SIGNUP_TOKEN_KEY);
  if (!signupToken) return null;

  let requiredFields = [];
  let socialUser = null;

  try {
    requiredFields = JSON.parse(sessionStorage.getItem(REQUIRED_FIELDS_KEY) ?? '[]');
  } catch {
    requiredFields = [];
  }

  try {
    socialUser = JSON.parse(sessionStorage.getItem(SOCIAL_USER_KEY) ?? 'null');
  } catch {
    socialUser = null;
  }

  return { signupToken, requiredFields, socialUser };
}

export function clearSignupDraft() {
  sessionStorage.removeItem(SIGNUP_TOKEN_KEY);
  sessionStorage.removeItem(REQUIRED_FIELDS_KEY);
  sessionStorage.removeItem(SOCIAL_USER_KEY);
}

export function canCompleteAuth(data) {
  if (isAuthSuccess(data)) {
    return true;
  }

  const parsed = parseAuthResponse(data) ?? data;
  const tokens = resolveAuthTokens(parsed, data);

  return Boolean(tokens.accessToken) && parsed.authStatus !== 'ADDITIONAL_INFO_REQUIRED';
}

/**
 * 카카오 로그인 응답을 로그인/회원가입 플로우로 분기합니다.
 * @param {unknown} data
 * @returns {'login'|'signup'|'error'}
 */
export function resolveAuthFlow(data) {
  const parsed = parseAuthResponse(data);

  if (!parsed) {
    return 'error';
  }

  const tokens = resolveAuthTokens(parsed, data);

  if (parsed.authStatus === 'LOGIN_SUCCESS' || parsed.authStatus === 'SIGNUP_SUCCESS') {
    return tokens.accessToken ? 'login' : 'error';
  }

  // accessToken이 있으면 기존 회원 로그인 (ADDITIONAL_INFO_REQUIRED가 잘못 내려와도 로그인)
  if (tokens.accessToken) {
    return 'login';
  }

  if (parsed.authStatus === 'ADDITIONAL_INFO_REQUIRED' && parsed.signupToken) {
    return 'signup';
  }

  if (canCompleteAuth(data)) {
    return 'login';
  }

  return 'error';
}

export function isAuthSuccess(data) {
  const parsed = parseAuthResponse(data) ?? data;
  const tokens = resolveAuthTokens(parsed, data);

  if (!tokens.accessToken || !parsed.user) {
    return false;
  }

  if (parsed.authStatus === 'ADDITIONAL_INFO_REQUIRED') {
    return false;
  }

  if (parsed.authStatus === 'LOGIN_SUCCESS' || parsed.authStatus === 'SIGNUP_SUCCESS') {
    return true;
  }

  // authStatus가 없는 로그인/가입 완료 응답도 허용합니다.
  return !parsed.authStatus;
}
