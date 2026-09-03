import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import personalityBg from '../assets/images/signup-personality-bg.png';
import SignupPersonalityIntro from './SignupPersonalityIntro';
import { openPersonalityQuiz } from '../utils/personalityTestBridge';
import { stashSignupBeforePersonalityQuiz } from '../utils/signupQuizHandoff';
import './SignupPage.css';

const INTRO_TITLE = '이향인 성향 테스트를 통해\n나에 대해 더 알아 봐요';
const INTRO_SUBTITLE = '이향인 성향 테스트는 나의 연결태도와\n사고방식을 토대로 분석됩니다';

/**
 * 이향인 테스트 진입 화면 (회원가입 2단계 UI 재사용).
 * 접근 제한 없이 누구나 이용할 수 있습니다.
 */
export default function PersonalityTestGatePage() {
  const [searchParams] = useSearchParams();

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
          onClick={() => {
            stashSignupBeforePersonalityQuiz();
            openPersonalityQuiz({ fromInstagram });
          }}
        >
          테스트 시작하기
        </button>
      </footer>
    </div>
  );
}
