// =============================================================
// 성향 테스트 결과 - 브라우저 저장 유틸
// -------------------------------------------------------------
// 외부 test.html에서 퀴즈 후 result.html "앱으로 돌아가기" →
// app.shineunsigan.com?connection=BM&think=ESSENCE 로 복귀.
// connection/think를 브라우저(localStorage)에 저장. 백엔드 필드 아님(승우님 6/7 확정).
//
// 저장 키 구조:
//   - resttime:personality:pending   → 비회원이 받아둔 임시 값 (로그인 전)
//   - resttime:personality:{userId}  → 로그인 후 그 유저로 확정된 값
// 플로우:
//   (비회원) 복귀 → captureFromUrl() → pending 저장 → 로그인 → promotePendingToUser(userId)
//   (회원)   복귀 시 이미 로그인 → captureFromUrl(userId) → 바로 {userId} 저장
// =============================================================



import { PERSONALITY_CONNECTION, PERSONALITY_THINK } from '../types/types';
export const PERSONALITY_TEST_URL = 'https://shineunsigan.com/test.html?from=web';

const KEY_PREFIX = 'resttime:personality';
const PENDING_KEY = `${KEY_PREFIX}:pending`;
const userKey = (userId) => `${KEY_PREFIX}:${userId}`;

/** connection 코드가 유효한지 (enum에 있는 값인지) */
function isValidConnection(code) {
  return code != null && Object.prototype.hasOwnProperty.call(PERSONALITY_CONNECTION, code);
}

/** think 코드가 유효한지 */
function isValidThink(code) {
  return code != null && Object.prototype.hasOwnProperty.call(PERSONALITY_THINK, code);
}

/** localStorage 안전 읽기 (JSON 파싱 실패/없음 → null) */
function readKey(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** localStorage 안전 쓰기 */
function writeKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[personality] 저장 실패:', e);
  }
}

/**
 * 현재 URL 쿼리에서 connection/think를 읽어 저장.
 * - userId 있으면(로그인 상태) → {userId} 키로 바로 저장 (회원 플로우)
 * - userId 없으면(비회원) → pending 키로 저장 (비회원 플로우)
 * - 둘 다 유효하지 않으면 아무것도 안 함(파라미터 없는 일반 진입 = 대부분의 경우)
 * - 저장 후 URL에서 파라미터 제거(주소창 깔끔 + 새로고침 시 중복 처리 방지)
 *
 * @param {number|string|null} [userId] 로그인 상태면 유저 id, 아니면 생략
 * @returns {{connection:string, think:string}|null} 저장한 값 또는 null
 */
export function captureFromUrl(userId = null) {
  const params = new URLSearchParams(window.location.search);
  const connection = params.get('connection');
  const think = params.get('think');

  // 파라미터 자체가 없으면 일반 진입 → 조용히 종료
  if (connection == null && think == null) return null;

  // 있긴 한데 유효하지 않으면 경고만 (외부 코드 변경/오타 방어)
  if (!isValidConnection(connection) || !isValidThink(think)) {
    console.warn('[personality] 유효하지 않은 성향 코드:', { connection, think });
    stripUrlParams();
    return null;
  }

  const value = { connection, think, savedAt: new Date().toISOString() };
  writeKey(userId != null ? userKey(userId) : PENDING_KEY, value);
  // 방금 테스트 복귀함 → 권한 팝업 띄울 신호 (HomePage에서 소비)
  try { localStorage.setItem('resttime:permission:pending', 'true'); } catch (e) { console.warn(e); }
  stripUrlParams();
  return { connection, think };
}

/**
 * 비회원 때 pending에 담아둔 값을 로그인한 유저 키로 옮김(확정).
 * - pending 없으면 아무것도 안 함
 * - 이미 {userId}에 값 있으면 덮어쓰지 않음(기존 우선) — 필요 시 정책 바꿀 것
 * 콜백에서 login(token,user) 직후 호출.
 *
 * @param {number|string} userId
 * @returns {{connection:string, think:string}|null} 확정된 값 또는 null
 */
export function promotePendingToUser(userId) {
  if (userId == null) return null;
  const pending = readKey(PENDING_KEY);
  if (!pending) return null;

  const existing = readKey(userKey(userId));
  if (!existing) {
    writeKey(userKey(userId), pending);
  }
  localStorage.removeItem(PENDING_KEY);
  return existing ?? pending;
}

/**
 * 특정 유저의 저장된 성향 읽기 (화면 표시용).
 * @param {number|string} userId
 * @returns {{connection:string, think:string, savedAt:string}|null}
 */
export function getPersonality(userId) {
  if (userId == null) return null;
  return readKey(userKey(userId));
}

/** 특정 유저 성향 삭제 (탈퇴/재검사 등) */
export function clearPersonality(userId) {
  if (userId == null) return;
  localStorage.removeItem(userKey(userId));
}

/** URL에서 connection/think 파라미터만 제거 (history 오염 방지) */
function stripUrlParams() {
    const url = new URL(window.location.href);   // ① 지금 주소창 URL을 다루기 쉬운 객체로 만듦
    url.searchParams.delete('connection');       // ② 거기서 ?connection= 떼고
    url.searchParams.delete('think');            // ③ ?think= 떼고
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);  // ④ 주소창을 그 결과로 교체
  }