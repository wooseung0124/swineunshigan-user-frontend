import { useEffect, useRef, useState } from 'react';
import SlideUpPanel from '../components/common/SlideUpPanel';
import FilterBar from '../components/common/FilterBar';

const loadKakaoMap = () => {
  return new Promise((resolve) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.onload = () => window.kakao.maps.load(resolve);
    document.head.appendChild(script);
  });
};

export default function HomePage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    loadKakaoMap().then(() => {
      if (!mapRef.current) return;
      const mapInstance = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5447, 127.0557),
        level: 4,
      });
      setMap(mapInstance);
    });
  }, []);

  const handleSearch = () => {
    if (!map || !searchKeyword) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        data.forEach(place => {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
            title: place.place_name,
          });

          // 마커 클릭 시 슬라이드 업 패널 열기
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedPlace(place);
          });

          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      }
    });
  };

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

        {/* 알림 버튼 */}
        <button
          onClick={() => alert('알림 목록 페이지 연결 예정')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
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

{/* 필터바 */}
<div style={{
        padding: '8px 16px',
        background: '#111',
      }}>
        <FilterBar onFilterChange={(filters) => console.log('필터:', filters)} />
      </div>

      <div ref={mapRef} style={{ flex: 1, width: '100%', position: 'relative' }}>
        {/* 현재 위치 버튼 */}
        <button
          onClick={() => {
            if (!map) return;
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const locPosition = new window.kakao.maps.LatLng(lat, lng);
                map.setCenter(locPosition);

                new window.kakao.maps.Marker({
                  map,
                  position: locPosition,
                  title: '내 위치',
                });
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