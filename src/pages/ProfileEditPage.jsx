import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import CameraIcon from '../components/icons/CameraIcon';

/**
 * 프로필 수정 (2안 분리 확정 / 승우님)
 * - 시안: ← 프로필 수정 / 완료(우측) / 아바타+카메라 / 닉네임 입력
 * - 닉네임 = 모델에 필드 없음 → mock 진행 (백엔드 재아님 대기)
 * - 성별 수정은 한솔님 디자인 나오면 추가 (승우님 추가요청)
 * - 사진: 갤러리/카메라 = 파일선택→미리보기(브라우저 objectURL). 서버 업로드는 베타 후.
 *         기본 이미지로 설정 = 미리보기 비우기.
 * - 하단 네비 없음(Layout 밖)
 */

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null); // objectURL (미리보기용, 서버 저장 X)
  const [photoSheet, setPhotoSheet] = useState(false);     // 사진 변경 팝업 열림
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.users.me()
      .then((u) => {
        setNickname(u.nickname ?? u.name ?? '');
        if (u.profileImageUrl) setPhotoPreview(u.profileImageUrl);
      })
      .catch((err) => console.error('프로필 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  // objectURL 메모리 정리 (미리보기 바뀌거나 언마운트 시)
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith?.('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleComplete = () => {
    // mock 저장. 백엔드 nickname/profileImageUrl 필드 생기면 페이로드에 반영.
    api.users.update({ nickname })
      .then(() => navigate(-1))
      .catch((err) => alert(err.message || '저장에 실패했습니다.'));
  };

  const openFilePicker = () => {
    setPhotoSheet(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 브라우저 미리보기만. 실제 업로드는 베타 후(profileImageUrl 백엔드 연동).
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    e.target.value = ''; // 같은 파일 다시 선택 가능하게 초기화
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

  return (
    <div style={S.page}>
      {/* 헤더 */}
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn} aria-label="뒤로가기">←</button>
        <h1 style={S.headerTitle}>프로필 수정</h1>
        <button onClick={handleComplete} style={S.completeBtn}>완료</button>
      </div>

      {/* 아바타 + 카메라 */}
      <div style={S.avatarSection}>
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
      </div>

      {/* 닉네임 */}
      <div style={S.body}>
        <label style={S.label}>닉네임</label>
        <div style={S.inputWrap}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            style={S.input}
          />
          {nickname && (
            <button onClick={() => setNickname('')} style={S.clearBtn} aria-label="지우기">✕</button>
          )}
        </div>
      </div>

      {/* 숨김 파일 입력 (갤러리/카메라 공용) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 사진 변경 팝업 (시안: 카메라/갤러리/기본이미지로 설정) */}
      {photoSheet && (
        <div style={S.overlay} onClick={() => setPhotoSheet(false)}>
          <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={S.sheetTitle}>프로필 사진</div>
            {/* 카메라: PC 웹은 capture 무의미해 갤러리와 동일하게 파일선택. 모바일 웹은 카메라 열림 */}
            <button onClick={openFilePicker} style={S.sheetItem}>카메라</button>
            <button onClick={openFilePicker} style={S.sheetItem}>갤러리</button>
            <button onClick={handleResetPhoto} style={S.sheetItem}>기본 이미지로 설정</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** 기본 아바타 실루엣 */
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

  avatarSection: { padding: 'var(--spacing-6) var(--spacing-4)', textAlign: 'center' },
  avatarWrap: { position: 'relative', width: '80px', margin: '0 auto' },
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

  body: { padding: '0 var(--spacing-4)' },
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

  // 사진 변경 팝업
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  sheet: {
    width: '80%', maxWidth: '320px', background: 'var(--color-background)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5) var(--spacing-4)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
  },
  sheetTitle: {
    fontSize: 'var(--font-size-heading-4)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-3)',
  },
  sheetItem: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: 'var(--spacing-3) 0', background: 'transparent', border: 'none',
    fontSize: 'var(--font-size-body-lg)', color: 'var(--color-text)', cursor: 'pointer',
  },
};