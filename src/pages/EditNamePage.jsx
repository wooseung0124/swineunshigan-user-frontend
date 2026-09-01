import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/mypage-back.png';
import { getUserProfile, updateStoredUser } from '../utils/userProfile';
import './EditNamePage.css';

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
        d="M5.5 5.5 10.5 10.5M10.5 5.5 5.5 10.5"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function EditNamePage() {
  const navigate = useNavigate();
  const initialName = useMemo(() => getUserProfile().name, []);
  const [name, setName] = useState(initialName);

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    updateStoredUser({ name: trimmedName });
    navigate('/mypage/profile', { replace: true });
  };

  return (
    <div className="edit-name-page">
      <header className="edit-name-page__header">
        <button
          type="button"
          className="edit-name-page__header-btn"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" />
        </button>

        <h1 className="edit-name-page__title">이름 변경</h1>

        <button
          type="button"
          className="edit-name-page__submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          완료
        </button>
      </header>

      <div className="edit-name-page__field">
        <label className="edit-name-page__label" htmlFor="edit-name">
          이름
        </label>

        <div className="edit-name-page__input-wrap">
          <input
            id="edit-name"
            className="edit-name-page__input"
            type="text"
            value={name}
            placeholder="이름을 입력해 주세요"
            onChange={(event) => setName(event.target.value)}
          />
          {name.length > 0 && (
            <button
              type="button"
              className="edit-name-page__clear"
              aria-label="입력 내용 지우기"
              onClick={() => setName('')}
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
