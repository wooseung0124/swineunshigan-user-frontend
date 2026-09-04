const DAY_KEYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

/**
 * "HH:mm" 또는 "HH:mm:ss"를 분 단위로 변환합니다.
 * @param {string|null|undefined} time
 * @returns {number|null}
 */
export function timeToMinutes(time) {
  if (!time || typeof time !== 'string') return null;
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * 운영시간 배열로 현재 영업 여부를 판정합니다.
 * @param {Array<{ dayOfWeek?: string, openingTime?: string, closingTime?: string, breakTimeStart?: string|null, breakTimeEnd?: string|null }>} operations
 * @param {Date} [now]
 * @returns {{ isOpen: boolean, label: string }}
 */
export function resolveOpenStatus(operations, now = new Date()) {
  if (!Array.isArray(operations) || operations.length === 0) {
    return { isOpen: false, label: '영업정보 없음' };
  }

  const todayKey = DAY_KEYS[now.getDay()];
  const today = operations.find((op) => op.dayOfWeek === todayKey);
  if (!today) {
    return { isOpen: false, label: '휴무' };
  }

  const open = timeToMinutes(today.openingTime);
  const close = timeToMinutes(today.closingTime);
  if (open == null || close == null) {
    return { isOpen: false, label: '영업정보 없음' };
  }

  const current = now.getHours() * 60 + now.getMinutes();
  const breakStart = timeToMinutes(today.breakTimeStart);
  const breakEnd = timeToMinutes(today.breakTimeEnd);
  const inBreak =
    breakStart != null &&
    breakEnd != null &&
    current >= breakStart &&
    current < breakEnd;

  const isOpen = current >= open && current < close && !inBreak;
  return { isOpen, label: isOpen ? '영업중' : '영업종료' };
}
