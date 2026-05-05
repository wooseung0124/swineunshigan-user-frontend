import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NaverCallback from '../pages/NaverCallback';
import KakaoCallback from '../pages/KakaoCallback';
import HomePage from '../pages/HomePage';
import Layout from '../components/common/Layout';
import CreateRoom from '../pages/CreateRoom';
import SchedulePage from '../pages/SchedulePage';
import ScheduleDetailPage from '../pages/ScheduleDetailPage';
import NotificationsPage from '../pages/NotificationsPage';
import MyPage from '../pages/MyPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import CurationPage from '../pages/CurationPage';

const isLoggedIn = () => !!localStorage.getItem('token');

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" />;
}

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