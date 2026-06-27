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
import PaymentCompletePage from '../pages/PaymentCompletePage';
import NameEditPage from '../pages/NameEditPage';
import GenderEditPage from '../pages/GenderEditPage';
import AdditionalInfoPage from '../pages/AdditionalInfoPage';
import PersonalitySignupPage from '../pages/PersonalitySignupPage';
import { captureFromUrl } from '../utils/personality';
import ProfileSignupPage from '../pages/ProfileSignupPage';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore(selectHasHydrated);
  if (!hasHydrated) return null;
  return isAuthenticated ? children : <Navigate to="/" />;
}

// router/index.jsx 상단 import에 추가
// import { useSearchParams } from 'react-router-dom';  ← 빠져있던 것
// useAuthStore는 이미 import됨

function RootEntry() {
  const userId = useAuthStore((s) => s.user?.id);

  // 성향테스트 복귀 캡처 — 유틸에 위임(검증·저장·URL정리 전부)
  // userId 있으면 바로 {userId} 키 저장, pending 경로 스킵
  const captured = captureFromUrl(userId ?? null);

  // 가입 중 복귀였다면 2단계(성향 안내)의 결과 상태로
  const inSignup = sessionStorage.getItem('resttime:signup:pending') === 'true';
  if (captured && inSignup) {
    return <Navigate to="/signup/personality" replace />;
  }

  // 기존 분기
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
  const hasHydrated = useAuthStore(selectHasHydrated);
  if (!hasHydrated) return null;
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
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route path="/profile-edit/name" element={<PrivateRoute><Layout><NameEditPage /></Layout></PrivateRoute>} />
        <Route path="/profile-edit/gender" element={<PrivateRoute><Layout><GenderEditPage /></Layout></PrivateRoute>} />
        <Route path="/personality" element={<PrivateRoute><Layout><PersonalityPage /></Layout></PrivateRoute>} />
        <Route path="/profile-edit" element={<PrivateRoute><ProfileEditPage /></PrivateRoute>} />
        <Route path="/profile-edit/name" element={<PrivateRoute><NameEditPage /></PrivateRoute>} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signup/additional" element={<AdditionalInfoPage />} />
        <Route path="/onboarding/test" element={<OnboardingTestPage />} />
        <Route path="/onboarding/permission" element={<OnboardingPermissionPage />} />
        <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/payment/complete" element={<PrivateRoute><PaymentCompletePage /></PrivateRoute>} />
        {/* 미구현 골격 (디자인 시안 수령 후 본격 구현) */}
        <Route path="/place/:id" element={<PlaceDetailPage />} />
        <Route path="/schedule/:id/edit" element={<PrivateRoute><ScheduleEditPage /></PrivateRoute>} />
        <Route path="/schedule/:id/cancel" element={<PrivateRoute><ScheduleCancelPage /></PrivateRoute>} />
        <Route path="/bookmarks" element={<PrivateRoute><BookmarkPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/withdrawal" element={<PrivateRoute><WithdrawalPage /></PrivateRoute>} />
        <Route path="/signup/additional" element={<AdditionalInfoPage />} />
        <Route path="/signup/personality" element={<PersonalitySignupPage />} />  {/* ← 추가 */}

        <Route path="/signup/additional" element={<AdditionalInfoPage />} />
        <Route path="/signup/personality" element={<PersonalitySignupPage />} />
        <Route path="/signup/profile" element={<ProfileSignupPage />} />  {/* ← 추가 */}
        {/* 개발 전용: 공통 컴포넌트 시각 검증 */}
        <Route path="/components-test" element={<ComponentsTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}