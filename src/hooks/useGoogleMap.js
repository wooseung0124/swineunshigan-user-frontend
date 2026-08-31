import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_CENTER, loadGoogleMaps, SEONGSU_STATION, toPanelPlace } from '../utils/googleMaps';

/**
 * @param {React.RefObject<HTMLElement|null>} mapRef
 * @param {(place: ReturnType<typeof toPanelPlace>) => void} onPlaceSelect
 */
export function useGoogleMap(mapRef, onPlaceSelect) {
  const mapInstanceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    let resizeObserver;
    let relayoutMap;

    loadGoogleMaps()
      .then((maps) => {
        if (!mapRef.current || mapInstanceRef.current) {
          return;
        }

        const mapInstance = new maps.Map(mapRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = mapInstance;
        placesServiceRef.current = new maps.places.PlacesService(mapInstance);
        setMapReady(true);
        setMapError('');

        relayoutMap = () => {
          maps.event.trigger(mapInstance, 'resize');
          mapInstance.setCenter(mapInstance.getCenter());
        };

        window.addEventListener('resize', relayoutMap);
        resizeObserver = new ResizeObserver(relayoutMap);
        resizeObserver.observe(mapRef.current);
      })
      .catch((error) => {
        if (error.message === 'MISSING_API_KEY') {
          setMapError('Google Maps API 키가 설정되지 않았습니다.');
          return;
        }
        setMapError('Google Maps를 불러오지 못했습니다.');
      });

    return () => {
      if (relayoutMap) {
        window.removeEventListener('resize', relayoutMap);
      }
      resizeObserver?.disconnect();
    };
  }, [mapRef]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const addMarker = (place) => {
    const map = mapInstanceRef.current;
    const maps = window.google?.maps;
    if (!map || !maps || !place.geometry?.location) {
      return;
    }

    const marker = new maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name,
    });

    marker.addListener('click', () => {
      onPlaceSelect(toPanelPlace(place));
    });

    markersRef.current.push(marker);
  };

  const searchPlaces = (keyword) => {
    const map = mapInstanceRef.current;
    const placesService = placesServiceRef.current;
    const maps = window.google?.maps;

    if (!map || !placesService || !maps || !keyword.trim()) {
      return;
    }

    placesService.textSearch(
      {
        query: keyword.trim(),
        location: map.getCenter(),
        radius: 5000,
      },
      (results, status) => {
        if (status !== maps.places.PlacesServiceStatus.OK || !results?.length) {
          return;
        }

        clearMarkers();

        const bounds = new maps.LatLngBounds();
        results.forEach((place) => {
          addMarker(place);
          if (place.geometry?.location) {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      },
    );
  };

  const zoomIn = () => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }
    map.setZoom(map.getZoom() + 1);
  };

  const goToSeongsuStation = () => {
    const map = mapInstanceRef.current;
    const maps = window.google?.maps;

    if (!map || !maps) {
      return;
    }

    map.setCenter(SEONGSU_STATION);
    map.setZoom(16);
  };

  return {
    mapReady,
    mapError,
    searchPlaces,
    zoomIn,
    goToSeongsuStation,
  };
}
