import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';
import { useAuthStore, selectUser } from '../store/authStore';

const PAY_METHODS = [
  { key: 'kakao', label: '카카오페이' },
  { key: 'naver', label: '네이버페이' },
  { key: 'payco', label: '페이코' },
  { key: 'toss', label: '토스페이' },
  { key: 'lpay', label: 'L.페이' },
  { key: 'ssg', label: 'SSG페이' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore(selectUser);

  const [expanded, setExpanded] = useState(false);        // 결제수단 펼침 여부
  const [method, setMethod] = useState('card_easy');      // card_easy / easy / card_normal
  const [payBrand, setPayBrand] = useState('kakao');      // 간편결제 선택 브랜드
  const [submitting, setSubmitting] = useState(false);

  const handlePayClick = async () => {
    if (!expanded) {
      setExpanded(true); // 1차: 결제수단 펼치기
      return;
    }
    // 2차: 참여 완료 (페이크 — 실제 결제 없음)
    setSubmitting(true);
    try {
      await api.schedules.join(id, user?.id, user?.gender);
      navigate(`/schedule/${id}`, { state: { toast: '참여가 완료되었습니다' } });
    } catch (err) {
      alert(err.message || '참여에 실패했습니다.');
      setSubmitting(false);
    }
  };

  const radio = (active) => ({
    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
    border: active ? 'none' : '2px solid var(--color-border)',
    background: active ? 'var(--color-primary-500)' : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.back} aria-label="뒤로">←</button>
        <h1 style={S.headerTitle}>결제하기</h1>
        <span style={{ width: '24px' }} />
      </div>

      {/* 안내바 */}
      <div style={S.infoBar}>ⓘ 더 신뢰할 수 있는 모임 경험을 위해 예치금 결제가 필요해요</div>

      <div style={S.body}>
        {/* 결제금액 */}
        <h2 style={S.sectionTitle}>결제금액</h2>
        <div style={S.amountBox}>
          {[['판매자', '쉬는 시간'], ['상품명', '참여 예치금'], ['결제유효일', '2026.00.00 23:59']].map(([k, v]) => (
            <div key={k} style={S.row}>
              <span style={S.rowKey}>{k}</span>
              <span style={S.rowVal}>{v}</span>
            </div>
          ))}
          <div style={{ ...S.row, marginTop: 'var(--spacing-2)' }}>
            <span style={S.rowKeyBold}>결제 하실 금액</span>
            <span style={S.rowValBold}>5,000원</span>
          </div>
        </div>

        {/* 예치금 안내 */}
        <h2 style={{ ...S.sectionTitle, marginTop: 'var(--spacing-6)' }}>✓ 예치금 · 페이백 안내</h2>
        <ul style={S.noticeList}>
          <li>일정 참여 후 매칭 인증 완료 시 예치금의 n%를 페이백 해드려요</li>
          <li>페이백 내역은 [마이페이지] - [페이백 내역]에서 확인 가능하며 이후 일정 참여에 사용할 수 있어요</li>
          <li>노쇼 또는 매칭 인증 미완료 시 지급되지 않아요</li>
          <li>예치금 · 페이백의 결제 및 환불 관련 사항은 서비스 운영방침 안내를 참고해주세요</li>
        </ul>

        {/* 결제수단 */}
        <h2 style={{ ...S.sectionTitle, marginTop: 'var(--spacing-6)' }}>결제수단</h2>
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: expanded ? 1 : 0.35, pointerEvents: expanded ? 'auto' : 'none' }}>
            {/* 카드 간편결제 */}
            <button onClick={() => setMethod('card_easy')} style={S.methodRow}>
              <span style={radio(method === 'card_easy')}>{method === 'card_easy' && <span style={S.dot} />}</span>
              <span style={S.methodLabel}>카드 간편결제</span>
            </button>

            {/* 간편결제 */}
            <button onClick={() => setMethod('easy')} style={S.methodRow}>
              <span style={radio(method === 'easy')}>{method === 'easy' && <span style={S.dot} />}</span>
              <span style={S.methodLabel}>간편결제</span>
            </button>
            {method === 'easy' && (
              <div style={S.payGrid}>
                {PAY_METHODS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPayBrand(p.key)}
                    style={{
                      ...S.payChip,
                      background: payBrand === p.key ? 'var(--color-text)' : 'var(--color-card-light)',
                      color: payBrand === p.key ? 'var(--color-text-white)' : 'var(--color-text-light-gray)',
                      borderColor: payBrand === p.key ? 'var(--color-text)' : 'var(--color-border-light)',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* 카드 일반결제 */}
            <button onClick={() => setMethod('card_normal')} style={S.methodRow}>
              <span style={radio(method === 'card_normal')}>{method === 'card_normal' && <span style={S.dot} />}</span>
              <span style={S.methodLabel}>카드 일반결제</span>
            </button>
          </div>

          {/* 흐림 상태일 때 무료 안내 오버레이 */}
          {!expanded && (
            <div style={S.freeNotice}>현재는 무료로 이용 가능해요</div>
          )}
        </div>
      </div>

      {/* 하단 결제하기 */}
      <div style={S.footer}>
        <button onClick={handlePayClick} style={S.payBtn} disabled={submitting}>
          {submitting ? '처리 중...' : '결제하기'}
        </button>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)', paddingBottom: '80px' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-light)',
  },
  back: { background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-3)', color: 'var(--color-text)', cursor: 'pointer', width: '24px' },
  headerTitle: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', margin: 0 },
  infoBar: {
    background: 'var(--color-primary-100)', color: 'var(--color-primary-800)',
    padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-body-sm)',
  },
  body: { padding: 'var(--spacing-4)' },
  sectionTitle: { fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-3)' },
  amountBox: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rowKey: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-light-gray)' },
  rowVal: { fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-gray)' },
  rowKeyBold: { fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' },
  rowValBold: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' },
  noticeList: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' },
  methodRow: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3) 0', background: 'transparent', border: 'none', cursor: 'pointer',
  },
  methodLabel: { fontSize: 'var(--font-size-body)', color: 'var(--color-text)', fontWeight: 'var(--font-weight-medium)' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-text-white)' },
  payGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) 0 var(--spacing-3) var(--spacing-6)' },
  payChip: {
    padding: 'var(--spacing-3) 0', borderRadius: 'var(--radius-md)', border: '1px solid',
    fontSize: 'var(--font-size-body-sm)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
  },
  freeNotice: {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-gray)',
  },
  footer: {
    position: 'fixed', bottom: 0, left: 0, right: 0, padding: 'var(--spacing-4)',
    background: 'var(--color-background)', borderTop: '1px solid var(--color-border-light)',
  },
  payBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: 'none',
    background: 'var(--color-primary-500)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};