import { useState, useCallback } from 'react';
import SlideUpPanel from '../components/common/SlideUpPanel';
import FilterBar from '../components/common/FilterBar';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const SEONGSU_CENTER = {
  lat: 37.5447,
  lng: 127.0557,
};

// 임시 더미 장소 데이터
const DUMMY_PLACES = [
  { id: 1, name: '맞스터치 성수역점', category: '음식점', isOpen: true, address: '서울 성동구 성수동2가 289-10', phone: '02-1234-5678', latitude: 37.5445, longitude: 127.0560 },
  { id: 2, name: '서울숲 카페', category: '카페', isOpen: true, address: '서울 성동구 서울숲길 17', phone: '02-9876-5432', latitude: 37.5465, longitude: 127.0580 },
  { id: 3, name: '성수 북카페', category: '카페', isOpen: false, address: '서울 성동구 연무장길 15', latitude: 37.5430, longitude: 127.0540 },
  { id: 4, name: '성수 미술관', category: '문화시설', isOpen: true, address: '서울 성동구 성수일로 56', phone: '02-3333-4444', latitude: 37.5455, longitude: 127.0570 },
  { id: 5, name: '서울숲 공원', category: '레포츠', isOpen: true, address: '서울 성동구 뚝섬로 273', latitude: 37.5440, longitude: 127.0590 },
];

export default function HomePage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filter, setFilter] = useState('전체');
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const navigate = useNavigate();
  const [hoveredPlace, setHoveredPlace] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 필터링 로직
  const filteredPlaces = DUMMY_PLACES.filter(place => {
    if (filter === '전체') return true;
    if (filter === '영업중') return place.isOpen;
    return place.category === filter;
  });

  // 검색 (더미 데이터에서 이름으로 검색)
  const handleSearch = () => {
    if (!searchKeyword) return;
    const found = DUMMY_PLACES.find(p => p.name.includes(searchKeyword));
    if (found && map) {
      map.panTo({ lat: found.latitude, lng: found.longitude });
      setSelectedPlace(found);
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  if (!isLoaded) {
    return <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>지도 로딩 중...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        gap: '8px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="위치 및 가게 검색"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 16px',
            background: '#FEE500',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          검색
        </button>

        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              if (confirm('로그인이 필요합니다. 로그인 하시겠습니까?')) {
                navigate('/');
              }
              return;
            }
            navigate('/notifications');
          }}
        >
          🔔
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ff3b30',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '700',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            3
          </span>
        </button>
      </div>

      <div style={{
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #eee',
      }}>
        <FilterBar onFilterChange={(f) => setFilter(f)} />
      </div>

      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={SEONGSU_CENTER}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
          }}
        >
          {filteredPlaces.map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            title={place.name}
            onClick={() => setSelectedPlace(place)}
            onMouseOver={() => setHoveredPlace(place)}
            onMouseOut={() => setHoveredPlace(null)}
          />
        ))}

        {hoveredPlace && (
          <InfoWindow
            position={{ lat: hoveredPlace.latitude, lng: hoveredPlace.longitude }}
            onCloseClick={() => setHoveredPlace(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              disableAutoPan: true,
            }}
          >
            <div style={{ padding: '4px 8px', fontSize: '13px', fontWeight: '600' }}>
              {hoveredPlace.name}
            </div>
          </InfoWindow>
        )}
        </GoogleMap>

        <button
          onClick={() => {
            if (!map) return;
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                map.panTo({ lat, lng });
              }, () => {
                alert('위치 정보를 가져올 수 없습니다.');
              });
            }
          }}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '16px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          📍
        </button>
      </div>

      <SlideUpPanel
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}