import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllPlaces,
  searchPlacesByKeyword,
} from '../api/places';
import HomeFloatingActions from '../components/home/HomeFloatingActions';
import PlaceListSheet from '../components/home/PlaceListSheet';
import OnboardingCarousel from '../components/onboarding/OnboardingCarousel';
import SlideUpPanel from '../components/common/SlideUpPanel';
import { IconSearch } from '../components/common/NavIcons';
import { useGoogleMap } from '../hooks/useGoogleMap';
import { filterWithinSeongsu, sortBySeongsuDistance } from '../utils/geo';
import { toPanelPlaceFromDb } from '../utils/placeModel';
import { createLogger } from '../utils/logger';
import searchBrandIcon from '../assets/search-brand-icon.png';
import './HomePage.css';

const CATEGORY_OPTIONS = ['카페', '음식점', '문화시설', '레포츠', '기타'];
const SEARCH_TIP_KEY = 'home_search_tip_dismissed';
const SEONGSU_RADIUS_M = 1000;
const NO_MATCH_MESSAGE = '현재는 장소명만 검색이 가능합니다.';
const log = createLogger('HomePage');

export default function HomePage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [allPlaces, setAllPlaces] = useState([]);
  const [visiblePlaces, setVisiblePlaces] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(true);
  const [focusId, setFocusId] = useState(null);
  const [showSearchTip, setShowSearchTip] = useState(
    () => sessionStorage.getItem(SEARCH_TIP_KEY) !== 'true',
  );

  const handleMarkerSelect = useCallback((place) => {
    setSelectedPlace(toPanelPlaceFromDb(place));
    setFocusId(place.id);
  }, []);

  const { mapReady, mapError, renderPlaces, fitPlaces, goToSeongsuStation } = useGoogleMap(
    mapRef,
    handleMarkerSelect,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const places = await fetchAllPlaces();
        if (cancelled) return;
        const sorted = sortBySeongsuDistance(places);
        setAllPlaces(sorted);
        setVisiblePlaces(sorted);
      } catch (error) {
        log.error('initial places load failed', error);
        if (!cancelled) setSearchError('장소 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    renderPlaces(visiblePlaces, { focusId, showTooltip: Boolean(focusId) });
  }, [mapReady, visiblePlaces, focusId, renderPlaces]);

  const listTitle = useMemo(() => {
    if (selectedCategory) return selectedCategory;
    if (searchKeyword.trim()) return '검색 결과';
    return '전체 장소';
  }, [selectedCategory, searchKeyword]);

  const applyDefaultView = () => {
    setSelectedCategory(null);
    setFocusId(null);
    setSearchError('');
    const sorted = sortBySeongsuDistance(allPlaces);
    setVisiblePlaces(sorted);
    setListOpen(false);
    fitPlaces(sorted);
  };

  const handleSearch = async (rawKeyword = searchKeyword) => {
    const keyword = String(rawKeyword || '').trim();
    setSelectedCategory(null);
    setSearchKeyword(keyword);
    setSelectedPlace(null);

    if (!keyword) {
      applyDefaultView();
      return;
    }

    try {
      setLoading(true);
      const results = await searchPlacesByKeyword(keyword);
      if (!results.length) {
        setSearchError(NO_MATCH_MESSAGE);
        setListOpen(false);
        return;
      }

      const sorted = sortBySeongsuDistance(results);
      setSearchError('');
      setVisiblePlaces(sorted);
      setListOpen(true);
      setFocusId(sorted.length === 1 ? sorted[0].id : null);
      fitPlaces(sorted);
    } catch (error) {
      log.error('search failed', error);
      setSearchError(NO_MATCH_MESSAGE);
      setListOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    const next = selectedCategory === category ? null : category;
    setSelectedCategory(next);
    setSearchKeyword('');
    setSearchError('');
    setFocusId(null);

    if (!next) {
      applyDefaultView();
      return;
    }

    const filtered = sortBySeongsuDistance(
      filterWithinSeongsu(
        allPlaces.filter((place) => place.category === next),
        SEONGSU_RADIUS_M,
      ),
    );
    setVisiblePlaces(filtered);
    setListOpen(true);
    fitPlaces(filtered);
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
              placeholder="가보고 싶은 장소명을 입력하세요."
              aria-label="가보고 싶은 장소명을 입력하세요."
              autoComplete="off"
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
            <button type="button" className="home-page__tip-close" onClick={dismissSearchTip} aria-label="안내 닫기">
              ×
            </button>
          </div>
        )}

        {searchError && (
          <p className="home-page__search-error" role="status">
            {searchError}
          </p>
        )}
        {loading && <p className="home-page__loading">장소 불러오는 중…</p>}
      </div>

      <div className="home-page__map-controls">
        <button
          type="button"
          className="home-page__round-btn home-page__map-control-btn home-page__map-control-btn--zoom"
          aria-label="확대"
        />
        <button
          type="button"
          className="home-page__round-btn home-page__map-control-btn home-page__map-control-btn--locate"
          onClick={goToSeongsuStation}
          aria-label="성수역으로 이동"
        />
      </div>

      <HomeFloatingActions onAfterPermission={goToSeongsuStation} />

      <PlaceListSheet
        places={visiblePlaces}
        open={listOpen}
        title={listTitle}
        openOnly={openOnly}
        onToggleOpenOnly={() => setOpenOnly((prev) => !prev)}
        onClose={() => setListOpen(false)}
        onSelect={(place) => {
          setFocusId(place.id);
          navigate(`/places/${place.id}`, { state: { place } });
        }}
      />

      <SlideUpPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      <OnboardingCarousel />
    </div>
  );
}
