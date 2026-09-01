const SIGNUP_TOKEN_KEY = 'signupToken';
const REQUIRED_FIELDS_KEY = 'requiredFields';
const SOCIAL_USER_KEY = 'socialUser';

export function clearClientAuthState() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
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
    token: root.token ?? data.token ?? null,
    user: root.user ?? data.user ?? null,
  };
}

export function saveAuthSession(data) {
  const parsed = parseAuthResponse(data) ?? data;

  localStorage.setItem('token', parsed.token.accessToken);
  localStorage.setItem('refreshToken', parsed.token.refreshToken);
  localStorage.setItem('user', JSON.stringify(parsed.user));
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

export function isAuthSuccess(data) {
  const parsed = parseAuthResponse(data) ?? data;

  return (
    (parsed.authStatus === 'LOGIN_SUCCESS' || parsed.authStatus === 'SIGNUP_SUCCESS') &&
    parsed.token?.accessToken &&
    parsed.user
  );
}
