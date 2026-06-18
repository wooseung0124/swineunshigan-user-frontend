import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

/**
 * 이름 변경 (사진4)
 * - 시안: ← 이름 변경 / 완료(우측) / 이름 라벨 + 입력칸(✕ 클리어)
 * - 진입: 프로필 정보(허브) 기본정보 "이름" 변경 버튼
 * - 저장: api.users.update({ name }) — 부분저장(PATCH). 이 화면은 name만 보냄
 * - 성공 → 허브 복귀(navigate(-1))
 * - 하단 네비 포함(라우터에서 Layout 적용 시). 현재 Layout 적용 여부는 라우터 설정 따름
 */

export default function NameEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.users.me()
      .then((u) => setName(u.name ?? ''))
      .catch((err) => console.error('이름 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert('이름을 입력해 주세요.');
      return;
    }
    setSaving(true);
    api.users.update({ name: trimmed })
      .then(() => navigate(-1))
      .catch((err) => alert(err.message || '저장에 실패했습니다.'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>이름 변경</h1>
        <button onClick={handleComplete} disabled={saving} style={S.completeBtn}>
          {saving ? '저장중' : '완료'}
        </button>
      </div>

      {/* 이름 입력 */}
      <div style={S.body}>
        <label style={S.label}>이름</label>
        <div style={S.inputWrap}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={S.input}
            autoFocus
          />
          {name && (
            <button onClick={() => setName('')} style={S.clearBtn} aria-label="지우기">✕</button>
          )}
        </div>
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
  backBtn: {
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-1)',
    fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', cursor: 'pointer',
    width: '24px', padding: 0, lineHeight: 1, textAlign: 'left',
  },
  headerTitle: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', margin: 0,
  },
  completeBtn: {
    background: 'transparent', border: 'none', color: 'var(--color-primary-dark)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
    padding: 0,
  },

  body: { padding: 'var(--spacing-4)' },
  label: {
    display: 'block', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-2)',
  },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: {
    width: '100%', padding: 'var(--spacing-3)', paddingRight: 'var(--spacing-10)',
    borderRadius: 'var(--radius-base)', border: '1px solid var(--color-border)',
    fontSize: 'var(--font-size-body)', boxSizing: 'border-box',
    fontFamily: 'inherit', color: 'var(--color-text)',
  },
  clearBtn: {
    position: 'absolute', right: 'var(--spacing-3)',
    background: 'var(--color-text-light-gray)', border: 'none', borderRadius: 'var(--radius-round)',
    width: '18px', height: '18px', color: 'var(--color-background)',
    fontSize: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: 0, lineHeight: 1,
  },
};