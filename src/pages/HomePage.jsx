import { useState, useCallback, useEffect } from 'react';
import SlideUpPanel from '../components/common/SlideUpPanel';
import FilterBar from '../components/common/FilterBar';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore';
import MapControlButton from '../components/map/MapControlButton';
import OnboardingPermissionPage from './OnboardingPermissionPage';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const SEONGSU_CENTER = {
  lat: 37.5447,
  lng: 127.0557,
};

// 임시 더미 장소 데이터 (ERD: places + place_category + place_images + opening_hours)
// 백엔드 API 붙기 전까지 사용. 응답 구조는 ERD camelCase 변환 기준.
const DUMMY_PLACES = [
  {
    id: 1,
    categoryId: 1,
    name: '맞스터치 성수역점',
    address: '서울 성동구 성수동2가 289-10',
    snsLink: null,
    contact: '02-1234-5678',
    latitude: 37.5445,
    longitude: 127.0560,
    // 조인 응답 (백엔드 응답 상정)
    category: { id: 1, name: '음식점' },
    images: [],
    openingHours: [],
    isOpenNow: true,
  },
  {
    id: 2,
    categoryId: 2,
    name: '서울숲 카페',
    address: '서울 성동구 서울숲길 17',
    snsLink: null,
    contact: '02-9876-5432',
    latitude: 37.5465,
    longitude: 127.0580,
    category: { id: 2, name: '카페' },
    images: [],
    openingHours: [],
    isOpenNow: true,
  },
  {
    id: 3,
    categoryId: 2,
    name: '성수 북카페',
    address: '서울 성동구 연무장길 15',
    snsLink: null,
    contact: null,
    latitude: 37.5430,
    longitude: 127.0540,
    category: { id: 2, name: '카페' },
    images: [],
    openingHours: [],
    isOpenNow: false,
  },
  {
    id: 4,
    categoryId: 3,
    name: '성수 미술관',
    address: '서울 성동구 성수일로 56',
    snsLink: null,
    contact: '02-3333-4444',
    latitude: 37.5455,
    longitude: 127.0570,
    category: { id: 3, name: '문화시설' },
    images: [],
    openingHours: [],
    isOpenNow: true,
  },
  {
    id: 5,
    categoryId: 4,
    name: '서울숲 공원',
    address: '서울 성동구 뚝섬로 273',
    snsLink: null,
    contact: null,
    latitude: 37.5440,
    longitude: 127.0590,
    category: { id: 4, name: '레포츠' },
    images: [],
    openingHours: [],
    isOpenNow: true,
  },
];

export default function HomePage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);   // 인포윈도우용
const [detailPlace, setDetailPlace] = useState(null);       // 슬라이드 패널용
  const [filter, setFilter] = useState(null);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const navigate = useNavigate();
  const [hoveredPlace, setHoveredPlace] = useState(null);

  const [showPermission, setShowPermission] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('resttime:permission:pending') === 'true') {
      localStorage.removeItem('resttime:permission:pending');
      setShowPermission(true);
    }
  }, []);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 필터링 로직
  const filteredPlaces = filter
  ? DUMMY_PLACES.filter(place => place.category?.name === filter)
  : [];  // 필터 안 누르면 핑 없음

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
            border: '1px solid var(--color-border)',
            fontSize: '14px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 16px',
            // TODO: 토큰화 보류 - 한솔님 확인 후 처리 (카카오 색 vs 브랜드 색 결정 필요)
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
            if (!isAuthenticated) {
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
            background: 'var(--color-error)',
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

{selectedPlace && (
  <InfoWindow
    position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
    onCloseClick={() => setSelectedPlace(null)}
    options={{
      pixelOffset: new window.google.maps.Size(0, -40),
    }}
  >
    <div
  onClick={() => {
    setDetailPlace(selectedPlace);   // 슬라이드 패널 열기
    setSelectedPlace(null);          // 인포윈도우 닫기
  }}
  style={{ padding: '8px 4px', cursor: 'pointer', minWidth: '180px' }}
>
      <div style={{ fontSize: '11px', color: 'var(--color-text-gray)', marginBottom: '4px' }}>
        {selectedPlace.category?.name}
      </div>
      <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'var(--color-text)' }}>
        {selectedPlace.name}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-gray)' }}>
        {selectedPlace.address}
      </div>
    </div>
  </InfoWindow>
)}
        </GoogleMap>

        <MapControlButton
          icon="📍"
          bottom={20}
          right={16}
          ariaLabel="내 위치로 이동"
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
        />
      </div>

      <SlideUpPanel
        place={detailPlace}
        onClose={() => setDetailPlace(null)}
      />

      {showPermission && (
        <OnboardingPermissionPage onClose={() => setShowPermission(false)} />
      )}
    </div>
  );
}