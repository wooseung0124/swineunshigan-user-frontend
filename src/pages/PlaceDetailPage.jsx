import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import {
  isOpenNow,
  getTodayHoursLabel,
  getWeeklyHoursLabels,
} from '../utils/operations';

// 장소 상세 페이지
// - 라우트: /place/:id
// - 응답 구조: { place, images, operations } (백엔드 명세 5/21)
// - 디자인 시안 수령 후 본격 스타일링 예정 (현재는 데이터 흐름 + CSS 변수 토큰 기본 사용)

export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [detail, setDetail] = useState(null); // { place, images, operations }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.places.detail(id)
      .then(data => { if (alive) setDetail(data); })
      .catch(err => {
        console.error('[PlaceDetailPage] detail 실패', err);
        if (alive) setError(err);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  // 영업 상태 (mock/실 응답 둘 다 operations 배열이 있으면 동작)
  const operations = detail?.operations || [];
  const openNow = isOpenNow(operations);
  const todayHours = getTodayHoursLabel(operations);
  const weekly = getWeeklyHoursLabels(operations);

  // 대표 이미지 우선, 없으면 첫 번째, 그것도 없으면 null
  const images = detail?.images || [];
  const mainImage = images.find(img => img.isMain) || images[0] || null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text)',
    }}>
      {/* 헤더 */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <Button variant="ghost" size="md" onClick={() => navigate(-1)}>←</Button>
        <h1 style={{
          fontSize: 'var(--font-size-heading-3)',
          fontWeight: 'var(--font-weight-bold)',
          margin: 0,
        }}>
          장소 상세
        </h1>
      </header>

      {/* 본문 */}
      <div style={{ padding: 'var(--spacing-4)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
            장소 정보를 불러오지 못했습니다.
          </div>
        ) : !detail ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
            장소 정보가 없습니다.
          </div>
        ) : (
          <>
            {/* 대표 이미지 */}
            {mainImage && (
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <img
                  src={mainImage.imageUrl}
                  alt={detail.place.name}
                  style={{
                    width: '100%',
                    aspectRatio: '3 / 2',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* 장소 기본 정보 */}
            <Card padding="md">
              <div style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                {detail.place.category}
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'var(--font-weight-bold)',
                margin: '0 0 8px',
              }}>
                {detail.place.name}
              </h2>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                {detail.place.address}
              </div>
              {detail.place.contact && (
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  {detail.place.contact}
                </div>
              )}
              {detail.place.snsLink && (
                <div style={{ fontSize: '14px' }}>
                  <a
                    href={detail.place.snsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit' }}
                  >
                    {detail.place.snsLink}
                  </a>
                </div>
              )}
            </Card>

            {/* 영업 상태 + 오늘 영업시간 */}
            <div style={{ marginTop: 'var(--spacing-4)' }}>
              <Card padding="md">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'var(--font-weight-bold)',
                  }}>
                    {openNow ? '영업중' : '영업 종료'}
                  </span>
                  {todayHours && (
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      오늘 {todayHours}
                    </span>
                  )}
                </div>

                {/* 주간 영업시간 */}
                <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                  {weekly.map(({ dayEnum, day, hours, isToday }) => (
                    <div
                      key={dayEnum}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        fontSize: '13px',
                        fontWeight: isToday ? 'var(--font-weight-bold)' : '400',
                      }}
                    >
                      <span>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 추가 이미지들 (대표 외) */}
            {images.length > 1 && (
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <Card padding="md">
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: '12px',
                  }}>
                    사진
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {images.filter(img => !img.isMain || img.id !== mainImage?.id).map(img => (
                      <img
                        key={img.id}
                        src={img.imageUrl}
                        alt=""
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}