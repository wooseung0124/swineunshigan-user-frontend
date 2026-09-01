import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_CENTER, loadGoogleMaps, SEONGSU_STATION, toPanelPlace } from '../utils/googleMaps';
import { attachMarkerClusterer, createPlaceMarkerIcon } from '../utils/mapMarkers';

/**
 * @param {React.RefObject<HTMLElement|null>} mapRef
 * @param {(place: ReturnType<typeof toPanelPlace>) => void} onPlaceSelect
 */
export function useGoogleMap(mapRef, onPlaceSelect) {
  const mapInstanceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const clustererRef = useRef(null);
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
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
    };
  }, [mapRef]);

  const clearMarkers = () => {
    clustererRef.current?.clearMarkers();
    clustererRef.current = null;
    markersRef.current = [];
  };

  const renderMarkers = (places) => {
    const map = mapInstanceRef.current;
    const maps = window.google?.maps;

    if (!map || !maps) {
      return;
    }

    clearMarkers();

    markersRef.current = places
      .filter((place) => place.geometry?.location)
      .map((place) => {
        const marker = new maps.Marker({
          position: place.geometry.location,
          title: place.name,
          icon: createPlaceMarkerIcon(maps),
        });

        marker.addListener('click', () => {
          onPlaceSelect(toPanelPlace(place));
        });

        return marker;
      });

    clustererRef.current = attachMarkerClusterer(map, markersRef.current, maps);
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

        renderMarkers(results);

        const bounds = new maps.LatLngBounds();
        results.forEach((place) => {
          if (place.geometry?.location) {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      },
    );
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
    goToSeongsuStation,
  };
}
