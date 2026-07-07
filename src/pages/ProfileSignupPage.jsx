// src/pages/ProfileSignupPage.jsx
// 경로: /signup/profile   ※ PrivateRoute 없이 (1·2단계와 동일)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/api';
import { getPersonality } from '../utils/personality';
import {
  PERSONALITY_CONNECTION_LABEL,
  PERSONALITY_THINK_ALIAS,
  PERSONALITY_CONNECTION_RECOMMEND,
  PERSONALITY_THINK_RECOMMEND,
} from '../types/types';
const S3_READY = false;  // 재아님 S3 준비되면 true로

function ProfileSignupPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const saved = getPersonality(userId);

  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bioMode, setBioMode] = useState('direct'); // 'direct' | 'recommend'

  const recommendText = saved
    ? PERSONALITY_CONNECTION_RECOMMEND[saved.connection] + ' ' + PERSONALITY_THINK_RECOMMEND[saved.think]
    : '';

  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleModeChange = (mode) => {
    setBioMode(mode);
    if (mode === 'recommend') {
      setBio(recommendText);
    } else {
      setBio('');
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const payload = {};
      if (bio.trim()) payload.bio = bio.trim();
      if (saved?.connection && saved?.think) {
        payload.personality = { connection: saved.connection, think: saved.think };
      }

      await api.users.updateMyProfile(payload);
      finishSignup();
    } catch (e) {
      console.error('[signup] 프로필 저장 실패:', e);
      finishSignup();
    } finally {
      setSubmitting(false);
    }
  };

  const finishSignup = () => {
    sessionStorage.removeItem('resttime:signup:pending');
    navigate('/home');
  };

  const connLabel = saved ? PERSONALITY_CONNECTION_LABEL[saved.connection] : null;
  const thinkLabel = saved ? PERSONALITY_THINK_ALIAS[saved.think] : null;

  return (
    <div style={S.page}>
      {/* Progress 3/3 */}
      <p style={S.title}>마지막으로 나를 소개해주세요</p>

      <div style={S.section}>
        <label style={S.label}>프로필 사진 (선택)</label>
        {imagePreview && <img src={imagePreview} alt="미리보기" width={80} height={80} style={{ borderRadius: '50%', objectFit: 'cover' }} />}
        <input type="file" accept="image/*" onChange={handlePickImage} />
      </div>

      {/* 성향 태그 */}
      {saved && (
        <div style={S.tagRow}>
          <span style={S.tag}>{connLabel}</span>
          <span style={S.tagDot}>·</span>
          <span style={S.tag}>{thinkLabel}</span>
        </div>
      )}

      <div style={S.section}>
        <label style={S.label}>한 줄 소개</label>

        {/* 토글 */}
        {saved && (
          <div style={S.toggleRow}>
            <button
              onClick={() => handleModeChange('direct')}
              style={bioMode === 'direct' ? S.toggleActive : S.toggleInactive}
            >
              직접 작성하기
            </button>
            <button
              onClick={() => handleModeChange('recommend')}
              style={bioMode === 'recommend' ? S.toggleActive : S.toggleInactive}
            >
              추천 문구
            </button>
          </div>
        )}

        {/* 추천문구 미리보기 */}
        {bioMode === 'recommend' && saved && (
          <div style={S.recommendBox}>
            {PERSONALITY_CONNECTION_RECOMMEND[saved.connection]}
            {' '}
            {PERSONALITY_THINK_RECOMMEND[saved.think]}
          </div>
        )}

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 100))}
          placeholder="나를 한 문장으로 소개해보세요."
          maxLength={100}
          style={S.textarea}
        />
        <span style={S.counter}>{bio.length}/100</span>
      </div>

      <button
        onClick={handleComplete}
        disabled={submitting || !saved}
        style={{
          ...S.completeBtn,
          background: (!submitting && saved) ? '#A8DC4F' : '#eee',
          color: (!submitting && saved) ? '#000' : '#999',
          cursor: (!submitting && saved) ? 'pointer' : 'not-allowed',
        }}
      >
        완료
      </button>
    </div>
  );
}

const S = {
  page: { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' },
  title: { fontSize: '18px', fontWeight: '700', marginBottom: '24px' },
  section: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' },
  tagRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' },
  tag: {
    fontSize: '13px', fontWeight: '600', color: '#4A7C0F',
    background: '#F0F8E0', padding: '4px 10px', borderRadius: '12px',
  },
  tagDot: { fontSize: '13px', color: '#999' },
  toggleRow: { display: 'flex', gap: '8px', marginBottom: '12px' },
  toggleActive: {
    flex: 1, padding: '10px', border: '1.5px solid #A8DC4F', borderRadius: '10px',
    background: '#F0F8E0', color: '#4A7C0F', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
  },
  toggleInactive: {
    flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '10px',
    background: '#fff', color: '#999', fontWeight: '500', fontSize: '13px', cursor: 'pointer',
  },
  recommendBox: {
    background: '#FFFDE6', border: '1px solid #F5E6A3', borderRadius: '10px',
    padding: '14px', fontSize: '13px', lineHeight: '1.6', color: '#665C2E', marginBottom: '12px',
  },
  textarea: {
    width: '100%', minHeight: '80px', padding: '12px', borderRadius: '10px',
    border: '1px solid #ddd', fontSize: '14px', resize: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  counter: { display: 'block', textAlign: 'right', fontSize: '12px', color: '#999', marginTop: '4px' },
  completeBtn: {
    width: '100%', padding: '16px', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', marginTop: '12px',
  },
};

export default ProfileSignupPage;