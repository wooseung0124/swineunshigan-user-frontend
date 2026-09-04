import { useEffect, useMemo, useState } from 'react';
import { formatDistance, sortBySeongsuDistance } from '../../utils/geo';
import './PlaceListSheet.css';

const SORT_RELEVANCE = 'relevance';
const SORT_DISTANCE = 'distance';
const ANIMATION_MS = 280;

/**
 * 홈 지도 하단 장소 목록 바텀시트입니다.
 * @param {{
 *   places: Array<object>,
 *   open: boolean,
 *   title?: string,
 *   openOnly?: boolean,
 *   onToggleOpenOnly?: () => void,
 *   onSelect: (place: object) => void,
 *   onClose: () => void,
 * }} props
 */
export default function PlaceListSheet({
  places,
  open,
  title = '장소 목록',
  openOnly = false,
  onToggleOpenOnly,
  onSelect,
  onClose,
}) {
  const [sortMode, setSortMode] = useState(SORT_RELEVANCE);
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => {
        setEntered(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    setEntered(false);
    const timer = window.setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  const visible = useMemo(() => {
    const base = openOnly ? places.filter((place) => place.isOpen) : places;
    if (sortMode === SORT_DISTANCE) {
      return sortBySeongsuDistance(base);
    }
    return base;
  }, [places, openOnly, sortMode]);

  if (!mounted) return null;

  const sortLabel = sortMode === SORT_DISTANCE ? '거리도순' : '관련도순';
  const sheetClass = entered
    ? 'place-list-sheet place-list-sheet--open'
    : 'place-list-sheet';

  const toggleSort = () => {
    setSortMode((prev) => (prev === SORT_RELEVANCE ? SORT_DISTANCE : SORT_RELEVANCE));
  };

  return (
    <section className={sheetClass} aria-label={title}>
      <div className="place-list-sheet__header">
        <button
          type="button"
          className="place-list-sheet__handle-btn"
          onClick={onClose}
          aria-label="목록 닫기"
        >
            <span className="place-list-sheet__handle" aria-hidden="true" />
          </button>

          <div className="place-list-sheet__filters">
            <button
              type="button"
              className="place-list-sheet__sort"
              onClick={toggleSort}
              aria-label={`정렬: ${sortLabel}`}
            >
              {sortLabel}
              <span className="place-list-sheet__sort-chevron" aria-hidden="true">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1.5 2.25L6 6.75L10.5 2.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {onToggleOpenOnly && (
              <button
                type="button"
                className={`place-list-sheet__open-filter${openOnly ? ' place-list-sheet__open-filter--active' : ''}`}
                onClick={onToggleOpenOnly}
                aria-pressed={openOnly}
              >
                영업중
              </button>
            )}
          </div>
        </div>

        <ul className="place-list-sheet__list">
          {visible.length === 0 && (
            <li className="place-list-sheet__empty">조건에 맞는 장소가 없습니다.</li>
          )}
          {visible.map((place) => {
            const images = Array.isArray(place.images)
              ? place.images.map((img) => img?.imageUrl).filter(Boolean)
              : [];
            if (place.imageUrl && !images.includes(place.imageUrl)) {
              images.unshift(place.imageUrl);
            }

            return (
              <li key={place.id}>
                <button type="button" className="place-list-sheet__item" onClick={() => onSelect(place)}>
                  <div className="place-list-sheet__item-top">
                    <div className="place-list-sheet__body">
                      <p className="place-list-sheet__category">{place.category}</p>
                      <p className="place-list-sheet__name">{place.name}</p>
                      <p className="place-list-sheet__address">{place.address}</p>
                      <p className="place-list-sheet__meta">
                        <span>성수역 {formatDistance(place.distanceMeters)}</span>
                        <span
                          className={
                            place.isOpen
                              ? 'place-list-sheet__status place-list-sheet__status--open'
                              : 'place-list-sheet__status'
                          }
                        >
                          {place.openLabel}
                        </span>
                      </p>
                    </div>
                    <span className="place-list-sheet__more" aria-hidden="true">
                      ⋮
                    </span>
                  </div>
                  {images.length > 0 && (
                    <div className="place-list-sheet__photos">
                      {images.slice(0, 4).map((url) => (
                        <img key={url} src={url} alt="" className="place-list-sheet__photo" />
                      ))}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
