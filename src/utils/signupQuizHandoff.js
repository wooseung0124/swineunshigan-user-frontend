import { getSignupDraft } from './authSession';
import { getSignupProfileDraft, saveSignupProfileDraft } from './signupProfileDraft';

const SIGNUP_DRAFT_BACKUP_KEY = 'signupDraftBackup';
const SIGNUP_PROFILE_BACKUP_KEY = 'signupProfileDraftBackup';
const PERSONALITY_RETURN_KEY = 'personalityReturnPath';

const SIGNUP_TOKEN_KEY = 'signupToken';
const REQUIRED_FIELDS_KEY = 'requiredFields';
const SOCIAL_USER_KEY = 'socialUser';
const SIGNUP_PROFILE_DRAFT_KEY = 'signupProfileDraft';

/**
 * 퀴즈(외부 랜딩)로 나가기 전에 가입 세션을 localStorage에 백업합니다.
 * 랜딩 결과 복귀가 항상 app 도메인으로 오므로, localhost 세션 유실을 보완합니다.
 */
export function stashSignupBeforePersonalityQuiz() {
  const draft = getSignupDraft();
  if (draft?.signupToken) {
    localStorage.setItem(SIGNUP_DRAFT_BACKUP_KEY, JSON.stringify(draft));
  }

  const profileDraft = getSignupProfileDraft();
  localStorage.setItem(SIGNUP_PROFILE_BACKUP_KEY, JSON.stringify(profileDraft || {}));
  localStorage.setItem(PERSONALITY_RETURN_KEY, '/signup');
}

/**
 * 퀴즈 복귀 후 가입 세션을 sessionStorage로 복구합니다.
 * @returns {boolean} 복구되었거나 이미 유효한 draft가 있으면 true
 */
export function restoreSignupAfterPersonalityQuiz() {
  if (getSignupDraft()?.signupToken) {
    return true;
  }

  try {
    const raw = localStorage.getItem(SIGNUP_DRAFT_BACKUP_KEY);
    if (!raw) {
      return false;
    }

    const draft = JSON.parse(raw);
    if (!draft?.signupToken) {
      return false;
    }

    sessionStorage.setItem(SIGNUP_TOKEN_KEY, String(draft.signupToken));
    sessionStorage.setItem(
      REQUIRED_FIELDS_KEY,
      JSON.stringify(draft.requiredFields ?? []),
    );
    sessionStorage.setItem(
      SOCIAL_USER_KEY,
      JSON.stringify(draft.socialUser ?? null),
    );

    const profileRaw = localStorage.getItem(SIGNUP_PROFILE_BACKUP_KEY);
    if (profileRaw) {
      const profileDraft = JSON.parse(profileRaw);
      sessionStorage.setItem(SIGNUP_PROFILE_DRAFT_KEY, JSON.stringify(profileDraft || {}));
      if (profileDraft && typeof profileDraft === 'object') {
        saveSignupProfileDraft(profileDraft);
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 가입 완료 등으로 핸드오프 백업을 정리합니다.
 */
export function clearSignupQuizHandoff() {
  localStorage.removeItem(SIGNUP_DRAFT_BACKUP_KEY);
  localStorage.removeItem(SIGNUP_PROFILE_BACKUP_KEY);
  localStorage.removeItem(PERSONALITY_RETURN_KEY);
}

/**
 * 성향 테스트 후 돌아갈 경로를 반환합니다.
 */
export function getPersonalityReturnPath() {
  return localStorage.getItem(PERSONALITY_RETURN_KEY) || '/signup';
}
