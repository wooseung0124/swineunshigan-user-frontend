import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignupDraft } from '../../utils/authSession';
import {
  applyPendingPersonalityToStoredUser,
  parsePersonalityParams,
  savePendingPersonalityResult,
} from '../../utils/personalityTestBridge';

const QUERY_KEYS = ['connection', 'think', 'cs', 'ts', 'origin'];

/**
 * URL의 이향인 결과 파라미터를 동기적으로 수신합니다.
 * PublicRoute의 /home 리다이렉트보다 먼저 실행되어야 합니다.
 * @returns {boolean} 회원가입 draft로 이동해야 하면 true
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

  QUERY_KEYS.forEach((key) => url.searchParams.delete(key));
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next);

  const shouldSignup = Boolean(getSignupDraft()?.signupToken);
  window.__personalityRedirectSignup = shouldSignup;
  return shouldSignup;
}

/**
 * URL의 이향인 결과 파라미터를 수신해 localStorage에 저장합니다.
 */
export default function PersonalityResultIngest() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  // 첫 렌더에서 동기 소비 (라우트 Navigate보다 우선)
  const shouldSignup = consumePersonalityParamsFromWindow();

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    if (shouldSignup) {
      navigate('/signup', { replace: true });
    }
  }, [navigate, shouldSignup]);

  return null;
}
