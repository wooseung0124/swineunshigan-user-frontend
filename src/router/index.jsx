import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import NaverCallback from '../pages/NaverCallback';
import KakaoCallback from '../pages/KakaoCallback';
import HomePage from '../pages/HomePage';
import Layout from '../components/common/Layout';
import CreateRoom from '../pages/CreateRoom';
import MyPage from '../pages/MyPage';
import ProfilePage from '../pages/ProfilePage';
import PersonalityResultPage from '../pages/PersonalityResultPage';
import PersonalityTestGatePage from '../pages/PersonalityTestGatePage';
import PersonalityWaitingPage from '../pages/PersonalityWaitingPage';
import EditNamePage from '../pages/EditNamePage';
import EditGenderPage from '../pages/EditGenderPage';
import SignupPage from '../pages/SignupPage';
import PersonalityResultIngest from '../components/personality/PersonalityResultIngest';
import { getSignupDraft } from '../utils/authSession';
import { getPendingPersonalityResult } from '../utils/personalityTestBridge';
import { restoreSignupAfterPersonalityQuiz } from '../utils/signupQuizHandoff';

const isLoggedIn = () => !!localStorage.getItem('token');
const isGuest = () => sessionStorage.getItem('guest') === 'true';

function PrivateRoute({ children }) {
  return isLoggedIn() || isGuest() ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/home" /> : children;
}

function SignupRoute({ children }) {
  restoreSignupAfterPersonalityQuiz();
  const draft = getSignupDraft();

  if (draft?.signupToken || getPendingPersonalityResult()) {
    return children;
  }

  return isLoggedIn() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <PersonalityResultIngest />
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/signup" element={<SignupRoute><SignupPage /></SignupRoute>} />
        <Route path="/test" element={<PersonalityTestGatePage />} />
        <Route path="/personality-waiting" element={<PersonalityWaitingPage />} />
        <Route path="/home" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/schedule" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>일정</div></Layout></PrivateRoute>} />
        <Route path="/verify" element={<PrivateRoute><Layout><div style={{padding:'24px'}}>인증하기</div></Layout></PrivateRoute>} />
        <Route path="/create-room" element={<PrivateRoute><CreateRoom /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><Layout><MyPage /></Layout></PrivateRoute>} />
        <Route path="/mypage/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route
          path="/mypage/profile/personality"
          element={<PrivateRoute><Layout><PersonalityResultPage /></Layout></PrivateRoute>}
        />
        <Route
          path="/mypage/profile/edit-name"
          element={<PrivateRoute><Layout><EditNamePage /></Layout></PrivateRoute>}
        />
        <Route
          path="/mypage/profile/edit-gender"
          element={<PrivateRoute><Layout><EditGenderPage /></Layout></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
