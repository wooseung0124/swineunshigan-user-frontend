import { useEffect, useRef, useState } from 'react';
import SlideUpPanel from '../components/common/SlideUpPanel';
import { IconSearch } from '../components/common/NavIcons';
import searchBrandIcon from '../assets/search-brand-icon.png';
import './HomePage.css';

const CATEGORY_OPTIONS = ['카페', '음식점', '문화시설', '레포츠'];
const SEARCH_TIP_KEY = 'home_search_tip_dismissed';

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
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchTip, setShowSearchTip] = useState(
    () => sessionStorage.getItem(SEARCH_TIP_KEY) !== 'true',
  );

  useEffect(() => {
    loadKakaoMap().then(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const mapInstance = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5447, 127.0557),
        level: 4,
      });

      mapInstanceRef.current = mapInstance;
    });
  }, []);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const searchPlaces = (keyword) => {
    const map = mapInstanceRef.current;
    if (!map || !keyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword.trim(), (data, status) => {
      if (status !== window.kakao.maps.services.Status.OK) return;

      clearMarkers();

      const bounds = new window.kakao.maps.LatLngBounds();
      data.forEach((place) => {
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(place.y, place.x),
          title: place.place_name,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          setSelectedPlace(place);
        });

        markersRef.current.push(marker);
        bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
      });

      map.setBounds(bounds);
    });
  };

  const handleSearch = () => {
    searchPlaces(searchKeyword);
  };

  const handleCategorySelect = (category) => {
    const nextCategory = selectedCategory === category ? null : category;
    setSelectedCategory(nextCategory);

    if (nextCategory) {
      setSearchKeyword(nextCategory);
      searchPlaces(nextCategory);
    }
  };

  const dismissSearchTip = () => {
    setShowSearchTip(false);
    sessionStorage.setItem(SEARCH_TIP_KEY, 'true');
  };

  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const handleCurrentLocation = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert('위치 정보를 가져올 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const locPosition = new window.kakao.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude,
        );

        map.setCenter(locPosition);

        const marker = new window.kakao.maps.Marker({
          map,
          position: locPosition,
          title: '내 위치',
        });

        markersRef.current.push(marker);
      },
      () => {
        alert('위치 정보를 가져올 수 없습니다.');
      },
    );
  };

  return (
    <div className="home-page">
      <div ref={mapRef} className="home-page__map" aria-label="지도" />

      <div className="home-page__controls">
        <div className="home-page__search-row">
          <form
            className="home-page__search"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <img className="home-page__brand" src={searchBrandIcon} alt="" />
            <input
              type="search"
              className="home-page__search-input"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="가고싶은 장소를 입력해 주세요"
              aria-label="가고싶은 장소를 입력해 주세요"
            />
            <button type="submit" className="home-page__search-icon-btn" aria-label="검색">
              <IconSearch />
            </button>
          </form>

          <button
            type="button"
            className="home-page__round-btn home-page__notify-btn"
            onClick={() => alert('알림 목록 페이지 연결 예정')}
            aria-label="알림"
          />
        </div>

        <div className="home-page__categories" role="tablist" aria-label="장소 카테고리">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`home-page__category${selectedCategory === category ? ' home-page__category--active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {showSearchTip && (
          <div className="home-page__tip">
            <span className="home-page__tip-arrow" aria-hidden="true">
              <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
                <path
                  d="M9 1.2C6.1 1.2 4.1 4.6 2.6 7.1C2.2 7.8 2.7 8.6 3.5 8.6H14.5C15.3 8.6 15.8 7.8 15.4 7.1C13.9 4.6 11.9 1.2 9 1.2Z"
                  fill="var(--color-gray-800)"
                />
              </svg>
            </span>
            <p className="home-page__tip-text">어떤 장소를 찾고계신가요~?</p>
            <button
              type="button"
              className="home-page__tip-close"
              onClick={dismissSearchTip}
              aria-label="안내 닫기"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="home-page__map-controls">
        <button
          type="button"
          className="home-page__round-btn home-page__map-control-btn home-page__map-control-btn--zoom"
          onClick={handleZoomIn}
          aria-label="지도 확대"
        />
        <button
          type="button"
          className="home-page__round-btn home-page__map-control-btn home-page__map-control-btn--locate"
          onClick={handleCurrentLocation}
          aria-label="현재 위치로 이동"
        />
      </div>

      <SlideUpPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}
