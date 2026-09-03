import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePersonalityParams } from '../utils/personalityTestBridge';
import './SignupPage.css';

/**
 * 로컬 개발용: 랜딩이 app 도메인으로만 복귀할 때
 * 결과 URL을 붙여 넣어 localhost 가입 플로우로 이어갑니다.
 */
export default function PersonalityWaitingPage() {
  const navigate = useNavigate();
  const [pasteValue, setPasteValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const quizUrl = sessionStorage.getItem('personalityQuizLaunchUrl');
    if (!quizUrl) {
      return;
    }

    const popup = window.open(quizUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      setError('팝업이 차단되었습니다. 아래 링크로 테스트를 연 뒤, 결과 URL을 붙여 넣어 주세요.');
    }
  }, []);

  const handleOpenQuiz = () => {
    const quizUrl = sessionStorage.getItem('personalityQuizLaunchUrl');
    if (quizUrl) {
      window.open(quizUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContinue = (event) => {
    event.preventDefault();
    setError('');

    const raw = pasteValue.trim();
    if (!raw) {
      setError('결과 화면 주소를 붙여 넣어 주세요.');
      return;
    }

    let parsed;
    try {
      const url = new URL(raw, window.location.origin);
      parsed = parsePersonalityParams(url.searchParams);
    } catch {
      setError('올바른 URL 형식이 아닙니다.');
      return;
    }

    if (!parsed) {
      setError('URL에 connection, think 파라미터가 없습니다.');
      return;
    }

    const next = new URLSearchParams({
      connection: parsed.connection,
      think: parsed.think,
      origin: parsed.origin || 'web',
    });
    if (parsed.cs?.length) next.set('cs', parsed.cs.join(','));
    if (parsed.ts?.length) next.set('ts', parsed.ts.join(','));

    sessionStorage.removeItem('personalityQuizLaunchUrl');
    navigate(`/?${next.toString()}`, { replace: true });
  };

  return (
    <div className="signup-page">
      <div className="signup-page__body">
        <header className="signup-page__header">
          <h1 className="signup-page__title">테스트 결과 이어받기</h1>
          <p className="signup-page__subtitle">
            랜딩은 결과를 app.shineunsigan.com 으로만 돌려보냅니다.
            <br />
            새 탭에서 테스트를 마친 뒤, 결과 화면 주소창 URL을 아래에 붙여 넣어 주세요.
          </p>
        </header>

        <form className="signup-page__form" onSubmit={handleContinue}>
          <div className="signup-page__field">
            <label className="signup-page__label" htmlFor="resultUrl">
              결과 URL
            </label>
            <input
              id="resultUrl"
              className="signup-page__input"
              type="url"
              placeholder="https://app.shineunsigan.com/?connection=JM&think=CONDITION"
              value={pasteValue}
              onChange={(event) => setPasteValue(event.target.value)}
            />
          </div>

          {error && <p className="signup-page__error">{error}</p>}

          <button type="button" className="signup-page__retry" onClick={handleOpenQuiz}>
            테스트 다시 열기
          </button>
        </form>
      </div>

      <footer className="signup-page__footer">
        <button type="button" className="signup-page__submit" onClick={handleContinue}>
          결과 반영하고 계속하기
        </button>
      </footer>
    </div>
  );
}
