import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalityResultCards from '../components/personality/PersonalityResultCards';
import backIcon from '../assets/icons/mypage-back.png';
import {
  getUserPersonalityResult,
  openPersonalityRetake,
} from '../utils/personalityResult';
import { getPersonalityTestGateUrl } from '../utils/personalityTestBridge';
import { getUserProfile } from '../utils/userProfile';
import './PersonalityResultPage.css';

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

export default function PersonalityResultPage() {
  const navigate = useNavigate();
  const profile = useMemo(() => getUserProfile(), []);
  const [result] = useState(() => getUserPersonalityResult());

  const handleClose = () => {
    navigate('/mypage/profile');
  };

  const handleRetake = () => {
    openPersonalityRetake();
  };

  if (!result) {
    return (
      <div className="personality-result-page">
        <header className="personality-result-page__header">
          <button
            type="button"
            className="personality-result-page__header-btn"
            onClick={handleClose}
            aria-label="뒤로 가기"
          >
            <img src={backIcon} alt="" />
          </button>
          <h1 className="personality-result-page__title">이향인 성향</h1>
          <button
            type="button"
            className="personality-result-page__header-btn"
            onClick={handleClose}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </header>

        <p className="personality-result-page__empty">
          아직 성향 테스트 결과가 없습니다.
        </p>
        <button
          type="button"
          className="personality-result-page__retake"
          onClick={() => {
            window.location.assign(getPersonalityTestGateUrl());
          }}
        >
          성향 테스트하기
        </button>
      </div>
    );
  }

  return (
    <div className="personality-result-page">
      <header className="personality-result-page__header">
        <button
          type="button"
          className="personality-result-page__header-btn"
          onClick={handleClose}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" />
        </button>
        <h1 className="personality-result-page__title">이향인 성향</h1>
        <button
          type="button"
          className="personality-result-page__header-btn"
          onClick={handleClose}
          aria-label="닫기"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="personality-result-page__content">
        <p className="personality-result-page__subtitle">
          {profile.name} 이향인 성향 테스트 결과
        </p>

        <PersonalityResultCards
          connection={result.connection}
          thinking={result.thinking}
        />

        <button
          type="button"
          className="personality-result-page__retake"
          onClick={handleRetake}
        >
          테스트 다시하기
        </button>
      </div>
    </div>
  );
}
