import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import personalityBg from '../assets/images/signup-personality-bg.png';
import SignupPersonalityIntro from './SignupPersonalityIntro';
import { openPersonalityQuiz } from '../utils/personalityTestBridge';
import './SignupPage.css';

const INTRO_TITLE = '이향인 성향 테스트를 통해\n나에 대해 더 알아 봐요';
const INTRO_SUBTITLE = '이향인 성향 테스트는 나의 연결태도와\n사고방식을 토대로 분석됩니다';

const ALLOWED_HOSTS = new Set(['app.shineunsigan.com', 'localhost', '127.0.0.1']);

/**
 * 앱 내 이향인 테스트 진입 게이트 (회원가입 2단계 UI 재사용).
 */
export default function PersonalityTestGatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allowed, setAllowed] = useState(null);

  const fromInstagram = useMemo(() => {
    if (searchParams.get('from') === 'instagram') {
      try {
        sessionStorage.setItem('from_instagram', 'true');
      } catch {
        /* ignore */
      }
      return true;
    }

    try {
      return sessionStorage.getItem('from_instagram') === 'true';
    } catch {
      return false;
    }
  }, [searchParams]);

  useEffect(() => {
    const host = window.location.hostname;
    setAllowed(ALLOWED_HOSTS.has(host) || fromInstagram);
  }, [fromInstagram]);

  const handleStart = () => {
    openPersonalityQuiz({ fromInstagram });
  };

  if (allowed === null) {
    return null;
  }

  if (!allowed) {
    return (
      <div className="signup-page">
        <div className="signup-page__body">
          <header className="signup-page__header">
            <h1 className="signup-page__title">사용 권한이 없습니다</h1>
            <p className="signup-page__subtitle">
              이향인 성향 테스트는 앱 또는 인스타그램 링크를 통해서만 이용할 수 있어요
            </p>
          </header>
        </div>
        <footer className="signup-page__footer">
          <button
            type="button"
            className="signup-page__submit"
            onClick={() => navigate('/', { replace: true })}
          >
            앱으로 돌아가기
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div
      className="signup-page signup-page--personality"
      style={{ '--signup-personality-bg': `url(${personalityBg})` }}
    >
      <div className="signup-page__body">
        <SignupPersonalityIntro title={INTRO_TITLE} subtitle={INTRO_SUBTITLE} />
      </div>
      <footer className="signup-page__footer signup-page__footer--transparent">
        <button
          type="button"
          className="signup-page__submit signup-page__submit--overlay"
          onClick={handleStart}
        >
          테스트 시작하기
        </button>
      </footer>
    </div>
  );
}
