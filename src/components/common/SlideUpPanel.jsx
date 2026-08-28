import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import './SlideUpPanel.css';

export default function SlideUpPanel({ place, onClose }) {
  const navigate = useNavigate();

  if (!place) return null;

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

        <p className="slide-up-panel__meta">
          {place.road_address_name || place.address_name}
        </p>

        {place.phone && <p className="slide-up-panel__meta">{place.phone}</p>}

        <div className="slide-up-panel__actions">
          <Button variant="secondary">방 조회하기</Button>
          <Button
            onClick={() => {
              onClose();
              navigate('/create-room', { state: { place } });
            }}
          >
            방 만들기
          </Button>
        </div>
      </section>
    </>
  );
}
