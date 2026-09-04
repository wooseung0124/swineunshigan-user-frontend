import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { formatDistance } from '../../utils/geo';
import './SlideUpPanel.css';

/**
 * 지도에서 선택한 장소의 간단 상세 패널입니다.
 * @param {{ place: object|null, onClose: () => void }} props
 */
export default function SlideUpPanel({ place, onClose }) {
  const navigate = useNavigate();

  if (!place) return null;

  const distanceLabel = formatDistance(place.distanceMeters);

  return (
    <>
      <button
        type="button"
        className="slide-up-panel__backdrop"
        onClick={onClose}
        aria-label="장소 상세 닫기"
      />

      <section className="slide-up-panel" aria-label="장소 상세">
        <div className="slide-up-panel__handle" aria-hidden="true" />

        <h2 className="slide-up-panel__title">{place.place_name}</h2>

        {place.category_group_name && (
          <span className="slide-up-panel__category">{place.category_group_name}</span>
        )}

        {place.openLabel && <p className="slide-up-panel__meta">{place.openLabel}</p>}
        {distanceLabel && <p className="slide-up-panel__meta">성수역 {distanceLabel}</p>}

        <p className="slide-up-panel__meta">
          {place.road_address_name || place.address_name}
        </p>

        {place.phone && <p className="slide-up-panel__meta">{place.phone}</p>}

        <div className="slide-up-panel__actions">
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              if (place.id != null) navigate(`/places/${place.id}`, { state: { place: place.dbPlace } });
            }}
          >
            상세 보기
          </Button>
          <Button
            onClick={() => {
              onClose();
              navigate('/create-room', { state: { place } });
            }}
          >
            일정 개설
          </Button>
        </div>
      </section>
    </>
  );
}
