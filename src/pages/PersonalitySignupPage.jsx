// src/pages/PersonalitySignupPage.jsx
// 경로: /signup/personality   ※ PrivateRoute 없이

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getPersonality, PERSONALITY_TEST_URL } from '../utils/personality';
import {
  PERSONALITY_CONNECTION_LABEL, PERSONALITY_CONNECTION_DESC,
  PERSONALITY_THINK_ALIAS, PERSONALITY_THINK_DESC,
} from '../types/types';

function PersonalitySignupPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const saved = getPersonality(userId);

  const startTest = () => {
    sessionStorage.setItem('resttime:signup:pending', 'true');
    window.location.href = PERSONALITY_TEST_URL;
  };

  const goNext = () => {
    sessionStorage.removeItem('resttime:signup:pending');
    navigate('/signup/profile');
  };

  if (saved) {
    return (
      <div>
        <h3>{PERSONALITY_CONNECTION_LABEL[saved.connection]}</h3>
        <p>{PERSONALITY_CONNECTION_DESC[saved.connection]}</p>
        <h3>{PERSONALITY_THINK_ALIAS[saved.think]}</h3>
        <p>{PERSONALITY_THINK_DESC[saved.think]}</p>
        <button onClick={goNext}>다음</button>
        <button onClick={startTest}>다시 하기</button>
      </div>
    );
  }

  return (
    <div>
      <p>이향인 성향 테스트를 통해 나에 대해 더 알아봐요</p>
      <button onClick={startTest}>테스트 시작하기</button>
      <button onClick={goNext}>다음에 할게요</button>
    </div>
  );
}

export default PersonalitySignupPage;