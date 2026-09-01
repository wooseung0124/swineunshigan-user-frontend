import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/mypage-back.png';
import { getUserProfile, updateStoredUser } from '../utils/userProfile';
import './EditGenderPage.css';

const GENDER_OPTIONS = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
];

export default function EditGenderPage() {
  const navigate = useNavigate();
  const initialGender = useMemo(() => {
    const value = getUserProfile().genderValue;
    return value === 'MALE' || value === 'FEMALE' ? value : '';
  }, []);
  const [gender, setGender] = useState(initialGender);

  const canSubmit = gender === 'MALE' || gender === 'FEMALE';

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    updateStoredUser({ gender });
    navigate('/mypage/profile', { replace: true });
  };

  return (
    <div className="edit-gender-page">
      <header className="edit-gender-page__header">
        <button
          type="button"
          className="edit-gender-page__header-btn"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" />
        </button>

        <h1 className="edit-gender-page__title">성별 변경</h1>

        <button
          type="button"
          className="edit-gender-page__submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          완료
        </button>
      </header>

      <div className="edit-gender-page__field">
        <p className="edit-gender-page__label">성별</p>

        <div className="edit-gender-page__options" role="radiogroup" aria-label="성별">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={gender === option.value}
              className={`edit-gender-page__option${
                gender === option.value ? ' edit-gender-page__option--selected' : ''
              }`}
              onClick={() => setGender(option.value)}
            >
              <span className="edit-gender-page__radio" aria-hidden="true" />
              <span className="edit-gender-page__option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
