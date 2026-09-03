import { CONNECTION_TYPES, THINKING_TYPES } from '../data/personalityTypes';
import { buildPersonalityResult } from './personalityResult';
import { getStoredUser, updateStoredUser } from './userProfile';

export const PENDING_PERSONALITY_KEY = 'pendingPersonalityTest';
export const ONBOARDING_SEEN_KEY = 'onboardingSeen';

export const CONNECTION_CODE_MAP = {
  BM: '시간경계형',
  BG: '가치중심형',
  JM: '자연접근형',
  GT: '관계탐색형',
  DS: '행동동행형',
  GJ: '속도조율형',
};

export const THINK_CODE_MAP = {
  ESSENCE: '관조하는 지성',
  DEFINITION: '의미를 짓는 자',
  CONDITION: '기록하는 예술가',
  INTUITION: '감정의 깊이를 탐색하는 자',
  RESPONSIBILITY: '고독을 감당하는 자',
  EVALUATION: '경험의 질을 평가하는 자',
};

const PERSONALITY_QUERY_KEYS = ['connection', 'think', 'cs', 'ts', 'origin'];

function findProfileByTitle(title, types) {
  return types.find((item) => item.title === title) || null;
}

/** @param {string} connectionCode @param {string} thinkCode */
export function buildPersonalityResultFromCodes(connectionCode, thinkCode) {
  const connectionTitle = CONNECTION_CODE_MAP[String(connectionCode || '').toUpperCase()];
  const thinkTitle = THINK_CODE_MAP[String(thinkCode || '').toUpperCase()];
  if (!connectionTitle || !thinkTitle) return null;

  const connection = findProfileByTitle(connectionTitle, CONNECTION_TYPES);
  const thinking = findProfileByTitle(thinkTitle, THINKING_TYPES);
  if (!connection || !thinking) return null;

  return buildPersonalityResult(connection, thinking);
}

function parseScoreList(raw) {
  if (raw == null || String(raw).trim() === '') return null;
  const scores = String(raw)
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));
  return scores.length > 0 ? scores : null;
}

/**
 * URL 파라미터에서 이향인 결과를 파싱합니다.
 * @param {URLSearchParams|Record<string, string>} searchParams
 */
export function parsePersonalityParams(searchParams) {
  const get = (key) =>
    typeof searchParams.get === 'function' ? searchParams.get(key) : searchParams[key];

  const connection = String(get('connection') || '').trim().toUpperCase();
  const think = String(get('think') || '').trim().toUpperCase();
  if (!connection || !think) return null;
  if (!CONNECTION_CODE_MAP[connection] || !THINK_CODE_MAP[think]) return null;

  const personalityResult = buildPersonalityResultFromCodes(connection, think);
  if (!personalityResult) return null;

  const originRaw = String(get('origin') || '').trim().toLowerCase();
  const origin =
    originRaw === 'instagram' ? 'instagram' : originRaw === 'app' ? 'app' : originRaw || 'app';

  return {
    connection,
    think,
    cs: parseScoreList(get('cs')),
    ts: parseScoreList(get('ts')),
    origin,
    personalityResult,
    personalityHeadline: personalityResult.headline,
  };
}

/** @param {ReturnType<typeof parsePersonalityParams>} payload */
export function savePendingPersonalityResult(payload) {
  if (!payload) return;

  localStorage.setItem(
    PENDING_PERSONALITY_KEY,
    JSON.stringify({
      connection: payload.connection,
      think: payload.think,
      cs: payload.cs,
      ts: payload.ts,
      origin: payload.origin,
      personalityHeadline: payload.personalityHeadline,
      personalityResult: payload.personalityResult,
      savedAt: new Date().toISOString(),
    }),
  );
}

/** @returns {(ReturnType<typeof parsePersonalityParams> & { savedAt?: string })|null} */
export function getPendingPersonalityResult() {
  try {
    const raw = localStorage.getItem(PENDING_PERSONALITY_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.connection || !parsed?.think) return null;

    const personalityResult =
      parsed.personalityResult?.connection && parsed.personalityResult?.thinking
        ? parsed.personalityResult
        : buildPersonalityResultFromCodes(parsed.connection, parsed.think);

    if (!personalityResult) return null;

    return {
      ...parsed,
      personalityResult,
      personalityHeadline: personalityResult.headline,
    };
  } catch {
    return null;
  }
}

/** 가입/서버 저장 성공 후 pending 데이터를 삭제합니다. */
export function clearPendingPersonalityResult() {
  localStorage.removeItem(PENDING_PERSONALITY_KEY);
}

/** 로그인 사용자에게 pending 결과를 프로필로 반영합니다. */
export function applyPendingPersonalityToStoredUser() {
  const pending = getPendingPersonalityResult();
  if (!pending?.personalityResult) return false;
  if (!getStoredUser() && !localStorage.getItem('token')) return false;

  updateStoredUser({
    personalityHeadline: pending.personalityHeadline,
    personalityResult: pending.personalityResult,
    connection: pending.connection,
    think: pending.think,
    cs: pending.cs,
    ts: pending.ts,
  });
  return true;
}

/** signup/complete 요청용 성향 필드를 만듭니다. */
export function buildSignupPersonalityPayload(pending, personalityResult) {
  const source = pending || null;
  const headline = personalityResult?.headline || source?.personalityHeadline || '';
  if (!source && !headline) return {};

  return {
    ...(source?.connection ? { connection: source.connection } : {}),
    ...(source?.think ? { think: source.think } : {}),
    ...(source?.cs ? { cs: source.cs.join(',') } : {}),
    ...(source?.ts ? { ts: source.ts.join(',') } : {}),
    ...(headline ? { personalityHeadline: headline } : {}),
  };
}

/** 성향 테스트 퀴즈(랜딩) URL을 반환합니다. */
export function getPersonalityQuizUrl() {
  const full = import.meta.env.VITE_PERSONALITY_QUIZ_URL?.trim();
  if (full) return full;

  const origin = (
    import.meta.env.VITE_PERSONALITY_LANDING_ORIGIN || 'https://shineunsigan.com'
  ).replace(/\/$/, '');
  const path = import.meta.env.VITE_PERSONALITY_QUIZ_PATH || '/quiz.html';
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 랜딩 퀴즈로 바로 이동합니다. */
export function openPersonalityQuiz({ fromInstagram = false } = {}) {
  const url = new URL(getPersonalityQuizUrl());
  url.searchParams.set('origin', 'app');
  if (fromInstagram) {
    url.searchParams.set('from', 'instagram');
  }
  window.location.assign(url.toString());
}

/** 앱 내 테스트 게이트 URL입니다. */
export function getPersonalityTestGateUrl() {
  return '/test';
}

/** @param {URLSearchParams} searchParams */
export function stripPersonalityParams(searchParams) {
  const next = new URLSearchParams(searchParams);
  PERSONALITY_QUERY_KEYS.forEach((key) => next.delete(key));
  return next;
}

export function hasSeenOnboarding() {
  return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
}

export function markOnboardingSeen() {
  localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
}

/** 온보딩에서 성향 CTA를 보여줄지 여부입니다. */
export function shouldShowPersonalityOnboarding() {
  if (hasSeenOnboarding()) return false;
  if (getPendingPersonalityResult()?.personalityResult) return false;

  const user = getStoredUser();
  if (user?.personalityHeadline || user?.personalityResult) return false;
  return true;
}
