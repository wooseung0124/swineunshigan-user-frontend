const FIELD_ORDER = [
  'nickname',
  'phoneNumber',
  'name',
  'email',
  'birthDate',
  'gender',
];

const FIELD_ALIASES = {
  nickname: 'nickname',
  nickName: 'nickname',
  NICKNAME: 'nickname',
  phone: 'phoneNumber',
  phoneNumber: 'phoneNumber',
  phone_number: 'phoneNumber',
  PHONE_NUMBER: 'phoneNumber',
  PHONE: 'phoneNumber',
  name: 'name',
  userName: 'name',
  username: 'name',
  NAME: 'name',
  email: 'email',
  EMAIL: 'email',
  birthDate: 'birthDate',
  birthdate: 'birthDate',
  birthday: 'birthDate',
  birth_date: 'birthDate',
  BIRTH_DATE: 'birthDate',
  gender: 'gender',
  GENDER: 'gender',
  termsAgreed: 'termsAgreed',
  privacyAgreed: 'privacyAgreed',
  marketingAgreed: 'marketingAgreed',
};

export const SIGNUP_FIELD_META = {
  nickname: { label: '닉네임', placeholder: '닉네임을 입력해 주세요', type: 'text' },
  name: { label: '이름', placeholder: '이름을 입력해 주세요', type: 'text' },
  phoneNumber: { label: '휴대폰 번호', placeholder: '01012345678', type: 'tel' },
  email: { label: '이메일', placeholder: 'example@email.com', type: 'email' },
  birthDate: { label: '생년월일', type: 'date' },
  gender: { label: '성별', type: 'select' },
  termsAgreed: { label: '이용약관 동의', type: 'checkbox' },
  privacyAgreed: { label: '개인정보 처리방침 동의', type: 'checkbox' },
  marketingAgreed: { label: '마케팅 정보 수신 동의 (선택)', type: 'checkbox', required: false },
};

/**
 * @param {unknown} rawField
 * @returns {string|null}
 */
function normalizeFieldKey(rawField) {
  if (typeof rawField === 'string') {
    return FIELD_ALIASES[rawField] ?? rawField;
  }

  if (rawField && typeof rawField === 'object') {
    const key =
      rawField.field ??
      rawField.fieldName ??
      rawField.name ??
      rawField.key ??
      rawField.code ??
      rawField.value;

    if (typeof key === 'string') {
      return FIELD_ALIASES[key] ?? key;
    }
  }

  return null;
}

/**
 * 백엔드 requiredFields만 파싱합니다.
 * @param {unknown} requiredFields
 * @returns {string[]}
 */
export function parseBackendRequiredFields(requiredFields) {
  if (!Array.isArray(requiredFields)) {
    return [];
  }

  return [...new Set(requiredFields.map(normalizeFieldKey).filter(Boolean))];
}

/**
 * 화면에 보여줄 입력 필드를 계산합니다.
 * @param {unknown} requiredFields
 * @param {Record<string, unknown>|null|undefined} socialUser
 * @returns {string[]}
 */
export function resolveSignupFormFields(requiredFields, socialUser) {
  const fields = new Set(parseBackendRequiredFields(requiredFields));

  if (fields.size === 0) {
    FIELD_ORDER.forEach((field) => fields.add(field));
  }

  fields.add('phoneNumber');

  if (!socialUser?.nickname) {
    fields.add('nickname');
  }
  if (!socialUser?.email) {
    fields.add('email');
  }

  return FIELD_ORDER.filter((field) => fields.has(field));
}

/**
 * @param {string} field
 */
export function getSignupFieldMeta(field) {
  if (SIGNUP_FIELD_META[field]) {
    return SIGNUP_FIELD_META[field];
  }

  return {
    label: field,
    placeholder: `${field}을(를) 입력해 주세요`,
    type: 'text',
  };
}

/**
 * @param {string[]} formFields
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function buildSignupInitialValues(formFields, socialUser) {
  const values = Object.fromEntries(
    formFields.map((field) => {
      const meta = getSignupFieldMeta(field);
      return [field, meta.type === 'checkbox' ? false : ''];
    }),
  );

  if (socialUser?.nickname && 'nickname' in values) {
    values.nickname = String(socialUser.nickname);
  }
  if (socialUser?.email && 'email' in values) {
    values.email = String(socialUser.email);
  }
  if (socialUser?.name && 'name' in values && !values.name) {
    values.name = String(socialUser.name);
  }

  return values;
}

/**
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function getSocialPrefillSummary(socialUser) {
  if (!socialUser) {
    return [];
  }

  return [
    socialUser.nickname ? { label: '카카오 닉네임', value: String(socialUser.nickname) } : null,
    socialUser.email ? { label: '카카오 이메일', value: String(socialUser.email) } : null,
  ].filter(Boolean);
}

/**
 * @param {Record<string, string|boolean>} formValues
 * @param {string[]} formFields
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function buildSignupPayload(formValues, formFields, socialUser) {
  const payload = {};

  if (socialUser?.nickname) {
    payload.nickname = String(socialUser.nickname);
  }
  if (socialUser?.email) {
    payload.email = String(socialUser.email);
  }

  formFields.forEach((field) => {
    const value = formValues[field];
    const meta = getSignupFieldMeta(field);

    if (meta.type === 'checkbox') {
      if (meta.required === false) {
        payload[field] = Boolean(value);
      } else if (value) {
        payload[field] = true;
      }
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        payload[field] = trimmed;
      }
    }
  });

  return payload;
}

/**
 * @param {Record<string, string|boolean>} formValues
 * @param {string[]} formFields
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function getMissingSignupFields(formValues, formFields, socialUser) {
  const missing = formFields.filter((field) => {
    const meta = getSignupFieldMeta(field);
    const value = formValues[field];

    if (meta.type === 'checkbox') {
      return meta.required !== false && !value;
    }

    return typeof value !== 'string' || !value.trim();
  });

  if (!hasValue(socialUser?.nickname) && !formValues.nickname?.trim()) {
    if (!missing.includes('nickname')) {
      missing.unshift('nickname');
    }
  }
  if (!hasValue(socialUser?.email) && !formValues.email?.trim()) {
    if (!missing.includes('email')) {
      missing.push('email');
    }
  }

  return missing;
}

/**
 * @param {unknown} value
 */
function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @param {string[]} missingFields
 */
export function formatMissingFieldMessage(missingFields) {
  const labels = missingFields.map((field) => getSignupFieldMeta(field).label);
  return `필수 입력값이 누락되었습니다: ${labels.join(', ')}`;
}
