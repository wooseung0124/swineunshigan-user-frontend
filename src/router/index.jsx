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
import ComponentsTestPage from '../pages/ComponentsTestPage';
import PlaceDetailPage from '../pages/PlaceDetailPage';
import ScheduleEditPage from '../pages/ScheduleEditPage';
import ScheduleCancelPage from '../pages/ScheduleCancelPage';
import BookmarkPage from '../pages/BookmarkPage';
import SettingsPage from '../pages/SettingsPage';
import WithdrawalPage from '../pages/WithdrawalPage';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore';
import ProfilePage from '../pages/ProfilePage';
import PersonalityPage from '../pages/PersonalityPage';
import OnboardingPage from '../pages/OnboardingPage';
import OnboardingTestPage from '../pages/OnboardingTestPage';
import OnboardingPermissionPage from '../pages/OnboardingPermissionPage';
import { hasSeenOnboarding } from '../utils/onboarding';
import PaymentPage from '../pages/PaymentPage';




function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
}

function RootEntry() {
  // 온보딩 안 본 사람 → 온보딩으로. 본 사람 → 기존 로그인 흐름
  if (!hasSeenOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  );
}


function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<RootEntry />} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/schedule" element={<Layout><SchedulePage /></Layout>} />
        <Route path="/schedule/:id" element={<PrivateRoute><Layout><ScheduleDetailPage /></Layout></PrivateRoute>} />
        <Route path="/curation" element={<Layout><CurationPage /></Layout>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><Layout><MyPage /></Layout></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Layout><NotificationsPage /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/personality" element={<PrivateRoute><PersonalityPage /></PrivateRoute>} />
        <Route path="/profile-edit" element={<PrivateRoute><Layout><ProfileEditPage /></Layout></PrivateRoute>} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/onboarding/test" element={<OnboardingTestPage />} />
        <Route path="/onboarding/permission" element={<OnboardingPermissionPage />} />
        <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />

        {/* 미구현 골격 (디자인 시안 수령 후 본격 구현) */}
        <Route path="/place/:id" element={<PlaceDetailPage />} />
        <Route path="/schedule/:id/edit" element={<PrivateRoute><ScheduleEditPage /></PrivateRoute>} />
        <Route path="/schedule/:id/cancel" element={<PrivateRoute><ScheduleCancelPage /></PrivateRoute>} />
        <Route path="/bookmarks" element={<PrivateRoute><BookmarkPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/withdrawal" element={<PrivateRoute><WithdrawalPage /></PrivateRoute>} />

        {/* 개발 전용: 공통 컴포넌트 시각 검증 */}
        <Route path="/components-test" element={<ComponentsTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}