import { useEffect, useRef } from 'react';
import './ProfilePhotoSheet.css';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 5 15 15M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 프로필 사진 변경 옵션 시트.
 */
export default function ProfilePhotoSheet({
  isOpen,
  onClose,
  hasCustomPhoto = false,
  onSelectFile,
  onResetDefault,
  onDeletePhoto,
}) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onSelectFile(file);
      onClose();
    }

    event.target.value = '';
  };

  const handleResetDefault = () => {
    onResetDefault();
    onClose();
  };

  const handleDeletePhoto = () => {
    onDeletePhoto();
    onClose();
  };

  return (
    <div className="profile-photo-sheet__overlay" role="presentation" onClick={onClose}>
      <section
        className="profile-photo-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-photo-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="profile-photo-sheet__header">
          <h2 id="profile-photo-sheet-title" className="profile-photo-sheet__title">
            프로필 사진
          </h2>
          <button
            type="button"
            className="profile-photo-sheet__close"
            aria-label="닫기"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="profile-photo-sheet__options">
          {hasCustomPhoto && (
            <button
              type="button"
              className="profile-photo-sheet__option"
              onClick={handleDeletePhoto}
            >
              프로필 사진 삭제
            </button>
          )}
          <button
            type="button"
            className="profile-photo-sheet__option"
            onClick={() => cameraInputRef.current?.click()}
          >
            카메라
          </button>
          <button
            type="button"
            className="profile-photo-sheet__option"
            onClick={() => galleryInputRef.current?.click()}
          >
            갤러리
          </button>
          <button
            type="button"
            className="profile-photo-sheet__option"
            onClick={handleResetDefault}
          >
            기본 이미지로 설정
          </button>
        </div>

        <input
          ref={cameraInputRef}
          className="profile-photo-sheet__file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          capture="user"
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          className="profile-photo-sheet__file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
        />
      </section>
    </div>
  );
}
