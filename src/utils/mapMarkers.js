import { MarkerClusterer } from '@googlemaps/markerclusterer';
import placeMarkerIcon from '../assets/icons/map-place-marker.png';

/**
 * @param {typeof google.maps} maps
 */
export function createPlaceMarkerIcon(maps) {
  return {
    url: placeMarkerIcon,
    scaledSize: new maps.Size(28, 36),
    anchor: new maps.Point(14, 36),
  };
}

/**
 * @param {typeof google.maps} maps
 */
export function createClusterRenderer(maps) {
  return {
    render: ({ count, position }) => {
      const size = count < 10 ? 44 : count < 100 ? 52 : 60;
      const radius = size / 2 - 2;
      const fontSize = Math.round(size * 0.34);

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#99bd23" stroke="#ffffff" stroke-width="3"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-size="${fontSize}px" font-family="Pretendard, sans-serif" font-weight="600">${count}</text>
</svg>`;

      return new maps.Marker({
        position,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
          scaledSize: new maps.Size(size, size),
          anchor: new maps.Point(size / 2, size / 2),
        },
        zIndex: Number(maps.Marker.MAX_ZINDEX) + count,
      });
    },
  };
}

/**
 * @param {typeof google.maps.Map} map
 * @param {google.maps.Marker[]} markers
 * @param {typeof google.maps} maps
 */
export function attachMarkerClusterer(map, markers, maps) {
  return new MarkerClusterer({
    map,
    markers,
    renderer: createClusterRenderer(maps),
  });
}
