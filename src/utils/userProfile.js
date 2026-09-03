import { apiUrl, getApiBaseUrl } from './api';

const PROFILE_EXTENSION_KEY = 'userProfileExtension';
const PROFILE_IMAGE_KEY = 'userProfileImage';
const PROFILE_CACHE_KEY = 'profileCacheByEmail';

/**
 * @returns {string}
 */
function getApiAssetBaseUrl() {
  return getApiBaseUrl();
}

/**
 * @param {...unknown} values
 * @returns {unknown}
 */
function pickFirstValue(...values) {
  for (const value of values) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }

    return value;
  }

  return '';
}

/**
 * @param {unknown} source
 * @returns {Record<string, unknown>}
 */
function extractUserLayers(source) {
  if (!source || typeof source !== 'object') {
    return {};
  }

  const record = /** @type {Record<string, unknown>} */ (source);
  const layers = [
    record,
    record.user,
    record.profile,
    record.member,
    record.memberProfile,
    record.userProfile,
    record.userInfo,
  ].filter((item) => item && typeof item === 'object');

  return Object.assign({}, ...layers);
}

/**
 * @param {...Record<string, unknown>|null|undefined} sources
 */
export function flattenUserRecord(...sources) {
  const merged = sources.reduce(
    (acc, source) => ({ ...acc, ...extractUserLayers(source) }),
    {},
  );

  return normalizeUserRecord(merged);
}

/**
 * @param {unknown} url
 * @returns {string}
 */
function resolveProfileImageUrl(url) {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return '';
  }

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    const assetBase = getApiAssetBaseUrl();

    if (assetBase) {
      return `${assetBase}${trimmed}`;
    }

    return trimmed;
  }

  return trimmed;
}

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
 * @returns {Record<string, unknown>}
 */
export function getProfileExtension() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(PROFILE_EXTENSION_KEY) ??
        sessionStorage.getItem(PROFILE_EXTENSION_KEY) ??
        '{}',
    );
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * @param {unknown} email
 * @returns {string}
 */
function getProfileCacheKey(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * @returns {Record<string, Record<string, unknown>>}
 */
function readProfileCacheMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_CACHE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * @param {unknown} email
 * @returns {Record<string, unknown>}
 */
export function getCachedProfileForEmail(email) {
  const cacheKey = getProfileCacheKey(email);

  if (!cacheKey) {
    return {};
  }

  const cached = normalizeUserRecord(readProfileCacheMap()[cacheKey] || {});
  const cachedImage = getCachedProfileImageForEmail(email);

  return normalizeUserRecord({
    ...cached,
    profileImageUrl: pickFirstValue(cached.profileImageUrl, cachedImage),
  });
}

/**
 * @param {unknown} email
 * @param {Record<string, unknown>} payload
 */
function cacheProfileForEmail(email, payload) {
  const cacheKey = getProfileCacheKey(email);

  if (!cacheKey) {
    return;
  }

  const map = readProfileCacheMap();
  const existing = normalizeUserRecord(map[cacheKey] || {});
  const next = normalizeUserRecord(payload);

  map[cacheKey] = {
    name: pickFirstValue(next.name, existing.name) || '',
    email: pickFirstValue(next.email, existing.email) || '',
    gender: pickFirstValue(next.gender, existing.gender) || '',
    birthDate: pickFirstValue(next.birthDate, existing.birthDate) || '',
    bio: pickFirstValue(next.bio, existing.bio) || '',
    personalityHeadline: pickFirstValue(next.personalityHeadline, existing.personalityHeadline) || '',
    personalityResult: next.personalityResult ?? existing.personalityResult ?? null,
  };

  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(map));
  } catch {
    // 캐시 저장 실패 시 세션 데이터만 사용합니다.
  }
}

/**
 * @param {unknown} email
 * @returns {string}
 */
function getProfileImageCacheKey(email) {
  return `profileImageCache:${getProfileCacheKey(email)}`;
}

/**
 * @param {unknown} email
 * @returns {string}
 */
function getCachedProfileImageForEmail(email) {
  const cacheKey = getProfileImageCacheKey(email);

  if (!cacheKey || cacheKey === 'profileImageCache:') {
    return '';
  }

  return (
    localStorage.getItem(cacheKey) ||
    sessionStorage.getItem(cacheKey) ||
    ''
  );
}

/**
 * @param {unknown} email
 * @param {unknown} url
 */
function cacheProfileImageForEmail(email, url) {
  const cacheKey = getProfileImageCacheKey(email);
  const resolved = resolveProfileImageUrl(url);

  if (!cacheKey || cacheKey === 'profileImageCache:' || !resolved) {
    return '';
  }

  try {
    localStorage.setItem(cacheKey, resolved);
    return resolved;
  } catch {
    try {
      sessionStorage.setItem(cacheKey, resolved);
      return resolved;
    } catch {
      return '';
    }
  }
}

/**
 * @returns {string}
 */
function getStoredProfileImage() {
  return (
    localStorage.getItem(PROFILE_IMAGE_KEY) ||
    sessionStorage.getItem(PROFILE_IMAGE_KEY) ||
    ''
  );
}

/**
 * @param {unknown} url
 * @param {unknown} [email]
 */
function persistProfileImage(url, email) {
  const resolved = resolveProfileImageUrl(url);

  localStorage.removeItem(PROFILE_IMAGE_KEY);
  sessionStorage.removeItem(PROFILE_IMAGE_KEY);

  if (!resolved) {
    return '';
  }

  if (email) {
    cacheProfileImageForEmail(email, resolved);
  }

  try {
    localStorage.setItem(PROFILE_IMAGE_KEY, resolved);
    return resolved;
  } catch {
    try {
      sessionStorage.setItem(PROFILE_IMAGE_KEY, resolved);
      return resolved;
    } catch {
      return email ? getCachedProfileImageForEmail(email) : '';
    }
  }
}

/**
 * @param {Record<string, unknown>} patch
 */
export function persistProfileExtension(patch) {
  const existing = normalizeUserRecord(getProfileExtension());
  const incoming = normalizeUserRecord(patch);

  const payload = {
    name: pickFirstValue(incoming.name, existing.name) || '',
    email: pickFirstValue(incoming.email, existing.email) || '',
    gender: pickFirstValue(incoming.gender, existing.gender) || '',
    birthDate: pickFirstValue(incoming.birthDate, existing.birthDate) || '',
    bio: pickFirstValue(incoming.bio, existing.bio) || '',
    profileImageUrl: pickFirstValue(incoming.profileImageUrl, existing.profileImageUrl) || '',
    personalityHeadline: pickFirstValue(incoming.personalityHeadline, existing.personalityHeadline) || '',
    personalityResult: incoming.personalityResult ?? existing.personalityResult ?? null,
  };

  const corePayload = {
    ...payload,
    profileImageUrl: '',
    personalityResult: null,
  };

  try {
    localStorage.setItem(PROFILE_EXTENSION_KEY, JSON.stringify(corePayload));
  } catch {
    try {
      sessionStorage.setItem(PROFILE_EXTENSION_KEY, JSON.stringify(corePayload));
    } catch {
      return null;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'profileImageUrl')) {
    persistProfileImage(payload.profileImageUrl, payload.email);
  } else if (payload.profileImageUrl) {
    persistProfileImage(payload.profileImageUrl, payload.email);
  }

  if (payload.personalityResult) {
    try {
      const withPersonality = { ...corePayload, personalityResult: payload.personalityResult };
      localStorage.setItem(PROFILE_EXTENSION_KEY, JSON.stringify(withPersonality));
    } catch {
      // 성향 결과는 없어도 생년월일 등 핵심 정보는 유지합니다.
    }
  }

  if (payload.email) {
    cacheProfileForEmail(payload.email, payload);
  }

  return payload;
}

export function clearProfileExtension() {
  localStorage.removeItem(PROFILE_EXTENSION_KEY);
  sessionStorage.removeItem(PROFILE_EXTENSION_KEY);
  localStorage.removeItem(PROFILE_IMAGE_KEY);
  sessionStorage.removeItem(PROFILE_IMAGE_KEY);
}

/**
 * @returns {Record<string, unknown>}
 */
export function getMergedStoredUser() {
  const storedUser = getStoredUser() || {};
  const email = pickFirstValue(storedUser.email, getProfileExtension().email);
  const cachedProfile = getCachedProfileForEmail(email);

  const merged = normalizeUserRecord({
    ...storedUser,
    ...getProfileExtension(),
    ...cachedProfile,
  });

  const profileImageUrl = pickFirstValue(
    getStoredProfileImage(),
    merged.profileImageUrl,
    getCachedProfileImageForEmail(email),
  );

  return normalizeUserRecord({
    ...merged,
    profileImageUrl: resolveProfileImageUrl(profileImageUrl),
  });
}

/**
 * @param {unknown} gender
 * @returns {''|'MALE'|'FEMALE'}
 */
export function normalizeGenderValue(gender) {
  if (gender === null || gender === undefined || gender === '') {
    return '';
  }

  const value = String(gender).trim();

  if (value === 'MALE' || value === '남성' || value === '남자') {
    return 'MALE';
  }

  if (value === 'FEMALE' || value === '여성' || value === '여자') {
    return 'FEMALE';
  }

  const upper = value.toUpperCase();

  if (upper === 'MALE' || upper === 'M') {
    return 'MALE';
  }

  if (upper === 'FEMALE' || upper === 'F') {
    return 'FEMALE';
  }

  return '';
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeBirthDateValue(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  if (typeof value === 'object') {
    const record = /** @type {Record<string, unknown>} */ (value);

    if (record.year && record.month && record.day) {
      return `${record.year}-${String(record.month).padStart(2, '0')}-${String(record.day).padStart(2, '0')}`;
    }
  }

  const text = String(value).trim();

  if (!text) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const digits = text.replace(/\D/g, '');

  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }

  return text;
}

/**
 * @param {unknown} data
 * @returns {Record<string, unknown>|null}
 */
export function parseUserPayload(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const root = /** @type {Record<string, unknown>} */ (data);
  const nested = root.data && typeof root.data === 'object'
    ? /** @type {Record<string, unknown>} */ (root.data)
    : null;

  const candidate =
    (nested?.user && typeof nested.user === 'object' ? nested.user : null) ||
    (root.user && typeof root.user === 'object' ? root.user : null) ||
    nested ||
    root;

  return flattenUserRecord(candidate);
}

/**
 * API·로컬 사용자 객체를 앱에서 쓰는 형태로 정규화합니다.
 * @param {Record<string, unknown>|null|undefined} user
 */
export function normalizeUserRecord(user) {
  if (!user || typeof user !== 'object') {
    return {};
  }

  const record = /** @type {Record<string, unknown>} */ (user);
  const genderSource = pickFirstValue(
    record.gender,
    record.GENDER,
    record.sex,
    record.SEX,
  );
  const birthDateSource = pickFirstValue(
    record.birthDate,
    record.birth_date,
    record.BIRTH_DATE,
    record.birthday,
    record.birthDay,
    record.dateOfBirth,
    record.date_of_birth,
  );
  const profileImageSource = pickFirstValue(
    record.profileImageUrl,
    record.profileImage,
    record.profile_image_url,
    record.profileImagePath,
    record.profile_image_path,
    record.imageUrl,
    record.image_url,
    record.avatarUrl,
    record.avatar_url,
    record.thumbnailUrl,
    record.thumbnail_url,
  );

  return {
    id: pickFirstValue(record.id, record.userId, record.memberId) || undefined,
    nickname: pickFirstValue(record.nickname) || '',
    name: pickFirstValue(
      record.name,
      record.userName,
      record.username,
      record.nickname,
      record.memberName,
      record.displayName,
      record.fullName,
    ) || '',
    email: pickFirstValue(record.email, record.memberEmail) || '',
    gender: normalizeGenderValue(genderSource),
    birthDate: normalizeBirthDateValue(birthDateSource),
    bio: pickFirstValue(record.bio) || '',
    profileImageUrl: resolveProfileImageUrl(profileImageSource),
    personalityHeadline: pickFirstValue(record.personalityHeadline) || '',
    personalityResult: record.personalityResult ?? null,
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} current
 * @param {Record<string, unknown>|null|undefined} remote
 */
export function mergeUserRecords(current, remote) {
  const local = normalizeUserRecord(current);
  const server = normalizeUserRecord(remote);

  return {
    id: pickFirstValue(server.id, local.id) || undefined,
    nickname: pickFirstValue(server.nickname, local.nickname) || '',
    name: pickFirstValue(server.name, local.name) || '',
    email: pickFirstValue(server.email, local.email) || '',
    gender: pickFirstValue(server.gender, local.gender) || '',
    birthDate: pickFirstValue(server.birthDate, local.birthDate) || '',
    bio: pickFirstValue(server.bio, local.bio) || '',
    profileImageUrl: pickFirstValue(server.profileImageUrl, local.profileImageUrl) || '',
    personalityHeadline: pickFirstValue(server.personalityHeadline, local.personalityHeadline) || '',
    personalityResult: server.personalityResult ?? local.personalityResult ?? null,
  };
}

/**
 * @param {Record<string, unknown>} user
 */
export function saveUserToStorage(user) {
  const nextUser = normalizeUserRecord(user);
  const profileImageUrl = nextUser.profileImageUrl;
  const storageUser = normalizeUserRecord({
    ...nextUser,
    profileImageUrl: '',
    personalityResult: null,
  });

  try {
    localStorage.setItem('user', JSON.stringify(storageUser));
  } catch {
    const fallback = normalizeUserRecord({
      ...storageUser,
      bio: '',
    });
    localStorage.setItem('user', JSON.stringify(fallback));
  }

  if (profileImageUrl) {
    persistProfileImage(profileImageUrl, storageUser.email);
  }

  return normalizeUserRecord({
    ...storageUser,
    profileImageUrl,
    personalityResult: nextUser.personalityResult ?? null,
  });
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
  const normalized = normalizeBirthDateValue(value);

  if (!normalized) {
    return '-';
  }

  const digits = normalized.replace(/\D/g, '');

  if (digits.length === 8) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
  }

  return normalized;
}

/**
 * 게스트 둘러보기 상태인지 확인합니다.
 * @returns {boolean}
 */
export function isGuestUser() {
  return sessionStorage.getItem('guest') === 'true';
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
  const user = getMergedStoredUser();
  const guest = isGuestUser();

  return {
    name: guest ? '게스트' : String(user.name || user.nickname || '회원'),
    email: guest ? '-' : String(user.email || '-'),
    gender: guest ? '-' : formatGenderLabel(user.gender),
    genderValue: guest ? '' : String(user.gender || ''),
    birthDate: guest ? '-' : formatBirthDateDisplay(user.birthDate),
    bio: guest ? '' : String(user.bio || ''),
    profileImageUrl: guest ? '' : String(user.profileImageUrl || ''),
    personalityHeadline: guest ? '' : String(user.personalityHeadline || ''),
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

  persistProfileExtension(updates);
  return saveUserToStorage(mergeUserRecords(getMergedStoredUser(), updates));
}

/**
 * 서버의 최신 사용자 정보를 받아 localStorage에 반영합니다.
 */
export async function syncUserFromServer() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(apiUrl('/api/v1/users/me'), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json().catch(() => null);
    const remoteUser = parseUserPayload(data);

    if (!remoteUser) {
      return null;
    }

    const local = getMergedStoredUser();
    const email = pickFirstValue(remoteUser.email, local.email);
    const cachedProfile = getCachedProfileForEmail(email);
    const nextUser = mergeUserRecords(
      mergeUserRecords(local, cachedProfile),
      remoteUser,
    );
    const savedUser = saveUserToStorage(nextUser);
    persistProfileExtension(nextUser);
    return savedUser;
  } catch {
    return null;
  }
}
