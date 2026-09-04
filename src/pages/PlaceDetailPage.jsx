import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchPlaceDetail } from '../api/places';
import { formatDistance } from '../utils/geo';
import { Button } from '../components/ui';
import { createLogger } from '../utils/logger';
import { toPanelPlaceFromDb } from '../utils/placeModel';
import './PlaceDetailPage.css';

const log = createLogger('PlaceDetailPage');

/**
 * 장소 상세 페이지. 일정 찾기/개설의 시작점입니다.
 */
export default function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const seedPlace = location.state?.place || null;
  const [place, setPlace] = useState(seedPlace);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!seedPlace);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const detail = await fetchPlaceDetail(placeId);
        if (cancelled) return;
        setPlace(detail);
        setError('');
        setLoading(false);
      } catch (err) {
        log.error('detail load failed', err);
        if (cancelled) return;
        setLoading(false);
        if (!seedPlace) {
          setError('장소 정보를 불러오지 못했습니다.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placeId, seedPlace]);

  if (loading && !place) {
    return <div className="place-detail">불러오는 중…</div>;
  }

  if (error && !place) {
    return (
      <div className="place-detail">
        <p>{error}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          뒤로
        </Button>
      </div>
    );
  }

  return (
    <div className="place-detail">
      <button type="button" className="place-detail__back" onClick={() => navigate(-1)}>
        ← 뒤로
      </button>
      {place.imageUrl && <img className="place-detail__hero" src={place.imageUrl} alt="" />}
      <p className="place-detail__category">{place.category}</p>
      <h1 className="place-detail__title">{place.name}</h1>
      <p className="place-detail__meta">{place.openLabel}</p>
      <p className="place-detail__meta">성수역 {formatDistance(place.distanceMeters)}</p>
      <p className="place-detail__address">{place.address}</p>
      {place.contact && <p className="place-detail__meta">{place.contact}</p>}
      <div className="place-detail__actions">
        <Button variant="secondary">일정 찾기</Button>
        <Button
          onClick={() =>
            navigate('/create-room', { state: { place: toPanelPlaceFromDb(place) } })
          }
        >
          일정 개설
        </Button>
      </div>
    </div>
  );
}
