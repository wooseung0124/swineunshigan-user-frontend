// 온보딩 1회 노출 플래그 (localStorage)
const ONBOARDING_SEEN_KEY = 'resttime:onboarding:seen';

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch (err) {
    console.warn('[onboarding] 플래그 저장 실패:', err);
  }
}