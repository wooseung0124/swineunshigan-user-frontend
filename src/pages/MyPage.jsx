import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/api';

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 본인 정보 로드 (하드코딩 제거)
  useEffect(() => {
    api.users.me()
      .then((u) => setUser(u))
      .catch((err) => console.error('마이페이지 로드 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const handleWithdraw = () => {
    if (confirm('정말 탈퇴 하시겠습니까?')) {
      alert('탈퇴 처리됨');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#999' }}>불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#999' }}>정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const genderLabel = user.gender === 'MALE' ? '남성' : user.gender === 'FEMALE' ? '여성' : '-';

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
          {user.name?.[0] || '?'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>{user.name}</div>
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
          { label: '성별', value: genderLabel },
          { label: '생년월일', value: user.profile?.birthDate },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>{item.label}</span>
            <span style={{ color: '#000', fontSize: '14px', fontWeight: '500' }}>{item.value || '-'}</span>
          </div>
        ))}
      </div>

      {/* 자기소개 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>자기소개</div>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '22px' }}>{user.profile?.introduction || '아직 작성하지 않았어요.'}</div>
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