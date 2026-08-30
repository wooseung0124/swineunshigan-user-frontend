import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiUrl, getApiBaseUrl } from '../utils/api';
import {
  isAuthSuccess,
  saveAuthSession,
  saveSignupDraft,
} from '../utils/authSession';

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const apiBaseUrl = getApiBaseUrl() || '(Vite 프록시 → localhost:8080)';

    async function handleKakaoLogin() {
      if (error) {
        alert('카카오 로그인이 취소되었습니다.');
        navigate('/');
        return;
      }

      if (!code) {
        alert('카카오 인증 코드를 받지 못했습니다.');
        navigate('/');
        return;
      }

      if (!getApiBaseUrl() && !import.meta.env.DEV) {
        alert(
          '백엔드 주소(VITE_API_BASE_URL)가 설정되지 않았습니다.\n.env 파일에 백엔드 서버 주소를 입력해 주세요.',
        );
        navigate('/');
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/v1/auth/kakao/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            data?.message ||
            (response.status === 403
              ? '백엔드에서 접근이 거부되었습니다(403).'
              : `서버 오류 (${response.status}). 백엔드 API가 실행 중인지 확인해 주세요.`);
          throw new Error(message);
        }

        if (data.authStatus === 'ADDITIONAL_INFO_REQUIRED') {
          saveSignupDraft(data);
          navigate('/signup', { replace: true });
          return;
        }

        if (isAuthSuccess(data)) {
          saveAuthSession(data);
          navigate('/home', { replace: true });
          return;
        }

        throw new Error('로그인 응답 형식이 올바르지 않습니다.');
      } catch (err) {
        const isNetworkError =
          err instanceof TypeError ||
          /failed to fetch|networkerror|load failed/i.test(err.message);

        const message = isNetworkError
          ? `백엔드 서버(${apiBaseUrl})에 연결할 수 없습니다.\n서버가 실행 중인지, 포트가 맞는지 확인해 주세요.`
          : err.message || '로그인에 실패했습니다.';

        alert(message);
        navigate('/');
      }
    }

    handleKakaoLogin();
  }, [navigate, searchParams]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}
