import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignupDraft } from '../../utils/authSession';
import {
  applyPendingPersonalityToStoredUser,
  parsePersonalityParams,
  savePendingPersonalityResult,
} from '../../utils/personalityTestBridge';
import { saveSignupProfileDraft } from '../../utils/signupProfileDraft';
import {
  restoreSignupAfterPersonalityQuiz,
} from '../../utils/signupQuizHandoff';

const QUERY_KEYS = ['connection', 'think', 'cs', 'ts', 'origin'];

/**
 * URL의 이향인 결과 파라미터를 동기적으로 수신합니다.
 * @returns {boolean} 회원가입(성향 결과) 화면으로 이동해야 하면 true
 */
export function consumePersonalityParamsFromWindow() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.__personalityParamsConsumed) {
    return Boolean(window.__personalityRedirectSignup);
  }

  window.__personalityParamsConsumed = true;

  const url = new URL(window.location.href);
  const parsed = parsePersonalityParams(url.searchParams);

  if (!parsed) {
    window.__personalityRedirectSignup = false;
    return false;
  }

  savePendingPersonalityResult(parsed);
  applyPendingPersonalityToStoredUser();
  saveSignupProfileDraft({
    personalityResult: parsed.personalityResult,
    personalityHeadline: parsed.personalityHeadline,
  });

  QUERY_KEYS.forEach((key) => url.searchParams.delete(key));
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

  const restored = restoreSignupAfterPersonalityQuiz();
  const hasDraft = Boolean(getSignupDraft()?.signupToken) || restored;

  // 테스트 결과가 있으면 항상 가입 성향 결과 화면으로 이어갑니다.
  window.__personalityRedirectSignup = true;
  window.__personalityReturnPath = '/signup';
  window.__personalitySignupRestored = hasDraft;

  return true;
}

/**
 * URL의 이향인 결과 파라미터를 수신해 가입 성향 결과 화면으로 이어갑니다.
 */
export default function PersonalityResultIngest() {
  const navigate = useNavigate();
  const handledRef = useRef(false);
  const shouldSignup = consumePersonalityParamsFromWindow();

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    if (shouldSignup) {
      navigate(window.__personalityReturnPath || '/signup', { replace: true });
    }
  }, [navigate, shouldSignup]);

  return null;
}
