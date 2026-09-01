const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * @param {File} file
 * @returns {string|null}
 */
export function validateProfileImageFile(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'JPG, PNG, WEBP, GIF 형식의 이미지만 업로드할 수 있습니다.';
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return '프로필 사진은 5MB 이하만 업로드할 수 있습니다.';
  }

  return null;
}

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readProfileImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('이미지를 불러오지 못했습니다.'));
    };

    reader.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    reader.readAsDataURL(file);
  });
}
