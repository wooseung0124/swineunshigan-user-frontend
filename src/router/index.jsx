import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NaverCallback from '../pages/NaverCallback';
import KakaoCallback from '../pages/KakaoCallback';
import HomePage from '../pages/HomePage';
import Layout from '../components/common/Layout';
import CreateRoom from '../pages/CreateRoom';
import MyPage from '../pages/MyPage';
import ProfilePage from '../pages/ProfilePage';
import SignupPage from '../pages/SignupPage';
import { getSignupDraft } from '../utils/authSession';

// 로그인 여부 확인
const isLoggedIn = () => !!localStorage.getItem('token');
const isGuest = () => sessionStorage.getItem('guest') === 'true';

// 로그인 안 되어 있으면 로그인 페이지로
function PrivateRoute({ children }) {
  return isLoggedIn() || isGuest() ? children : <Navigate to="/" />;
}

// 이미 로그인 되어 있으면 홈으로
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/home" /> : children;
}

// 회원가입 draft가 있을 때만 접근
function SignupRoute({ children }) {
  const draft = getSignupDraft();

  if (draft?.signupToken) {
    return children;
  }

  return isLoggedIn() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/signup" element={<SignupRoute><SignupPage /></SignupRoute>} />
        <Route path="/home" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>일정</div></Layout></PrivateRoute>} />
        <Route path="/verify" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>인증하기</div></Layout></PrivateRoute>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><Layout><MyPage /></Layout></PrivateRoute>} />
        <Route path="/mypage/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}