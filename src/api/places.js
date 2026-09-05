import { apiUrl } from '../utils/api';
import { createLogger } from '../utils/logger';
import { normalizePlace } from '../utils/placeModel';

const log = createLogger('places-api');

/**
 * @param {string} path
 * @param {Record<string, string|number|undefined|null>} [query]
 */
function buildUrl(path, query = {}) {
  const resolved = apiUrl(path);
  const url = resolved.startsWith('http')
    ? new URL(resolved)
    : new URL(resolved, window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  // 개발(프록시): 상대경로 유지 / 운영: api.shineunsigan.com 절대 URL
  if (resolved.startsWith('http')) {
    return url.toString();
  }
  return `${url.pathname}${url.search}`;
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 */
async function requestJson(path, init) {
  const response = await fetch(path, init);
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    log.error('request failed', path, response.status, text);
    throw new Error(`PLACES_API_${response.status}`);
  }
  return response.json();
}

/**
 * 커서 페이지네이션으로 장소 전체를 불러옵니다.
 * (위경도 쿼리는 서버 INVALID_REQUEST 이슈로 사용하지 않습니다.)
 * @param {{ category?: string, size?: number }} [options]
 */
export async function fetchAllPlaces({ category, size = 100 } = {}) {
  const places = [];
  let cursor;
  let hasNext = true;
  let guard = 0;

  while (hasNext && guard < 20) {
    guard += 1;
    const path = buildUrl('/api/v1/places', { category, size, cursor });
    const data = await requestJson(path);
    const page = Array.isArray(data?.places) ? data.places : [];
    places.push(...page.map((dto) => normalizePlace(dto)));
    hasNext = Boolean(data?.hasNext);
    cursor = data?.nextCursor ?? undefined;
    if (!hasNext) break;
  }

  log.info('fetched places', { count: places.length, category: category || 'ALL' });
  return places;
}

/**
 * 키워드로 장소를 검색합니다.
 * @param {string} keyword
 */
export async function searchPlacesByKeyword(keyword) {
  const path = buildUrl('/api/v1/places/search', { keyword: keyword.trim() });
  const data = await requestJson(path);
  const list = Array.isArray(data) ? data : [];
  log.info('search', { keyword, count: list.length });
  return list.map((dto) => normalizePlace(dto));
}

/**
 * 검색어 자동완성 후보를 조회합니다.
 * @param {string} keyword
 * @returns {Promise<string[]>}
 */
export async function fetchPlaceAutocomplete(keyword) {
  const trimmed = keyword.trim();
  if (!trimmed) return [];
  const path = buildUrl('/api/v1/places/autocompletion', { keyword: trimmed });
  const data = await requestJson(path);
  return Array.isArray(data) ? data.map(String) : [];
}

/**
 * 장소 상세(운영시간 포함)를 조회합니다.
 * @param {number|string} placeId
 */
export async function fetchPlaceDetail(placeId) {
  const data = await requestJson(apiUrl(`/api/v1/places/${placeId}`));
  const place = normalizePlace(data?.place || {}, { operations: data?.operations });
  if (Array.isArray(data?.images) && data.images.length) {
    place.images = data.images;
    place.imageUrl =
      data.images.find((img) => img?.isMain)?.imageUrl || data.images[0]?.imageUrl || place.imageUrl;
  }
  return place;
}

/**
 * 장소 카테고리 목록을 조회합니다.
 * @returns {Promise<string[]>}
 */
export async function fetchPlaceCategories() {
  const data = await requestJson(apiUrl('/api/v1/places/category'));
  return Array.isArray(data) ? data.map(String) : [];
}
