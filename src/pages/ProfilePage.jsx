import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfilePhotoSheet from '../components/profile/ProfilePhotoSheet';
import profileDefaultIcon from '../assets/icons/signup-profile-default.png';
import profileCameraIcon from '../assets/icons/signup-profile-camera.png';
import backIcon from '../assets/icons/mypage-back.png';
import { readProfileImageAsDataUrl, validateProfileImageFile } from '../utils/profileImage';
import {
  getUserProfile,
  syncUserFromServer,
  updateStoredUser,
} from '../utils/userProfile';
import './ProfilePage.css';

function BasicInfoRow({ label, value, onChange }) {
  return (
    <div className="profile-page__info-row">
      <span className="profile-page__info-label">{label}</span>
      <div className="profile-page__info-value-wrap">
        <span className="profile-page__info-value">{value}</span>
        {onChange && (
          <button type="button" className="profile-page__info-change" onClick={onChange}>
            변경
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProfile = useMemo(() => getUserProfile(), []);
  const [profile, setProfile] = useState(initialProfile);
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      await syncUserFromServer();

      if (isMounted) {
        setProfile(getUserProfile());
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [location.key]);
  const avatarSrc = profile.profileImageUrl || profileDefaultIcon;

  const syncProfile = () => {
    setProfile(getUserProfile());
  };

  const handleProfileImageSelect = async (file) => {
    const validationError = validateProfileImageFile(file);

    if (validationError) {
      window.alert(validationError);
      return;
    }

    try {
      const profileImageUrl = await readProfileImageAsDataUrl(file);
      updateStoredUser({ profileImageUrl });
      syncProfile();
    } catch {
      window.alert('프로필 사진을 불러오지 못했습니다.');
    }
  };

  const handleResetProfileImage = () => {
    updateStoredUser({ profileImageUrl: '' });
    syncProfile();
  };

  const handleBioChange = (event) => {
    const bio = event.target.value;
    setProfile((prev) => ({ ...prev, bio }));
  };

  const handleBioBlur = () => {
    updateStoredUser({ bio: profile.bio.trim() });
    syncProfile();
  };

  const handleNameChange = () => {
    navigate('/mypage/profile/edit-name');
  };

  const handleGenderChange = () => {
    navigate('/mypage/profile/edit-gender');
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <button
          type="button"
          className="profile-page__header-btn"
          onClick={() => navigate('/mypage')}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" />
        </button>
        <h1 className="profile-page__title">프로필 정보</h1>
        <span className="profile-page__header-spacer" aria-hidden="true" />
      </header>

      <section className="profile-page__hero">
        <div className="profile-page__avatar-wrap">
          <img className="profile-page__avatar" src={avatarSrc} alt="" />
          <label
            className="profile-page__camera"
            aria-label="프로필 사진 변경"
            onClick={() => setIsPhotoSheetOpen(true)}
          >
            <img className="profile-page__camera-icon" src={profileCameraIcon} alt="" />
          </label>
        </div>
        <p className="profile-page__name">{profile.name}</p>

        {profile.personalityHeadline ? (
          <button
            type="button"
            className="profile-page__personality-badge"
            onClick={() => navigate('/mypage/profile/personality')}
          >
            {profile.personalityHeadline}
          </button>
        ) : (
          <button
            type="button"
            className="profile-page__personality-badge profile-page__personality-badge--empty"
            onClick={() => {
              window.location.assign('/test');
            }}
          >
            성향 테스트하기
          </button>
        )}
      </section>

      <section className="profile-page__section">
        <h2 className="profile-page__section-title">자기소개</h2>
        <textarea
          className="profile-page__bio"
          value={profile.bio}
          placeholder="자신에 대해 설명해 주세요"
          onChange={handleBioChange}
          onBlur={handleBioBlur}
        />
      </section>

      <section className="profile-page__section">
        <h2 className="profile-page__section-title">기본 정보</h2>
        <div className="profile-page__info-list">
          <BasicInfoRow label="이름" value={profile.name} onChange={handleNameChange} />
          <BasicInfoRow label="성별" value={profile.gender} onChange={handleGenderChange} />
          <BasicInfoRow label="생년월일" value={profile.birthDate} />
          <BasicInfoRow label="이메일" value={profile.email} />
        </div>
      </section>

      <ProfilePhotoSheet
        isOpen={isPhotoSheetOpen}
        onClose={() => setIsPhotoSheetOpen(false)}
        hasCustomPhoto={Boolean(profile.profileImageUrl)}
        onSelectFile={handleProfileImageSelect}
        onResetDefault={handleResetProfileImage}
        onDeletePhoto={handleResetProfileImage}
      />
    </div>
  );
}
