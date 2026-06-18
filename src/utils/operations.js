// =============================================================
// 영업시간(operations) 헬퍼
// -------------------------------------------------------------
// - 백엔드 장소 상세 응답의 operations 배열(요일별 7개)을 입력으로
//   "오늘 영업중인지", "오늘 영업시간", "주간 영업시간 목록" 등을 계산
// - openingTime/closingTime이 null이면 휴무로 처리
// - breakTime, lastOrder는 표시용으로만 사용 (영업중 판단은 opening/closing 기준)
// =============================================================

import { DAY_OF_WEEK, DAY_OF_WEEK_LABEL } from '../types/types';

// JS Date.getDay(): 0=일요일 ~ 6=토요일
const JS_DAY_TO_ENUM = {
  0: DAY_OF_WEEK.SUNDAY,
  1: DAY_OF_WEEK.MONDAY,
  2: DAY_OF_WEEK.TUESDAY,
  3: DAY_OF_WEEK.WEDNESDAY,
  4: DAY_OF_WEEK.THURSDAY,
  5: DAY_OF_WEEK.FRIDAY,
  6: DAY_OF_WEEK.SATURDAY,
};

// "HH:mm" → 분 단위 정수 (예: "10:30" → 630)
function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * 오늘 요일의 operation 객체 반환
 * @param {Array} operations - PlaceOperation[]
 * @param {Date} [now] - 기준 시각 (테스트용, 기본은 현재)
 * @returns {Object|null} 해당 요일 operation, 없으면 null
 */
export function getTodayOperation(operations, now = new Date()) {
  if (!Array.isArray(operations)) return null;
  const todayEnum = JS_DAY_TO_ENUM[now.getDay()];
  return operations.find(op => op.dayOfWeek === todayEnum) || null;
}

/**
 * 지금 영업중인지 판단
 * - openingTime/closingTime 둘 다 있고, 현재 시각이 그 범위 안이면 true
 * - null이거나 범위 밖이면 false
 * - 자정 넘어가는 영업(예: 22:00 ~ 02:00)도 지원
 * @param {Array} operations - PlaceOperation[]
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isOpenNow(operations, now = new Date()) {
  const today = getTodayOperation(operations, now);
  if (!today) return false;
  if (!today.openingTime || !today.closingTime) return false; // 휴무

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(today.openingTime);
  const close = toMinutes(today.closingTime);

  if (open === null || close === null) return false;

  // 자정을 넘어가지 않는 일반 케이스 (예: 10:30 ~ 22:00)
  if (close > open) {
    return nowMin >= open && nowMin < close;
  }
  // 자정을 넘어가는 케이스 (예: 22:00 ~ 02:00)
  return nowMin >= open || nowMin < close;
}

/**
 * 오늘 영업시간을 표시용 문자열로
 * - 휴무: "휴무"
 * - 영업: "10:30 ~ 22:00"
 * - 데이터 없음: null
 * @param {Array} operations - PlaceOperation[]
 * @param {Date} [now]
 * @returns {string|null}
 */
export function getTodayHoursLabel(operations, now = new Date()) {
  const today = getTodayOperation(operations, now);
  if (!today) return null;
  if (!today.openingTime || !today.closingTime) return '휴무';
  return `${today.openingTime} ~ ${today.closingTime}`;
}

/**
 * 단일 operation을 표시 문자열로
 * - 휴무: "휴무"
 * - 영업: "10:30 ~ 22:00"
 * @param {Object} operation - PlaceOperation
 * @returns {string}
 */
export function formatOperationHours(operation) {
  if (!operation) return '';
  if (!operation.openingTime || !operation.closingTime) return '휴무';
  return `${operation.openingTime} ~ ${operation.closingTime}`;
}

/**
 * 주간 영업시간을 표시용 배열로
 * - 월요일부터 일요일 순서로 정렬
 * - 각 항목: { day: '월', hours: '10:30 ~ 22:00' | '휴무', isToday: boolean }
 * @param {Array} operations - PlaceOperation[]
 * @param {Date} [now]
 * @returns {Array}
 */
export function getWeeklyHoursLabels(operations, now = new Date()) {
  if (!Array.isArray(operations)) return [];
  const dayOrder = [
    DAY_OF_WEEK.MONDAY, DAY_OF_WEEK.TUESDAY, DAY_OF_WEEK.WEDNESDAY,
    DAY_OF_WEEK.THURSDAY, DAY_OF_WEEK.FRIDAY,
    DAY_OF_WEEK.SATURDAY, DAY_OF_WEEK.SUNDAY,
  ];
  const todayEnum = JS_DAY_TO_ENUM[now.getDay()];
  return dayOrder.map(dayEnum => {
    const op = operations.find(o => o.dayOfWeek === dayEnum);
    return {
      dayEnum,
      day: DAY_OF_WEEK_LABEL[dayEnum],
      hours: op ? formatOperationHours(op) : '-',
      isToday: dayEnum === todayEnum,
    };
  });
}