import { useRef, useState } from 'react';
import SlideUpPanel from '../components/common/SlideUpPanel';
import { IconSearch } from '../components/common/NavIcons';
import { useGoogleMap } from '../hooks/useGoogleMap';
import searchBrandIcon from '../assets/search-brand-icon.png';
import './HomePage.css';

const CATEGORY_OPTIONS = ['카페', '음식점', '문화시설', '레포츠'];
const SEARCH_TIP_KEY = 'home_search_tip_dismissed';

export default function HomePage() {
  const mapRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchTip, setShowSearchTip] = useState(
    () => sessionStorage.getItem(SEARCH_TIP_KEY) !== 'true',
  );

  const { mapError, searchPlaces, zoomIn, goToCurrentLocation } = useGoogleMap(
    mapRef,
    setSelectedPlace,
  );

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

  return (
    <div className="home-page">
      <div ref={mapRef} className="home-page__map" aria-label="지도" />

      {mapError && (
        <div className="home-page__map-error" role="alert">
          <p>{mapError}</p>
          <p className="home-page__map-error-hint">
            `.env`에 `VITE_GOOGLE_MAPS_API_KEY`를 설정한 뒤 dev 서버를 재시작해 주세요.
          </p>
        </div>
      )}

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
          onClick={zoomIn}
          aria-label="지도 확대"
        />
        <button
          type="button"
          className="home-page__round-btn home-page__map-control-btn home-page__map-control-btn--locate"
          onClick={goToCurrentLocation}
          aria-label="현재 위치로 이동"
        />
      </div>

      <SlideUpPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}
