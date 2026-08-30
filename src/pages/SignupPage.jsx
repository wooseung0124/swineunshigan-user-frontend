import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { apiUrl } from '../utils/api';
import {
  clearSignupDraft,
  getSignupDraft,
  isAuthSuccess,
  saveAuthSession,
} from '../utils/authSession';
import {
  buildSignupInitialValues,
  buildSignupPayload,
  formatMissingFieldMessage,
  getMissingSignupFields,
  getSignupFieldMeta,
  getSocialPrefillSummary,
  resolveSignupFormFields,
} from '../utils/signupFields';
import './SignupPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const draft = useMemo(() => getSignupDraft(), []);
  const formFields = useMemo(
    () => resolveSignupFormFields(draft?.requiredFields, draft?.socialUser),
    [draft?.requiredFields, draft?.socialUser],
  );
  const socialSummary = useMemo(
    () => getSocialPrefillSummary(draft?.socialUser),
    [draft?.socialUser],
  );
  const [formValues, setFormValues] = useState(() =>
    buildSignupInitialValues(formFields, draft?.socialUser),
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft?.signupToken) {
      navigate('/', { replace: true });
    }
  }, [draft, navigate]);

  if (!draft?.signupToken) {
    return null;
  }

  const handleChange = (field) => (event) => {
    const meta = getSignupFieldMeta(field);
    const nextValue =
      meta.type === 'checkbox' ? event.target.checked : event.target.value;

    setFormValues((prev) => ({ ...prev, [field]: nextValue }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const missingFields = getMissingSignupFields(
      formValues,
      formFields,
      draft.socialUser,
    );
    if (missingFields.length > 0) {
      setError(formatMissingFieldMessage(missingFields));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/api/v1/auth/signup/complete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signupToken: draft.signupToken,
          ...buildSignupPayload(formValues, formFields, draft.socialUser),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `회원가입에 실패했습니다. (${response.status})`);
      }

      if (isAuthSuccess(data)) {
        saveAuthSession(data);
        navigate('/home', { replace: true });
        return;
      }

      throw new Error('회원가입 응답 형식이 올바르지 않습니다.');
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearSignupDraft();
    navigate('/', { replace: true });
  };

  return (
    <div className="signup-page">
      <div className="signup-page__inner">
        <header className="signup-page__header">
          <h1 className="signup-page__title">회원가입</h1>
          <p className="signup-page__desc">
            카카오 로그인이 확인되었습니다.
            <br />
            서비스 이용을 위해 추가 정보를 입력해 주세요.
          </p>
        </header>

        {socialSummary.length > 0 && (
          <div className="signup-page__social">
            {socialSummary.map((item) => (
              <p key={item.label} className="signup-page__social-row">
                <span className="signup-page__social-label">{item.label}</span>
                <span>{item.value}</span>
              </p>
            ))}
          </div>
        )}

        <form className="signup-page__form" onSubmit={handleSubmit}>
          {formFields.map((field) => {
            const meta = getSignupFieldMeta(field);

            if (meta.type === 'select' && field === 'gender') {
              return (
                <div key={field} className="signup-page__field">
                  <label className="signup-page__label" htmlFor={field}>
                    {meta.label}
                  </label>
                  <select
                    id={field}
                    className="signup-page__select"
                    value={formValues[field]}
                    onChange={handleChange(field)}
                    required
                  >
                    <option value="">선택해 주세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>
              );
            }

            if (meta.type === 'checkbox') {
              return (
                <label key={field} className="signup-page__checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(formValues[field])}
                    onChange={handleChange(field)}
                    required={meta.required !== false}
                  />
                  <span>{meta.label}</span>
                </label>
              );
            }

            return (
              <Input
                key={field}
                id={field}
                label={meta.label}
                type={meta.type || 'text'}
                placeholder={meta.placeholder}
                value={formValues[field]}
                onChange={handleChange(field)}
                required
              />
            );
          })}

          {error && <p className="signup-page__error">{error}</p>}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? '가입 처리 중...' : '가입 완료'}
          </Button>

          <button type="button" className="signup-page__cancel" onClick={handleCancel}>
            로그인 화면으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
}
