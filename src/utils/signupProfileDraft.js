import { birthDateToApi } from './signupFields';
import { normalizeUserRecord } from './userProfile';

const SIGNUP_PROFILE_DRAFT_KEY = 'signupProfileDraft';

/**
 * @returns {Record<string, unknown>}
 */
export function getSignupProfileDraft() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(SIGNUP_PROFILE_DRAFT_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * @param {Record<string, unknown>} patch
 */
export function saveSignupProfileDraft(patch) {
  const next = normalizeUserRecord({
    ...getSignupProfileDraft(),
    ...patch,
  });

  const payload = {
    name: next.name,
    email: next.email,
    gender: next.gender,
    birthDate: next.birthDate,
    bio: next.bio,
    profileImageUrl: next.profileImageUrl,
    personalityHeadline: next.personalityHeadline,
    personalityResult: next.personalityResult ?? null,
  };

  sessionStorage.setItem(SIGNUP_PROFILE_DRAFT_KEY, JSON.stringify(payload));
  return payload;
}

/**
 * @param {Record<string, string|boolean>} formValues
 */
export function saveSignupProfileDraftFromForm(formValues) {
  const birthDate = birthDateToApi(String(formValues.birthDate || ''))
    || String(formValues.birthDate || '').trim();

  return saveSignupProfileDraft({
    name: String(formValues.name || '').trim(),
    email: String(formValues.email || '').trim(),
    gender: formValues.gender,
    birthDate,
    bio: String(formValues.bio || '').trim(),
  });
}

export function clearSignupProfileDraft() {
  sessionStorage.removeItem(SIGNUP_PROFILE_DRAFT_KEY);
}
