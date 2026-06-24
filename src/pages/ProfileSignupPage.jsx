// src/pages/ProfileSignupPage.jsx (신규)
// 경로: /signup/profile   ※ PrivateRoute 없이 (1·2단계와 동일)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getPersonality } from '../utils/personality';

const S3_READY = false;  // 재아님 S3 준비되면 true로

function ProfileSignupPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);

  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const personality = getPersonality(userId);
      // TODO(재아님 명세 확정 후): 이미지 API + profile 텍스트 API 연결
      console.log('[signup] 완료 payload(예정):', { bio, personality, hasImage: !!imageFile });
      finishSignup();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    finishSignup();
  };

  const finishSignup = () => {
    sessionStorage.removeItem('resttime:signup:pending');
    navigate('/home');
  };

  return (
    <div>
      {/* Progress 3/3 */}
      <p>마지막으로 나를 소개해주세요 (선택)</p>

      <div>
        <label>프로필 사진 (선택)</label>
        {imagePreview && <img src={imagePreview} alt="미리보기" width={80} height={80} />}
        <input type="file" accept="image/*" onChange={handlePickImage} />
      </div>

      <div>
        <label>한 줄 소개 (선택)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 100))}
          placeholder="나를 한 문장으로 소개해보세요."
          maxLength={100}
        />
        <span>{bio.length}/100</span>
      </div>

      <button onClick={handleSkip} disabled={submitting}>건너뛰기</button>
      <button onClick={handleComplete} disabled={submitting}>완료</button>
    </div>
  );
}

export default ProfileSignupPage;