import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function NaverCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const savedState = sessionStorage.getItem('naver_oauth_state');

    if (state !== savedState) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/naver/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(res => res.json())
      .then(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
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