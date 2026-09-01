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
  name: { label: '이름', placeholder: '이름을 입력해주세요', type: 'text' },
  phoneNumber: { label: '휴대폰 번호', placeholder: '01012345678', type: 'tel' },
  email: { label: '이메일', placeholder: '이메일을 입력해주세요', type: 'email' },
  birthDate: { label: '생년월일', placeholder: 'YYYY.MM.DD', type: 'text' },
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

const DEFAULT_SIGNUP_FIELDS = ['name', 'gender', 'birthDate', 'email'];

export function collectSignupFieldKeys(formFields) {
  const keys = new Set([...formFields, ...DEFAULT_SIGNUP_FIELDS]);
  return FIELD_ORDER.filter((field) => keys.has(field));
}

/**
 * 화면에 보여줄 입력 필드를 계산합니다.
 * @param {unknown} requiredFields
 * @returns {string[]}
 */
export function resolveSignupFormFields(requiredFields) {
  const fields = new Set(parseBackendRequiredFields(requiredFields));

  DEFAULT_SIGNUP_FIELDS.forEach((field) => fields.add(field));

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
    collectSignupFieldKeys(formFields).map((field) => {
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
      const trimmed = field === 'birthDate' ? birthDateToApi(value) : value.trim();
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
export function getMissingSignupFields(formValues, fieldsToCheck, socialUser) {
  return fieldsToCheck.filter((field) => {
    const meta = getSignupFieldMeta(field);
    const value = formValues[field];

    if (meta.type === 'checkbox') {
      return meta.required !== false && !value;
    }

    if (field === 'birthDate') {
      return typeof value !== 'string' || value.replace(/\D/g, '').length !== 8;
    }

    return typeof value !== 'string' || !value.trim();
  });
}

/**
 * @param {string[]} missingFields
 */
export function formatMissingFieldMessage(missingFields) {
  const labels = missingFields.map((field) => getSignupFieldMeta(field).label);
  return `필수 입력값이 누락되었습니다: ${labels.join(', ')}`;
}

export const SIGNUP_TOTAL_STEPS = 3;

export const SIGNUP_STEP_DEFINITIONS = [
  {
    id: 'basic',
    type: 'form',
    title: '기본정보를 입력해주세요',
    subtitle: '회원가입을 위한 필수항목 입니다',
    fields: ['name', 'gender', 'birthDate', 'email'],
  },
  {
    id: 'personality-intro',
    type: 'personality-intro',
    title: '이향인 성향 테스트를 통해\n나에 대해 더 알아 봐요',
    subtitle: '이향인 성향 테스트는 나의 연결태도와\n사고방식을 토대로 분석됩니다',
    fields: [],
  },
  {
    id: 'personality-result',
    type: 'personality-result',
    title: '나의 이향인 성향 테스트 결과는?',
    subtitle: '',
    fields: [],
  },
  {
    id: 'profile-intro',
    type: 'profile-intro',
    title: '나를 소개해주세요',
    subtitle: '나를 소개할수록 좋은 모임 문화가 형성 될 수 있어요',
    fields: [],
  },
];

/**
 * @param {string[]} formFields
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function resolveSignupSteps(formFields, socialUser) {
  return SIGNUP_STEP_DEFINITIONS.map((step) => {
    if (step.type === 'personality-intro' || step.type === 'personality-result') {
      return step;
    }

    if (step.type === 'profile-intro') {
      return step;
    }

    return {
      ...step,
      fields: step.fields.filter((field) => formFields.includes(field)),
    };
  });
}

/**
 * @param {string} value
 */
export function formatBirthDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

/**
 * @param {string} value
 */
export function birthDateToApi(value) {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 8) {
    return value.trim();
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

/**
 * @param {string[]} stepFields
 * @param {Record<string, string|boolean>} formValues
 * @param {Record<string, unknown>|null|undefined} socialUser
 */
export function isSignupStepComplete(step, formValues, socialUser) {
  if (step.type === 'personality-intro' || step.type === 'personality-result') {
    return true;
  }

  if (step.type === 'profile-intro') {
    return typeof formValues.bio === 'string' && formValues.bio.trim().length > 0;
  }

  if (!step.fields?.length) {
    return true;
  }

  return getMissingSignupFields(formValues, step.fields, socialUser).length === 0;
}
