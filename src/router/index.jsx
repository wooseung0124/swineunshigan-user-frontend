import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NaverCallback from '../pages/NaverCallback';
import KakaoCallback from '../pages/KakaoCallback';
import GoogleCallback from '../pages/GoogleCallback';
import HomePage from '../pages/HomePage';
import Layout from '../components/common/Layout';
import CreateRoom from '../pages/CreateRoom';
import SchedulePage from '../pages/SchedulePage';
import ScheduleDetailPage from '../pages/ScheduleDetailPage';
import NotificationsPage from '../pages/NotificationsPage';
import MyPage from '../pages/MyPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import CurationPage from '../pages/CurationPage';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/schedule" element={<PrivateRoute><Layout><SchedulePage /></Layout></PrivateRoute>} />
        <Route path="/schedule/:id" element={<PrivateRoute><Layout><ScheduleDetailPage /></Layout></PrivateRoute>} />
        <Route path="/curation" element={<Layout><CurationPage /></Layout>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><Layout><MyPage /></Layout></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Layout><NotificationsPage /></Layout></PrivateRoute>} />
        <Route path="/profile-edit" element={<PrivateRoute><Layout><ProfileEditPage /></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}