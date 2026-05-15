import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { verifyOAuthState, isMockAuthEnabled, getMockAuthResponse } from '../config/oauth';

// 구글 OAuth 콜백
// 백엔드 엔드포인트: POST /api/auth/google/callback  body: { code, state }
// 응답 예상: { token, user }
export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!verifyOAuthState('google', state)) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    // --- Mock 분기: 백엔드 미연동 시 풀 플로우 테스트용 ---
    if (isMockAuthEnabled()) {
      const { token, user } = getMockAuthResponse('google');
      console.log('[MOCK AUTH] 구글 로그인 (mock)', { code, user });
      login(token, user);
      navigate('/home');
      return;
    }
    // ----------------------------------------------------

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(res => res.json())
      .then(({ token, user }) => {
        login(token, user);
        navigate('/home');
      })
      .catch(() => {
        alert('로그인에 실패했습니다.');
        navigate('/');
      });
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}
