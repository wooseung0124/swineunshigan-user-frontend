const SIGNUP_TOKEN_KEY = 'signupToken';
const REQUIRED_FIELDS_KEY = 'requiredFields';
const SOCIAL_USER_KEY = 'socialUser';

export function saveAuthSession(data) {
  localStorage.setItem('token', data.token.accessToken);
  localStorage.setItem('refreshToken', data.token.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  sessionStorage.removeItem('guest');
  clearSignupDraft();
}

export function saveSignupDraft(data) {
  sessionStorage.setItem(SIGNUP_TOKEN_KEY, data.signupToken);
  sessionStorage.setItem(REQUIRED_FIELDS_KEY, JSON.stringify(data.requiredFields ?? []));
  sessionStorage.setItem(SOCIAL_USER_KEY, JSON.stringify(data.socialUser ?? null));
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
  return (
    (data.authStatus === 'LOGIN_SUCCESS' || data.authStatus === 'SIGNUP_SUCCESS') &&
    data.token?.accessToken &&
    data.user
  );
}
