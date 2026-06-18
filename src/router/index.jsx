import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NaverCallback from '../pages/NaverCallback';
import KakaoCallback from '../pages/KakaoCallback';
import HomePage from '../pages/HomePage';
import Layout from '../components/common/Layout';
import CreateRoom from '../pages/CreateRoom';

// 로그인 여부 확인
const isLoggedIn = () => !!localStorage.getItem('token');

// 로그인 안 되어 있으면 로그인 페이지로
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" />;
}

// 이미 로그인 되어 있으면 홈으로
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/home" /> : children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/home" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>일정현황</div></Layout></PrivateRoute>} />
        <Route path="/curation" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>큐레이션</div></Layout></PrivateRoute>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>마이페이지</div></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}