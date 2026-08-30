import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiUrl, getApiBaseUrl } from '../utils/api';

export default function NaverCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const savedState = sessionStorage.getItem('naver_oauth_state');
    const apiBaseUrl = getApiBaseUrl() || '(Vite 프록시 → localhost:8080)';

    if (state !== savedState) {
      alert('잘못된 접근입니다.');
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

    fetch(apiUrl('/api/auth/naver/callback'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.token) {
          const message =
            data?.message ||
            data?.error ||
            (res.status === 403
              ? '백엔드에서 접근이 거부되었습니다(403).\nSpring Security에서 /api/auth/** 경로를 허용했는지 확인해 주세요.'
              : `서버 오류 (${res.status}). 백엔드 API가 실행 중인지 확인해 주세요.`);
          throw new Error(message);
        }

        return data;
      })
      .then(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        sessionStorage.removeItem('guest');
        navigate('/home');
      })
      .catch((err) => {
        const isNetworkError =
          err instanceof TypeError ||
          /failed to fetch|networkerror|load failed/i.test(err.message);

        const message = isNetworkError
          ? `백엔드 서버(${apiBaseUrl})에 연결할 수 없습니다.\n서버가 실행 중인지, npm run dev를 재시작했는지 확인해 주세요.`
          : err.message || '로그인에 실패했습니다.';

        alert(message);
        navigate('/');
      });
  }, [navigate, searchParams]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}
