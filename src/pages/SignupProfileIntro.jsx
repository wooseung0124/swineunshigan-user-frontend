import { useRef } from 'react';
import profileDefaultIcon from '../assets/icons/signup-profile-default.png';
import profileCameraIcon from '../assets/icons/signup-profile-camera.png';
import { BIO_MAX_LENGTH } from '../utils/signupBio';

export default function SignupProfileIntro({
  title,
  subtitle,
  name,
  personalityHeadline,
  profileImageUrl,
  bio,
  introMode,
  onBioChange,
  onIntroModeChange,
  onProfileImageSelect,
}) {
  const fileInputRef = useRef(null);
  const bioLength = bio?.length ?? 0;
  const avatarSrc = profileImageUrl || profileDefaultIcon;

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onProfileImageSelect(file);
    }

    event.target.value = '';
  };

  return (
    <section className="signup-profile">
      <header className="signup-page__header signup-profile__header">
        <h1 className="signup-page__title">{title}</h1>
        <p className="signup-page__subtitle">{subtitle}</p>
      </header>

      <div className="signup-profile__identity">
        <div className="signup-profile__avatar-wrap">
          <img className="signup-profile__avatar" src={avatarSrc} alt="" />
          <button
            type="button"
            className="signup-profile__camera"
            aria-label="프로필 사진 변경"
            onClick={handleCameraClick}
          >
            <img className="signup-profile__camera-icon" src={profileCameraIcon} alt="" />
          </button>
          <input
            ref={fileInputRef}
            className="signup-profile__file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
          />
        </div>

        <p className="signup-profile__name">{name || '회원'}</p>

        {personalityHeadline && (
          <p className="signup-profile__badge">{personalityHeadline}</p>
        )}
      </div>

      <div className="signup-profile__intro">
        <p className="signup-profile__intro-label">자기소개 추천 문구</p>

        <div className="signup-profile__mode" role="tablist" aria-label="자기소개 작성 방식">
          <button
            type="button"
            role="tab"
            aria-selected={introMode === 'direct'}
            className={`signup-profile__mode-btn${
              introMode === 'direct' ? ' signup-profile__mode-btn--active' : ''
            }`}
            onClick={() => onIntroModeChange('direct')}
          >
            직접 작성하기
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={introMode === 'recommended'}
            className={`signup-profile__mode-btn${
              introMode === 'recommended' ? ' signup-profile__mode-btn--active' : ''
            }`}
            onClick={() => onIntroModeChange('recommended')}
          >
            추천 문구
          </button>
        </div>

        <div className="signup-profile__textarea-wrap">
          <textarea
            className="signup-profile__textarea"
            value={bio}
            maxLength={BIO_MAX_LENGTH}
            placeholder="자신에 대해 설명해 주세요"
            onChange={(event) => onBioChange(event.target.value)}
            readOnly={introMode === 'recommended'}
          />
          <span className="signup-profile__counter">
            {bioLength}/{BIO_MAX_LENGTH}
          </span>
        </div>
      </div>
    </section>
  );
}
