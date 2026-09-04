/** 성수역 기준 좌표 (MVP 지도 중심) */
export const SEONGSU_STATION = { lat: 37.544581, lng: 127.055961 };

const EARTH_RADIUS_M = 6371000;

/**
 * 두 좌표 간 직선 거리(m)를 Haversine으로 계산합니다.
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number}
 */
export function distanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * 성수역 기준 직선 거리(m)를 반환합니다.
 * @param {{ lat: number, lng: number }} point
 * @returns {number}
 */
export function distanceFromSeongsu(point) {
  return distanceMeters(SEONGSU_STATION, point);
}

/**
 * 거리를 UI 문구로 포맷합니다. (예: 350m, 1.2km)
 * @param {number|null|undefined} meters
 * @returns {string}
 */
export function formatDistance(meters) {
  if (meters == null || Number.isNaN(meters)) return '';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1).replace(/\.0$/, '')}km`;
}

/**
 * 성수역 기준 가까운 순으로 정렬한 새 배열을 반환합니다.
 * @template {{ distanceMeters: number }} T
 * @param {T[]} places
 * @returns {T[]}
 */
export function sortBySeongsuDistance(places) {
  return [...places].sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * 성수역 반경 이내 장소만 남깁니다.
 * @template {{ distanceMeters: number }} T
 * @param {T[]} places
 * @param {number} radiusMeters
 * @returns {T[]}
 */
export function filterWithinSeongsu(places, radiusMeters) {
  return places.filter((place) => place.distanceMeters <= radiusMeters);
}
