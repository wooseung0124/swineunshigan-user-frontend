import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

/**
 * 성별 변경 (시안: ← 성별 변경 / 완료 / 라디오 남자·여자)
 * - 진입: 프로필 정보(허브) 기본정보 "성별" 변경 버튼
 * - 저장: api.users.update({ gender }) — 부분저장(PATCH). 이 화면은 gender만 보냄
 * - gender 값은 백엔드 enum 'MALE'/'FEMALE'. 화면 표시는 "남자/여자"
 * - 성공 → 허브 복귀
 */

const OPTIONS = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
];

export default function GenderEditPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.users.me()
      .then((u) => setGender(u.gender ?? null))
      .catch((err) => console.error('성별 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = () => {
    if (!gender) {
      alert('성별을 선택해 주세요.');
      return;
    }
    setSaving(true);
    api.users.update({ gender })
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
        <h1 style={S.headerTitle}>성별 변경</h1>
        <button onClick={handleComplete} disabled={saving} style={S.completeBtn}>
          {saving ? '저장중' : '완료'}
        </button>
      </div>

      {/* 성별 라디오 */}
      <div style={S.body}>
        <label style={S.label}>성별</label>
        {OPTIONS.map((opt) => {
          const selected = gender === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setGender(opt.value)}
              style={S.optionRow}
              aria-pressed={selected}
            >
              <span style={selected ? S.radioOn : S.radioOff}>
                {selected && <span style={S.radioDot} />}
              </span>
              <span style={S.optionLabel}>{opt.label}</span>
            </button>
          );
        })}
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
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },
  optionRow: {
    display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
    width: '100%', padding: 'var(--spacing-3) 0',
    background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
  },
  radioOff: {
    width: '20px', height: '20px', borderRadius: 'var(--radius-round)',
    border: '2px solid var(--color-border)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  radioOn: {
    width: '20px', height: '20px', borderRadius: 'var(--radius-round)',
    border: '2px solid var(--color-primary)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  radioDot: {
    width: '10px', height: '10px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-primary)',
  },
  optionLabel: { fontSize: 'var(--font-size-body-lg)', color: 'var(--color-text)' },
};