/**
 * 일정 시작 시각을 Date로 파싱합니다. (ISO 또는 "YYYY-MM-DD HH:mm")
 * @param {string|null|undefined} scheduledAt
 * @returns {Date|null}
 */
export function parseScheduledAt(scheduledAt) {
  if (!scheduledAt || typeof scheduledAt !== 'string') return null;
  const normalized = scheduledAt.includes('T')
    ? scheduledAt
    : scheduledAt.replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * 플로팅 버튼 노출·활성 구간을 판정합니다.
 * - 노출: 일정 시작 1시간 전 ~ 시작 후 3시간 (완료 전)
 * - QR 활성: 일정 시작 30분 전 ~ 시작 후 3시간
 * @param {{ scheduledAt?: string, status?: string }[]} schedules
 * @param {Date} [now]
 * @returns {{ visible: boolean, qrEnabled: boolean, activeSchedule: object|null }}
 */
export function resolveFloatingScheduleState(schedules, now = new Date()) {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return { visible: false, qrEnabled: false, activeSchedule: null };
  }

  const today = now.toDateString();
  let best = null;

  for (const schedule of schedules) {
    if (schedule.status === 'CANCELED' || schedule.status === 'COMPLETED') {
      continue;
    }

    const start = parseScheduledAt(schedule.scheduledAt);
    if (!start || start.toDateString() !== today) continue;

    const msToStart = start.getTime() - now.getTime();
    const msSinceStart = now.getTime() - start.getTime();
    const withinWindow =
      msToStart <= 60 * 60 * 1000 && msSinceStart <= 3 * 60 * 60 * 1000;

    if (!withinWindow) continue;

    if (!best || start.getTime() < parseScheduledAt(best.scheduledAt).getTime()) {
      best = schedule;
    }
  }

  if (!best) {
    return { visible: false, qrEnabled: false, activeSchedule: null };
  }

  const start = parseScheduledAt(best.scheduledAt);
  const msToStart = start.getTime() - now.getTime();
  const qrEnabled = msToStart <= 30 * 60 * 1000;

  return { visible: true, qrEnabled, activeSchedule: best };
}
