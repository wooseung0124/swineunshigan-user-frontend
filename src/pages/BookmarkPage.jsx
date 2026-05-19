import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// 책갈피 페이지 (디자인 시안 수령 후 본격 구현 예정)
// 라우트: /bookmarks (로그인 필요)

export default function BookmarkPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text)',
    }}>
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
          책갈피
        </h1>
      </header>

      <div style={{ padding: 'var(--spacing-4)' }}>
        <Card padding="md">
          책갈피 페이지 (로그인 필수)
        </Card>
      </div>
    </div>
  );
}
