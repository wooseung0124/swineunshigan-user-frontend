import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_CENTER, loadGoogleMaps, SEONGSU_STATION } from '../utils/googleMaps';
import { formatDistance } from '../utils/geo';
import { attachMarkerClusterer, createPlaceMarkerIcon } from '../utils/mapMarkers';
import { createLogger } from '../utils/logger';
import '../styles/mapInfoWindow.css';

const log = createLogger('useGoogleMap');

/**
 * InfoWindow HTML용으로 문자열을 이스케이프합니다.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {object} place
 */
function buildTooltipHtml(place) {
  const distance = formatDistance(place.distanceMeters);
  const openLabel = place.openLabel || '';
  const metaParts = [openLabel, distance].filter(Boolean);
  const meta = metaParts.join(' · ');

  return `
    <div class="place-pin-tooltip">
      <div class="place-pin-tooltip__card">
        <p class="place-pin-tooltip__name">${escapeHtml(place.name)}</p>
        <p class="place-pin-tooltip__meta">${escapeHtml(meta)}</p>
      </div>
      <span class="place-pin-tooltip__arrow" aria-hidden="true"></span>
    </div>
  `;
}

/**
 * 성수 지도 인스턴스·마커·툴팁을 관리합니다.
 * @param {React.RefObject<HTMLElement|null>} mapRef
 * @param {(place: object) => void} onPlaceSelect
 * @param {() => void} [onMapClick]
 */
export function useGoogleMap(mapRef, onPlaceSelect, onMapClick) {
  const mapInstanceRef = useRef(null);
  const clustererRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const onMapClickRef = useRef(onMapClick);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    let resizeObserver;
    let relayoutMap;
    let mapClickListener;

    loadGoogleMaps()
      .then((maps) => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const mapInstance = new maps.Map(mapRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        });

        mapInstanceRef.current = mapInstance;
        infoWindowRef.current = new maps.InfoWindow({
          headerDisabled: true,
          maxWidth: 260,
          pixelOffset: new maps.Size(0, -4),
        });
        mapClickListener = mapInstance.addListener('click', () => {
          onMapClickRef.current?.();
        });
        setMapReady(true);
        setMapError('');
        log.info('map ready');

        relayoutMap = () => {
          maps.event.trigger(mapInstance, 'resize');
          mapInstance.setCenter(mapInstance.getCenter());
        };

        window.addEventListener('resize', relayoutMap);
        resizeObserver = new ResizeObserver(relayoutMap);
        resizeObserver.observe(mapRef.current);
      })
      .catch((error) => {
        log.error('map load failed', error);
        if (error.message === 'MISSING_API_KEY') {
          setMapError('Google Maps API 키가 설정되지 않았습니다.');
          return;
        }
        setMapError('Google Maps를 불러오지 못했습니다.');
      });

    return () => {
      if (relayoutMap) window.removeEventListener('resize', relayoutMap);
      resizeObserver?.disconnect();
      mapClickListener?.remove();
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      infoWindowRef.current?.close();
    };
  }, [mapRef]);

  const clearMarkers = useCallback(() => {
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    markersRef.current = [];
  }, []);

  /**
   * DB 장소 목록으로 핀을 그립니다.
   * @param {Array<object>} places
   * @param {{ focusId?: number|string|null, showTooltip?: boolean }} [options]
   */
  const renderPlaces = useCallback(
    (places, options = {}) => {
      const map = mapInstanceRef.current;
      const maps = window.google?.maps;
      if (!map || !maps) return;

      clearMarkers();
      infoWindowRef.current?.close();

      const valid = places.filter(
        (place) => Number.isFinite(place.lat) && Number.isFinite(place.lng),
      );

      markersRef.current = valid.map((place) => {
        const marker = new maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          title: place.name,
          icon: createPlaceMarkerIcon(maps),
        });

        marker.addListener('click', () => {
          infoWindowRef.current.setContent(buildTooltipHtml(place));
          infoWindowRef.current.open({ map, anchor: marker });
          onPlaceSelectRef.current?.(place);
        });

        return { marker, place };
      });

      clustererRef.current = attachMarkerClusterer(
        map,
        markersRef.current.map((entry) => entry.marker),
        maps,
      );

      if (options.focusId != null && options.showTooltip !== false) {
        const target = markersRef.current.find(
          (entry) => String(entry.place.id) === String(options.focusId),
        );
        if (target) {
          infoWindowRef.current.setContent(buildTooltipHtml(target.place));
          infoWindowRef.current.open({ map, anchor: target.marker });
          map.panTo(target.marker.getPosition());
          map.setZoom(Math.max(map.getZoom() || 14, 16));
        }
      }
    },
    [clearMarkers],
  );

  /**
   * 여러 장소가 보이도록 bounds를 맞춥니다.
   * @param {Array<{ lat: number, lng: number }>} places
   */
  const fitPlaces = useCallback((places) => {
    const map = mapInstanceRef.current;
    const maps = window.google?.maps;
    if (!map || !maps) return;

    const valid = places.filter(
      (place) => Number.isFinite(place.lat) && Number.isFinite(place.lng),
    );
    if (!valid.length) {
      map.setCenter(SEONGSU_STATION);
      map.setZoom(14);
      return;
    }

    if (valid.length === 1) {
      map.panTo({ lat: valid[0].lat, lng: valid[0].lng });
      map.setZoom(16);
      return;
    }

    const bounds = new maps.LatLngBounds();
    valid.forEach((place) => bounds.extend({ lat: place.lat, lng: place.lng }));
    map.fitBounds(bounds);
  }, []);

  /** 성수역 중심으로 지도를 재조정합니다. */
  const goToSeongsuStation = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setCenter(SEONGSU_STATION);
    map.setZoom(16);
  }, []);

  return {
    mapReady,
    mapError,
    renderPlaces,
    fitPlaces,
    goToSeongsuStation,
  };
}
