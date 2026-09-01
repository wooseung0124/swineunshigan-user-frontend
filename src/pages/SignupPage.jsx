import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import personalityBg from '../assets/images/signup-personality-bg.png';
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
  collectSignupFieldKeys,
  formatBirthDateInput,
  formatMissingFieldMessage,
  getMissingSignupFields,
  getSignupFieldMeta,
  isSignupStepComplete,
  resolveSignupFormFields,
  resolveSignupSteps,
  SIGNUP_TOTAL_STEPS,
} from '../utils/signupFields';
import { pickRandomPersonalityResult } from '../data/personalityTypes';
import SignupPersonalityIntro from './SignupPersonalityIntro';
import SignupPersonalityResult from './SignupPersonalityResult';
import SignupProfileIntro from './SignupProfileIntro';
import { buildRecommendedBio } from '../utils/signupBio';
import { readProfileImageAsDataUrl, validateProfileImageFile } from '../utils/profileImage';
import './SignupPage.css';

const SIGNUP_PROGRESS_INDEX = {
  basic: 0,
  'personality-intro': 1,
  'personality-result': 1,
  'profile-intro': 2,
};

function SignupProgress({ activeStepId, totalSteps }) {
  const activeIndex = SIGNUP_PROGRESS_INDEX[activeStepId] ?? 0;

  return (
    <div className="signup-progress" aria-label={`회원가입 ${activeIndex + 1}/${totalSteps}단계`}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <span
          key={index}
          className={`signup-progress__item${
            index === activeIndex ? ' signup-progress__item--active' : ''
          }`}
        />
      ))}
    </div>
  );
}

function GenderField({ value, onChange }) {
  const options = [
    { value: 'MALE', label: '남성' },
    { value: 'FEMALE', label: '여성' },
  ];

  return (
    <div className="signup-page__field">
      <span className="signup-page__label">성별</span>
      <div className="signup-gender" role="radiogroup" aria-label="성별">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={`signup-gender__btn${
              value === option.value ? ' signup-gender__btn--selected' : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignupField({ field, value, onChange }) {
  const meta = getSignupFieldMeta(field);

  if (field === 'gender') {
    return <GenderField value={value} onChange={onChange} />;
  }

  if (meta.type === 'checkbox') {
    return (
      <label className="signup-page__checkbox">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          required={meta.required !== false}
        />
        <span>{meta.label}</span>
      </label>
    );
  }

  const inputType = field === 'birthDate' ? 'text' : meta.type || 'text';
  const inputMode = field === 'birthDate' ? 'numeric' : undefined;
  const maxLength = field === 'birthDate' ? 10 : undefined;

  return (
    <div className="signup-page__field">
      <label className="signup-page__label" htmlFor={field}>
        {meta.label}
      </label>
      <input
        id={field}
        className="signup-page__input"
        type={inputType}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={meta.placeholder}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

function getSubmitLabel(activeStep, isLastStep, isSubmitting) {
  if (isSubmitting) {
    return '가입 처리 중...';
  }

  if (activeStep.type === 'personality-intro') {
    return '테스트 시작하기';
  }

  if (isLastStep) {
    return '완료';
  }

  return '다음';
}

export default function SignupPage() {
  const navigate = useNavigate();
  const draft = useMemo(() => getSignupDraft(), []);
  const formFields = useMemo(
    () => resolveSignupFormFields(draft?.requiredFields),
    [draft?.requiredFields],
  );
  const steps = useMemo(
    () => resolveSignupSteps(formFields, draft?.socialUser),
    [formFields, draft?.socialUser],
  );
  const [formValues, setFormValues] = useState(() => ({
    ...buildSignupInitialValues(formFields, draft?.socialUser),
    bio: '',
  }));
  const [currentStep, setCurrentStep] = useState(0);
  const [personalityResult, setPersonalityResult] = useState(null);
  const [introMode, setIntroMode] = useState('direct');
  const [directBioDraft, setDirectBioDraft] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft?.signupToken) {
      navigate('/', { replace: true });
    }
  }, [draft, navigate]);

  useEffect(() => {
    setFormValues((prev) => {
      const next = { ...prev };
      let changed = false;

      collectSignupFieldKeys(formFields).forEach((field) => {
        if (!(field in next)) {
          const meta = getSignupFieldMeta(field);
          next[field] = meta.type === 'checkbox' ? false : '';
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [formFields]);

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  if (!draft?.signupToken || steps.length === 0) {
    return null;
  }

  const activeStep = steps[currentStep];
  const isPersonalityIntro = activeStep.type === 'personality-intro';
  const isPersonalityResult = activeStep.type === 'personality-result';
  const isProfileIntro = activeStep.type === 'profile-intro';
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = isSignupStepComplete(activeStep, formValues, draft.socialUser);
  const pageClassName = [
    'signup-page',
    isPersonalityIntro ? ' signup-page--personality' : '',
    isPersonalityResult ? ' signup-page--result' : '',
    isProfileIntro ? ' signup-page--profile' : '',
  ].join('');

  const handleFieldChange = (field) => (nextValue) => {
    const formattedValue = field === 'birthDate'
      ? formatBirthDateInput(nextValue)
      : nextValue;

    setFormValues((prev) => ({ ...prev, [field]: formattedValue }));
    setError('');
  };

  const submitSignup = async () => {
    const currentDraft = getSignupDraft();

    if (!currentDraft?.signupToken) {
      setError('회원가입 세션이 만료되었습니다. 다시 로그인해 주세요.');
      navigate('/', { replace: true });
      return;
    }

    const missingFields = getMissingSignupFields(
      formValues,
      formFields,
      currentDraft.socialUser,
    );

    if (missingFields.length > 0) {
      setError(formatMissingFieldMessage(missingFields));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        signupToken: currentDraft.signupToken,
        ...buildSignupPayload(formValues, formFields, currentDraft.socialUser),
        bio: formValues.bio?.trim() || undefined,
      };

      if (profileImageFile) {
        payload.profileImageUrl = await readProfileImageAsDataUrl(profileImageFile);
      }

      const response = await fetch(apiUrl('/api/v1/auth/signup/complete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          clearSignupDraft();
          throw new Error(
            data?.message ||
              '회원가입 세션이 만료되었습니다. 카카오 로그인을 다시 진행해 주세요.',
          );
        }

        throw new Error(data?.message || `회원가입에 실패했습니다. (${response.status})`);
      }

      if (isAuthSuccess(data)) {
        clearSignupDraft();
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

  const handleNext = async (event) => {
    event.preventDefault();

    if (!isPersonalityIntro && !isPersonalityResult && !isProfileIntro) {
      const missingFields = getMissingSignupFields(
        formValues,
        activeStep.fields,
        draft.socialUser,
      );

      if (missingFields.length > 0) {
        setError(formatMissingFieldMessage(missingFields));
        return;
      }
    }

    if (isPersonalityIntro) {
      const resultStepIndex = steps.findIndex((step) => step.id === 'personality-result');
      setPersonalityResult(pickRandomPersonalityResult());
      setCurrentStep(resultStepIndex >= 0 ? resultStepIndex : currentStep + 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    await submitSignup();
  };

  const handleIntroModeChange = (nextMode) => {
    if (nextMode === introMode) {
      return;
    }

    if (nextMode === 'recommended') {
      if (introMode === 'direct') {
        setDirectBioDraft(formValues.bio);
      }

      setIntroMode('recommended');
      setFormValues((prev) => ({
        ...prev,
        bio: buildRecommendedBio(personalityResult),
      }));
    } else {
      setIntroMode('direct');
      setFormValues((prev) => ({
        ...prev,
        bio: directBioDraft,
      }));
    }

    setError('');
  };

  const handleBioChange = (nextBio) => {
    setFormValues((prev) => ({ ...prev, bio: nextBio }));

    if (introMode === 'direct') {
      setDirectBioDraft(nextBio);
    }

    setError('');
  };

  const handleProfileImageSelect = (file) => {
    const validationError = validateProfileImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setProfileImagePreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return URL.createObjectURL(file);
    });
    setProfileImageFile(file);
    setError('');
  };

  const handleRetryTest = () => {
    setPersonalityResult(null);
    setCurrentStep(1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={pageClassName}
      style={isPersonalityIntro ? { '--signup-personality-bg': `url(${personalityBg})` } : undefined}
    >
      <div className="signup-page__body">
        <SignupProgress activeStepId={activeStep.id} totalSteps={SIGNUP_TOTAL_STEPS} />

        {isPersonalityIntro ? (
          <SignupPersonalityIntro
            title={activeStep.title}
            subtitle={activeStep.subtitle}
          />
        ) : isPersonalityResult ? (
          <SignupPersonalityResult result={personalityResult} />
        ) : isProfileIntro ? (
          <SignupProfileIntro
            title={activeStep.title}
            subtitle={activeStep.subtitle}
            name={formValues.name}
            personalityHeadline={personalityResult?.headline}
            profileImageUrl={profileImagePreview}
            bio={formValues.bio}
            introMode={introMode}
            onBioChange={handleBioChange}
            onIntroModeChange={handleIntroModeChange}
            onProfileImageSelect={handleProfileImageSelect}
          />
        ) : (
          <>
            <header className="signup-page__header">
              <h1 className="signup-page__title">{activeStep.title}</h1>
              <p className="signup-page__subtitle">{activeStep.subtitle}</p>
            </header>

            <form className="signup-page__form" onSubmit={handleNext}>
              {activeStep.fields.map((field) => (
                <SignupField
                  key={field}
                  field={field}
                  value={formValues[field]}
                  onChange={handleFieldChange(field)}
                />
              ))}

              {error && <p className="signup-page__error">{error}</p>}
            </form>
          </>
        )}
      </div>

      <footer
        className={`signup-page__footer${
          isPersonalityIntro ? ' signup-page__footer--transparent' : ''
        }${isPersonalityResult ? ' signup-page__footer--result' : ''}${
          isProfileIntro ? ' signup-page__footer--profile' : ''
        }`}
      >
        {(isPersonalityIntro || isPersonalityResult || isProfileIntro) && error && (
          <p className="signup-page__error signup-page__error--overlay">{error}</p>
        )}
        <button
          type="button"
          className={`signup-page__submit${
            isPersonalityIntro || isProfileIntro ? ' signup-page__submit--overlay' : ''
          }`}
          disabled={!canProceed || isSubmitting}
          onClick={handleNext}
        >
          {getSubmitLabel(activeStep, isLastStep, isSubmitting)}
        </button>
        {isPersonalityResult && (
          <button
            type="button"
            className="signup-page__retry"
            onClick={handleRetryTest}
          >
            다시하기
          </button>
        )}
      </footer>
    </div>
  );
}
