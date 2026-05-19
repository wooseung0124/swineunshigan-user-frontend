import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// 장소 상세 페이지 (디자인 시안 수령 후 본격 구현 예정)
// 라우트: /place/:id

export default function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

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
        <Card padding="md">
          장소 ID: {id} 상세 페이지
        </Card>
      </div>
    </div>
  );
}
