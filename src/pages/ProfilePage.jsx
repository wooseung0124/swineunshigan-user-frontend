import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';
import { PERSONALITY_CONNECTION_LABEL } from '../types/types';
import PencilIcon from '../components/icons/PencilIcon';
import BellIcon from '../components/icons/BellIcon';

/**
 * 프로필 정보 (보기 전용)
 * - 시안: ← 프로필 정보 / 아바타(+연필) / 이름 / 성향 pill / 자기소개 / 기본정보
 * - 편집은 /profile-edit 에서. 이 화면은 읽기 전용.
 * - 하단 네비 없음(Layout 밖). 라우터에서 Layout 미적용으로 등록.
 */

const genderLabel = (g) => (g === 'MALE' ? '남성' : g === 'FEMALE' ? '여성' : '-');

// 1992-05-15 → 1992.05.15 (시안 점 표기). 값 없거나 형식 다르면 원본 그대로.
const formatBirth = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.replace(/-/g, '.') : (d || '-'));

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users.me()
      .then((u) => {
        setUser(u);
        setPersonality(getPersonality(u.id));
      })
      .catch((err) => console.error('프로필 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={S.center}>
        <p style={{ color: 'var(--color-text-light-gray)' }}>정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  // 성향: connection 라벨만 표시(확정). 데이터 있으면 라벨, 없으면 "(필수)" 안내.
  const personalityLabel = personality
    ? (PERSONALITY_CONNECTION_LABEL[personality.connection] || personality.connection)
    : '이향인 성향 (필수)';

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>프로필 정보</h1>
        <span style={{ width: '24px' }} />
      </div>

      {/* 아바타 + 이름 + 성향 pill */}
      <div style={S.profileTop}>
        <div style={S.avatarWrap}>
          <div style={S.avatar}>
            {user.profileImageUrl
              ? <img src={user.profileImageUrl} alt="프로필" style={S.avatarImg} />
              : <PersonIcon />}
          </div>
          {/* 사진 수정 진입(현재는 /profile-edit). 업로드 기능은 후순위 */}
          <button onClick={() => navigate('/profile-edit')} style={S.editBadge} aria-label="프로필 사진 수정">
  <PencilIcon size={16} color="var(--color-text)" />
</button>
        </div>

        <div style={S.name}>{user.name || '-'}</div>

        {/* 성향 pill → 성향 상세 화면(아직 미구현, 다음 단계) */}
        <button onClick={() => navigate('/personality')} style={S.personalityPill}>
          {personalityLabel}
          <span style={{ marginLeft: '4px' }}>›</span>
        </button>
      </div>

      {/* 자기소개 (읽기전용) */}
      <div style={S.section}>
        <div style={S.sectionLabel}>자기소개</div>
        <div style={S.introBox}>
          {user.profile?.introduction
            ? <span style={{ color: 'var(--color-text)' }}>{user.profile.introduction}</span>
            : <span style={{ color: 'var(--color-text-placeholder)' }}>아직 작성하지 않았어요.</span>}
        </div>
      </div>

      <div style={S.divider} />

      {/* 기본 정보 */}
      <div style={S.section}>
        <div style={S.basicTitle}>기본 정보</div>
        {[
          { label: '이름', value: user.name },
          { label: '성별', value: genderLabel(user.gender) },
          { label: '생년월일', value: formatBirth(user.profile?.birthDate) },
          { label: '이메일', value: user.email },
        ].map((item) => (
          <div key={item.label} style={S.infoRow}>
            <span style={S.infoLabel}>{item.label}</span>
            <span style={S.infoValue}>{item.value || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 기본 아바타 실루엣 (사진 없을 때) */
function PersonIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="var(--color-text-light-gray)" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
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
    width: '24px', padding: 0, lineHeight: 1,
  },
  headerTitle: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', margin: 0,
  },

  profileTop: { padding: 'var(--spacing-6) var(--spacing-4)', textAlign: 'center' },
  avatarWrap: { position: 'relative', width: '80px', margin: '0 auto var(--spacing-3)' },
  avatar: {
    width: '80px', height: '80px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-card-light)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  editBadge: {
    position: 'absolute', right: '-2px', bottom: '-2px',
    width: '26px', height: '26px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-background)', border: '1px solid var(--color-border)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontSize: 'var(--font-size-body-sm)', cursor: 'pointer', padding: 0,
  },
  name: {
    fontSize: 'var(--font-size-heading-2)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-2)',
  },
  personalityPill: {
    display: 'inline-flex', alignItems: 'center',
    padding: 'var(--spacing-1) var(--spacing-3)', borderRadius: 'var(--radius-round)',
    background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)',
    border: 'none', fontSize: 'var(--font-size-body-sm)', fontWeight: 'var(--font-weight-semibold)',
    cursor: 'pointer',
  },

  section: { padding: 'var(--spacing-4)' },
  sectionLabel: {
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },
  introBox: {
    minHeight: '96px', padding: 'var(--spacing-3)',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-body)', lineHeight: '22px',
  },

  divider: { height: '8px', background: 'var(--color-card-light)' },

  basicTitle: {
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2) 0' },
  infoLabel: { color: 'var(--color-text-light-gray)', fontSize: 'var(--font-size-body)' },
  infoValue: { color: 'var(--color-text)', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)' },
};