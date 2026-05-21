import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { verifyOAuthState, isMockAuthEnabled, getMockAuthResponse } from '../config/oauth';

export default function NaverCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');  // ← 추가
  
    // OAuth 취소/실패 처리
    if (error) {
      console.log('[OAuth] 네이버 로그인 취소/실패:', error);
      navigate('/login');
      return;
    }
  
    // code 누락 처리 (취소 시 code 없이 오는 경우)
    if (!code) {
      navigate('/login');
      return;
    }
  
    if (!verifyOAuthState('naver', state)) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }
  
    // ... 나머지 그대로

    // --- Mock 분기: 백엔드 미연동 시 풀 플로우 테스트용 ---
    if (isMockAuthEnabled()) {
      const { token, user } = getMockAuthResponse('naver');
      console.log('[MOCK AUTH] 네이버 로그인 (mock)', { code, user });
      login(token, user);
      navigate('/home');
      return;
    }
    // ----------------------------------------------------

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/naver/callback`, {
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