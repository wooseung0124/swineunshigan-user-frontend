import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';
import { PERSONALITY_CONNECTION_LABEL } from '../types/types';

// 성향 테스트 외부 랜딩 (ProfileEditPage와 동일 출처). 경로 바뀌면 여기만 수정.
const PERSONALITY_TEST_URL = 'https://app.shineunsigan.com/test.html';

// NOTE(2026-06): 설명 문단/결과유형 매핑 보류.
// 요엘님 자료상 설명이 connection 6개 단일이 아니라 "결과유형 6개"이고
// 각 유형이 connection 1~3개 조합에 매핑됨 + think 축에도 별칭/설명 존재 → 데이터 구조 미확정(기획 확인 중).
// 구조 확정 전까지 이 화면은 connection 라벨(이름)만 표시. 설명/매핑은 확정 후 추가.

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
  const label = hasResult
    ? (PERSONALITY_CONNECTION_LABEL[personality.connection] || personality.connection)
    : null;

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>이향인 성향 테스트</h1>
        <button onClick={() => navigate(-1)} style={S.iconBtn} aria-label="닫기">✕</button>
      </div>

      <div style={S.body}>
        <div style={S.sectionLabel}>이향인 성향</div>

        {hasResult ? (
          <>
            {/* 결과: connection 라벨(이름)만. 설명 문단은 구조 확정 후 추가 */}
            <div style={S.resultCard}>
              <span style={S.typePill}>{label}</span>
            </div>
            <button onClick={handleRetest} style={S.retestBtn}>테스트 다시하기</button>
          </>
        ) : (
          <>
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

  resultCard: {
    padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-light)', background: 'var(--color-card-light)',
  },
  typePill: {
    display: 'inline-block', padding: 'var(--spacing-1) var(--spacing-3)',
    borderRadius: 'var(--radius-round)', background: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-body-sm)',
    fontWeight: 'var(--font-weight-semibold)',
  },

  emptyCard: {
    padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--color-border)', background: 'var(--color-card-light)',
    color: 'var(--color-text-gray)', fontSize: 'var(--font-size-body)',
  },

  retestBtn: {
    width: '100%', marginTop: 'var(--spacing-4)', padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-lg)', border: 'none',
    background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
  notice: {
    marginTop: 'var(--spacing-3)', fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-light-gray)',
  },
};