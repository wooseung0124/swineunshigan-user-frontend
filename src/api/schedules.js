import { apiUrl } from '../utils/api';
import { createLogger } from '../utils/logger';

const log = createLogger('schedules-api');

/**
 * 내 일정 목록을 조회합니다. (로그인 필요)
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchMySchedules() {
  const token = localStorage.getItem('token');
  if (!token) {
    return [];
  }

  const response = await fetch(apiUrl('/api/v1/schedules/me'), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    log.warn('fetchMySchedules failed', response.status, text);
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
