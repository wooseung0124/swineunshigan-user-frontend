import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';

const PERSONALITY_TEST_URL = 'https://app.shineunsigan.com/test.html';

const connectionImages = import.meta.glob('../assets/personality/{BM,BG,JM,GT,DS,GJ}.png', { eager: true, import: 'default' });
const thinkImages = import.meta.glob('../assets/personality/{ESSENCE,CONDITION,DEFINITION,INTUITION,RESPONSIBILITY,EVALUATION}.png', { eager: true, import: 'default' });
const getImg = (glob, code) => glob[`../assets/personality/${code}.png`] || null;

export default function PersonalityPage() {
  const navigate = useNavigate();
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users.me()
      .then((u) => setPersonality(getPersonality(u.id)))
      .catch((err) => console.error('성향 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRetest = () => {
    window.location.href = PERSONALITY_TEST_URL;
  };

  if (loading) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>불러오는 중...</p>
      </div>
    );
  }

  const hasResult = !!personality;
  const connImg = hasResult ? getImg(connectionImages, personality.connection) : null;
  const thinkImg = hasResult ? getImg(thinkImages, personality.think) : null;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>이향인 성향 테스트</h1>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="닫기">✕</button>
      </div>

      <div style={S.body}>
        {hasResult ? (
          <>
            <div style={S.resultTitle}>이향인 성향 테스트 결과</div>

            {connImg
              ? <img src={connImg} alt="나의 연결 방식" style={S.resultImg} />
              : <div style={S.emptyCard}>유형 이미지 준비 중이에요.</div>}

            <div style={S.divider} />

            {thinkImg
              ? <img src={thinkImg} alt="나의 사고 방식" style={S.resultImg} />
              : <div style={S.emptyCard}>유형 이미지 준비 중이에요.</div>}

            <button onClick={handleRetest} style={S.retestBtn}>테스트 다시하기</button>
          </>
        ) : (
          <>
            <div style={S.resultTitle}>이향인 성향 테스트 결과</div>
            <div style={S.emptyCard}>아직 성향 테스트를 하지 않으셨어요.</div>
            <button onClick={handleRetest} style={S.retestBtn}>성향 테스트 하러 가기</button>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)' },
  center: { minHeight: '100vh', background: 'var(--color-background)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-light)',
  },
  iconBtn: {
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-3)',
    color: 'var(--color-text)', cursor: 'pointer', width: '24px', padding: 0, lineHeight: 1,
  },
  headerTitle: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', margin: 0,
  },
  body: { padding: 'var(--spacing-4)', maxWidth: '520px', margin: '0 auto' },
  resultTitle: { fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', marginBottom: 'var(--spacing-4)', paddingLeft: 'var(--spacing-4)' },
  resultImg: { width: '100%', maxWidth: '360px', height: 'auto', display: 'block', margin: '0 auto', borderRadius: 'var(--radius-lg)' },
  divider: { height: '1px', background: 'var(--color-border)', margin: 'var(--spacing-6) auto', maxWidth: '360px' },
  emptyCard: {
    padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--color-border)', background: 'var(--color-card-light)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
  },
  retestBtn: {
    width: '100%', marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-lg)', border: 'none',
    background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};