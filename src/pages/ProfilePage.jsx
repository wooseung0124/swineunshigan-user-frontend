import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';
import { PERSONALITY_CONNECTION_LABEL } from '../types/types';
import CameraIcon from '../components/icons/CameraIcon';

/**
 * 프로필 정보 (편집 허브)
 * - 시안: ← 프로필 정보 / 아바타(+카메라 시트) / 이름 / 성향 pill / 자기소개(입력) / 기본정보(이름·성별 변경 진입)
 * - 자기소개: 이 화면 textarea에서 직접 입력 → 저장(bio)
 * - 사진: 카메라 뱃지 → 시트. 사진 없으면 3개(카메라/갤러리/기본), 있으면 4개(삭제 추가)
 * - 이름/성별: "변경" → 별도 화면(/profile-edit/name, /profile-edit/gender)에서 저장
 * - 저장 API: api.users.update (A안: mock 경로 유지). 이 화면은 bio만 보냄.
 * - 사진 업로드(profileImageUrl)는 미리보기만, 서버 전송 X (백엔드 연동 후)
 */

const genderLabel = (g) => (g === 'MALE' ? '남성' : g === 'FEMALE' ? '여성' : '-');

// 1992-05-15 → 1992.05.15 (시안 점 표기). 값 없거나 형식 다르면 원본 그대로.
const formatBirth = (d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.replace(/-/g, '.') : (d || '-'));

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(true);

  // 편집 상태
  const [intro, setIntro] = useState('');           // 자기소개 (bio)
  const [photoPreview, setPhotoPreview] = useState(null); // objectURL (미리보기, 서버 저장 X)
  const [photoSheet, setPhotoSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.users.me()
      .then((u) => {
        setUser(u);
        setPersonality(getPersonality(u.id));
        setIntro(u.profile?.introduction ?? '');
        if (u.profileImageUrl) setPhotoPreview(u.profileImageUrl);
      })
      .catch((err) => console.error('프로필 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  // objectURL 메모리 정리
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith?.('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleComplete = () => {
    // A안: bio만 저장. 이름/성별은 각 변경 화면에서, 사진은 미리보기만.
    setSaving(true);
    api.users.update({ bio: intro })
      .then(() => navigate(-1))
      .catch((err) => alert(err.message || '저장에 실패했습니다.'))
      .finally(() => setSaving(false));
  };

  const openFilePicker = () => {
    setPhotoSheet(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    e.target.value = '';
  };

  const handleResetPhoto = () => {
    setPhotoPreview(null);
    setPhotoSheet(false);
  };

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

  const personalityLabel = personality
    ? (PERSONALITY_CONNECTION_LABEL[personality.connection] || personality.connection)
    : '이향인 성향 (필수)';

  const hasPhoto = !!photoPreview;

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>프로필 정보</h1>
        <button onClick={handleComplete} disabled={saving} style={S.completeBtn}>
          {saving ? '저장중' : '완료'}
        </button>
      </div>

      {/* 아바타 + 카메라 뱃지 + 이름 + 성향 pill */}
      <div style={S.profileTop}>
        <div style={S.avatarWrap}>
          <div style={S.avatar}>
            {photoPreview
              ? <img src={photoPreview} alt="프로필" style={S.avatarImg} />
              : <PersonIcon />}
          </div>
          <button onClick={() => setPhotoSheet(true)} style={S.cameraBadge} aria-label="프로필 사진 변경">
            <CameraIcon size={26} />
          </button>
        </div>

        <div style={S.name}>{user.name || '-'}</div>

        <button onClick={() => navigate('/personality')} style={S.personalityPill}>
          {personalityLabel}
          <span style={{ marginLeft: '4px' }}>›</span>
        </button>
      </div>

      {/* 자기소개 (입력) */}
      <div style={S.section}>
        <div style={S.sectionLabel}>자기소개</div>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="자신에 대해 설명해 주세요."
          style={S.introInput}
        />
      </div>

      <div style={S.divider} />

      {/* 기본 정보 — 이름/성별은 변경 진입, 생년월일/이메일은 표시만 */}
      <div style={S.section}>
        <div style={S.basicTitle}>기본 정보</div>

        <div style={S.infoRow}>
          <span style={S.infoLabel}>이름</span>
          <span style={S.infoRight}>
            <span style={S.infoValue}>{user.name || '-'}</span>
            <button onClick={() => navigate('/profile-edit/name')} style={S.changeBtn}>변경</button>
          </span>
        </div>

        <div style={S.infoRow}>
          <span style={S.infoLabel}>성별</span>
          <span style={S.infoRight}>
            <span style={S.infoValue}>{genderLabel(user.gender)}</span>
            <button onClick={() => navigate('/profile-edit/gender')} style={S.changeBtn}>변경</button>
          </span>
        </div>

        <div style={S.infoRow}>
          <span style={S.infoLabel}>생년월일</span>
          <span style={S.infoValue}>{formatBirth(user.profile?.birthDate)}</span>
        </div>

        <div style={S.infoRow}>
          <span style={S.infoLabel}>이메일</span>
          <span style={S.infoValue}>{user.email || '-'}</span>
        </div>
      </div>

      {/* 숨김 파일 입력 (카메라/갤러리 공용) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 사진 변경 시트 — 사진 있으면 "삭제" 추가(4개), 없으면 3개 */}
      {photoSheet && (
        <div style={S.overlay} onClick={() => setPhotoSheet(false)}>
          <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={S.sheetHeader}>
              <span style={S.sheetTitle}>프로필 사진</span>
              <button onClick={() => setPhotoSheet(false)} style={S.sheetClose} aria-label="닫기">✕</button>
            </div>
            {hasPhoto && (
              <button onClick={handleResetPhoto} style={S.sheetItem}>프로필 사진 삭제</button>
            )}
            <button onClick={openFilePicker} style={S.sheetItem}>카메라</button>
            <button onClick={openFilePicker} style={S.sheetItem}>갤러리</button>
            <button onClick={handleResetPhoto} style={S.sheetItem}>기본 이미지로 설정</button>
          </div>
        </div>
      )}
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

  profileTop: { padding: 'var(--spacing-6) var(--spacing-4)', textAlign: 'center' },
  avatarWrap: { position: 'relative', width: '80px', margin: '0 auto var(--spacing-3)' },
  avatar: {
    width: '80px', height: '80px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-card-light)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cameraBadge: {
    position: 'absolute', right: '-2px', bottom: '-2px',
    background: 'transparent', border: 'none', padding: 0,
    cursor: 'pointer', lineHeight: 0,
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
  introInput: {
    width: '100%', minHeight: '96px', padding: 'var(--spacing-3)',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-body)', lineHeight: '22px', boxSizing: 'border-box',
    fontFamily: 'inherit', color: 'var(--color-text)', resize: 'none',
  },

  divider: { height: '8px', background: 'var(--color-card-light)' },

  basicTitle: {
    fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2) 0' },
  infoLabel: { color: 'var(--color-text-light-gray)', fontSize: 'var(--font-size-body)' },
  infoRight: { display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' },
  infoValue: { color: 'var(--color-text)', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)' },
  changeBtn: {
    background: 'transparent', border: 'none', padding: 0,
    color: 'var(--color-text-light-gray)', fontSize: 'var(--font-size-body-sm)',
    textDecoration: 'underline', cursor: 'pointer',
  },

  // 사진 변경 시트
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  sheet: {
    width: '80%', maxWidth: '320px', background: 'var(--color-background)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5) var(--spacing-4)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
  },
  sheetHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 'var(--spacing-3)',
  },
  sheetTitle: {
    fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)',
  },
  sheetClose: {
    background: 'transparent', border: 'none', color: 'var(--color-text-light-gray)',
    fontSize: 'var(--font-size-body)', cursor: 'pointer', padding: 0,
  },
  sheetItem: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: 'var(--spacing-3) 0', background: 'transparent', border: 'none',
    fontSize: 'var(--font-size-body-lg)', color: 'var(--color-text)', cursor: 'pointer',
  },
};