import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isMockAuthEnabled, getMockAuthResponse } from '../config/oauth';
import { promotePendingToUser } from '../utils/personality';

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.log('[OAuth] 카카오 로그인 취소/실패:', error);
      navigate('/login');
      return;
    }

    if (!code) {
      navigate('/login');
      return;
    }

    // --- Mock 분기: 백엔드 미연동 시 풀 플로우 테스트용 ---
    if (isMockAuthEnabled()) {
      const { token, user } = getMockAuthResponse('kakao');
      console.log('[MOCK AUTH] 카카오 로그인 (mock)', { code, user });
      login(token, user);
      promotePendingToUser(user.id);
      navigate('/home');
      return;
    }
    // ----------------------------------------------------

    
// 카카오 code를 백엔드 로그인 API로 전달 (경로: /api/v1/auth/kakao/login)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/kakao/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 신규 회원: 추가 정보 입력 필요 → 가입 마무리 화면으로
        if (data.authStatus === 'ADDITIONAL_INFO_REQUIRED') {
          navigate('/signup/additional', {
            state: {
              signupToken: data.signupToken,
              socialUser: data.socialUser,
            },
          });
          return;
        }

        // 기존 회원: 바로 로그인
        if (data.authStatus === 'LOGIN_SUCCESS') {
          login(data.token.accessToken, data.user);
          promotePendingToUser(data.user.id);
          navigate('/home');
          return;
        }

        throw new Error('알 수 없는 응답');
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