/**
 * @returns {Record<string, unknown>|null}
 */
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null');
  } catch {
    return null;
  }
}

/**
 * @param {unknown} gender
 * @returns {string}
 */
export function formatGenderLabel(gender) {
  if (gender === 'MALE') {
    return '남성';
  }

  if (gender === 'FEMALE') {
    return '여성';
  }

  return '-';
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatBirthDateDisplay(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return '-';
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length === 8) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
  }

  return value;
}

/**
 * @returns {{
 *   name: string,
 *   email: string,
 *   gender: string,
 *   genderValue: string,
 *   birthDate: string,
 *   bio: string,
 *   profileImageUrl: string,
 *   personalityHeadline: string,
 * }}
 */
export function getUserProfile() {
  const user = getStoredUser() ?? {};

  return {
    name: String(user.name || user.nickname || '회원'),
    email: String(user.email || '-'),
    gender: formatGenderLabel(user.gender),
    genderValue: String(user.gender || ''),
    birthDate: formatBirthDateDisplay(user.birthDate),
    bio: String(user.bio || ''),
    profileImageUrl: String(user.profileImageUrl || ''),
    personalityHeadline: String(user.personalityHeadline || ''),
  };
}

/**
 * @param {Record<string, unknown>} updates
 * @returns {Record<string, unknown>|null}
 */
export function updateStoredUser(updates) {
  const current = getStoredUser();

  if (!current) {
    return null;
  }

  const nextUser = { ...current, ...updates };
  localStorage.setItem('user', JSON.stringify(nextUser));
  return nextUser;
}
