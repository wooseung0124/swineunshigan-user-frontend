import { SEONGSU_STATION } from './geo';

export { SEONGSU_STATION };
export const DEFAULT_MAP_CENTER = SEONGSU_STATION;

let loadPromise = null;

/**
 * Google Maps JavaScript API를 로드합니다.
 * @returns {Promise<typeof google.maps>}
 */
export function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    return Promise.reject(new Error('MISSING_API_KEY'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ko&region=KR`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
          return;
        }
        reject(new Error('SCRIPT_LOAD_FAILED'));
      };
      script.onerror = () => reject(new Error('SCRIPT_LOAD_FAILED'));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

/**
 * Google Place 결과를 SlideUpPanel 형식으로 변환합니다.
 * @param {google.maps.places.PlaceResult} place
 */
export function toPanelPlace(place) {
  return {
    place_name: place.name ?? '이름 없음',
    category_group_name: place.types?.[0]?.replaceAll('_', ' ') ?? '',
    address_name: place.formatted_address ?? place.vicinity ?? '',
    road_address_name: place.formatted_address ?? '',
    phone: place.formatted_phone_number ?? '',
    googlePlace: place,
  };
}
