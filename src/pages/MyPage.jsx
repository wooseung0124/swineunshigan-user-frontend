import { useNavigate } from 'react-router-dom';

const DUMMY_USER = {
  name: '김진우',
  gender: '남성',
  birthDate: '1995-12-09',
  email: 'juston1207@kakao.com',
  mbti: 'INFP',
  introduction: '음악듣는것을 좋아하는 프론트엔드 개발자입니다.',
  soloActivity: '카페에서 넷플,크론치롤 보기',
  challengeProject: '쉬는시간 서비스 개발',
};

export default function MyPage() {
  const navigate = useNavigate();
  const user = DUMMY_USER;

  const handleLogout = () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleWithdraw = () => {
    if (confirm('정말 탈퇴 하시겠습니까?')) {
      alert('탈퇴 처리됨');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000', margin: 0 }}>마이페이지</h1>
      </div>

      {/* 프로필 영역 */}
      <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#A8DC4F', display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '0 auto 12px', fontSize: '32px', fontWeight: '700', color: '#000',
        }}>
          {user.name[0]}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', color: '#000' }}>{user.name}</div>
        <div style={{ color: '#5DA80E', fontSize: '14px', marginBottom: '16px', fontWeight: '600' }}>{user.mbti}</div>
        <button
          onClick={() => navigate('/profile-edit')}
          style={{
            padding: '8px 20px', borderRadius: '20px', border: '1px solid #ddd',
            background: '#fff', color: '#000', fontSize: '13px', cursor: 'pointer',
          }}
        >
          프로필 수정
        </button>
      </div>

      {/* 기본 정보 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>기본 정보</div>
        {[
          { label: '이메일', value: user.email },
          { label: '성별', value: user.gender },
          { label: '생년월일', value: user.birthDate },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>{item.label}</span>
            <span style={{ color: '#000', fontSize: '14px', fontWeight: '500' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>자기소개</div>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>{user.introduction}</div>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>혼자서 주로 하는 활동</div>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>{user.soloActivity}</div>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>나만의 프로젝트</div>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>{user.challengeProject}</div>
      </div>

      {/* 메뉴 */}
      <div style={{ padding: '0 16px', borderBottom: '1px solid #eee' }}>
        {['📌 북마크 게시글', '🔔 알림 설정', '📢 공지사항', '📋 이용약관', '⚙️ 설정'].map(item => (
          <div key={item} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
          }}>
            <span style={{ fontSize: '15px', color: '#000', fontWeight: '500' }}>{item}</span>
            <span style={{ color: '#999', fontSize: '20px' }}>›</span>
          </div>
        ))}
      </div>

      {/* 로그아웃/탈퇴 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '20px' }}>
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' }}>로그아웃</button>
        <span style={{ color: '#ddd' }}>|</span>
        <button onClick={handleWithdraw} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer' }}>회원 탈퇴</button>
      </div>
    </div>
  );
}