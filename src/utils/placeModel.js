import { distanceFromSeongsu } from './geo';
import { resolveOpenStatus } from './placeOpenStatus';

/**
 * API PlaceDto를 홈/지도용 모델로 정규화합니다.
 * @param {Record<string, unknown>} dto
 * @param {{ operations?: unknown[] }} [extra]
 */
export function normalizePlace(dto, extra = {}) {
  const lat = Number(dto.latitude);
  const lng = Number(dto.longitude);
  const distance =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? distanceFromSeongsu({ lat, lng })
      : Number.POSITIVE_INFINITY;

  const operations = Array.isArray(extra.operations)
    ? extra.operations
    : Array.isArray(dto.operations)
      ? dto.operations
      : [];

  const openStatus = resolveOpenStatus(operations);
  const images = Array.isArray(dto.images) ? dto.images : [];
  const mainImage =
    images.find((img) => img?.isMain)?.imageUrl || images[0]?.imageUrl || '';

  return {
    id: dto.id,
    name: String(dto.name || '이름 없음'),
    category: String(dto.category || ''),
    address: String(dto.address || ''),
    contact: String(dto.contact || ''),
    snsLink: String(dto.snsLink || ''),
    lat,
    lng,
    distanceMeters: distance,
    images,
    imageUrl: mainImage,
    operations,
    isOpen: openStatus.isOpen,
    openLabel: openStatus.label,
  };
}

/**
 * SlideUpPanel / CreateRoom이 기대하는 레거시 place 형태로 변환합니다.
 * @param {ReturnType<typeof normalizePlace>} place
 */
export function toPanelPlaceFromDb(place) {
  return {
    id: place.id,
    place_name: place.name,
    category_group_name: place.category,
    address_name: place.address,
    road_address_name: place.address,
    phone: place.contact,
    distanceMeters: place.distanceMeters,
    openLabel: place.openLabel,
    imageUrl: place.imageUrl,
    dbPlace: place,
  };
}

/**
 * 장소명 검색용으로 공백을 제거한 비교 키를 만듭니다.
 * @param {string} value
 * @returns {string}
 */
export function normalizeSearchKey(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase();
}
