import { useNavigate, useLocation } from 'react-router-dom';
import completeCheck from '../components/icons/check-circle-bold.svg';
export default function PaymentCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const info = state?.info || {};  // 결제 페이지에서 넘긴 일정 정보

  return (
    <div style={S.page}>
      <div style={S.body}>
      <img src={completeCheck} alt="완료" style={{ width: '80px', height: '80px', marginBottom: 'var(--spacing-5)' }} />
        <h1 style={S.title}>일정 참여가 완료되었습니다</h1>
        <p style={S.sub}>시간과 장소를 꼭 준수해주세요</p>

        <div style={S.infoBox}>
          {[
            ['장소', info.place || '-'],
            ['일시', info.dateTime || '-'],
            ['카테고리', info.category || '-'],
            ['모집인원', info.members || '-'],
            ['결제금액', '0 원'],
          ].map(([k, v]) => (
            <div key={k} style={S.row}>
              <span style={S.rowKey}>{k}</span>
              <span style={S.rowVal}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.footer}>
        <button onClick={() => navigate('/home')} style={S.btnGhost}>홈으로</button>
        <button onClick={() => navigate(`/schedule/${info.id}`)} style={S.btnPrimary}>일정 보러가기</button>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--color-background)', display: 'flex', flexDirection: 'column' },
  body: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-6)' },
  checkCircle: {
    width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-primary-500)',
    color: 'var(--color-text-white)', fontSize: '40px', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-5)',
  },
  title: { fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-2)', textAlign: 'center' },
  sub: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)', margin: 0, marginBottom: 'var(--spacing-6)', textAlign: 'center' },
  infoBox: {
    width: '100%', maxWidth: '360px', background: 'var(--color-card-light)', borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)',
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rowKey: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)' },
  rowVal: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text)', fontWeight: 'var(--font-weight-medium)' },
  footer: { display: 'flex', gap: 'var(--spacing-2)', padding: 'var(--spacing-4)' },
  btnGhost: {
    flex: 1, padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer',
  },
  btnPrimary: {
    flex: 1, padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: 'none',
    background: 'var(--color-primary-500)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};