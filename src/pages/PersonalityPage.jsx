import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';
import {
  PERSONALITY_CONNECTION_LABEL,
  PERSONALITY_CONNECTION_DESC,
  PERSONALITY_THINK_LABEL,
  PERSONALITY_THINK_ALIAS,
  PERSONALITY_THINK_DESC,
} from '../types/types';

// 성향 테스트 외부 랜딩 (ProfileEditPage와 동일 출처). 경로 바뀌면 여기만 수정.
const PERSONALITY_TEST_URL = 'https://app.shineunsigan.com/test.html';

/**
 * 이향인 성향 테스트 결과 화면 (요엘님 확정)
 * - connection 섹션: 이름(LABEL) + 설명(DESC)
 * - think 섹션: 별칭(ALIAS) 제목 + 기본이름(LABEL) 배지 + 설명(DESC)
 * - 30일 제약: 후순위, 버튼 항상 활성
 * - 하단 네비 없음(Layout 밖)
 */

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

  // connection
  const connLabel = hasResult ? (PERSONALITY_CONNECTION_LABEL[personality.connection] || personality.connection) : null;
  const connDesc = hasResult ? PERSONALITY_CONNECTION_DESC[personality.connection] : null;

  // think
  const thinkAlias = hasResult ? (PERSONALITY_THINK_ALIAS[personality.think] || PERSONALITY_THINK_LABEL[personality.think] || personality.think) : null;
  const thinkLabel = hasResult ? (PERSONALITY_THINK_LABEL[personality.think] || personality.think) : null;
  const thinkDesc = hasResult ? PERSONALITY_THINK_DESC[personality.think] : null;

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>이향인 성향 테스트</h1>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="닫기">✕</button>
      </div>

      <div style={S.body}>
        {hasResult ? (
          <>
            {/* connection 섹션: 이름 + 설명 */}
            <div style={S.sectionLabel}>이향인 성향</div>
            <div style={S.card}>
              <span style={S.pill}>{connLabel}</span>
              {connDesc
                ? <p style={S.desc}>{connDesc}</p>
                : <p style={S.descMuted}>유형 설명 준비 중이에요.</p>}
            </div>

            {/* think 섹션: 별칭 제목 + 기본이름 배지 + 설명 */}
            <div style={{ ...S.sectionLabel, marginTop: 'var(--spacing-6)' }}>사고 방식</div>
            <div style={S.card}>
              <div style={S.thinkHead}>
                <span style={S.thinkAlias}>{thinkAlias}</span>
                <span style={S.thinkBadge}>{thinkLabel}</span>
              </div>
              {thinkDesc
                ? <p style={S.desc}>{thinkDesc}</p>
                : <p style={S.descMuted}>유형 설명 준비 중이에요.</p>}
            </div>

            <button onClick={handleRetest} style={S.retestBtn}>테스트 다시하기</button>
          </>
        ) : (
          <>
            <div style={S.sectionLabel}>이향인 성향</div>
            <div style={S.emptyCard}>아직 성향 테스트를 하지 않으셨어요.</div>
            <button onClick={handleRetest} style={S.retestBtn}>성향 테스트 하러 가기</button>
          </>
        )}

        <p style={S.notice}>*테스트는 30일마다 1회 새로 진행할 수 있어요.</p>
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

  body: { padding: 'var(--spacing-4)' },
  sectionLabel: {
    fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },

  card: {
    padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-light)', background: 'var(--color-card-light)',
  },
  pill: {
    display: 'inline-block', padding: 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--radius-round)', background: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-body-sm)',
    fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-3)',
  },

  thinkHead: {
    display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-3)', flexWrap: 'wrap',
  },
  thinkAlias: {
    fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-primary-dark)',
  },
  thinkBadge: {
    display: 'inline-block', padding: '2px var(--spacing-2)',
    borderRadius: 'var(--radius-round)', background: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-caption)',
    fontWeight: 'var(--font-weight-semibold)',
  },

  desc: { margin: 0, fontSize: 'var(--font-size-body)', lineHeight: '22px', color: 'var(--color-text)' },
  descMuted: { margin: 0, fontSize: 'var(--font-size-body)', color: 'var(--color-text-placeholder)' },

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
  notice: {
    marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-light-gray)',
  },
};