import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

// const MBTI_OPTIONS = [
//   'INTJ', 'INTP', 'ENTJ', 'ENTP',
//   'INFJ', 'INFP', 'ENFJ', 'ENFP',
//   'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
//   'ISTP', 'ISFP', 'ESTP', 'ESFP',
// ];
// 우히히 mbti 는 믿을께 못되지 우히히힣ㅎㅎㅎㅎ 없애 버리깃!!!

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');      // 추가
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [loading, setLoading] = useState(true);

  // 마운트 시 본인 정보 로드 (하드코딩 제거)
  useEffect(() => {
    api.users.me()
      .then((u) => {
        setName(u.name ?? '');
        setEmail(u.email ?? '');                    // 추가 (top-level)
        setGender(u.gender ?? '');
        setBirthDate(u.profile?.birthDate ?? '');
        //setMbti(u.profile?.mbti ?? '');
        setIntroduction(u.profile?.introduction ?? '');
      })
      .catch((err) => {
        console.error('프로필 로드 실패:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    api.users.update({
      name,
      email,                           // 추가 (top-level)
      gender,
      profile: {
        birthDate,
        introduction,
      },
    })
      .then(() => {
        alert('프로필이 업데이트되었습니다.');
        navigate(-1);
      })
      .catch((err) => {
        alert(err.message || '저장에 실패했습니다.');
      });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px', borderBottom: '1px solid #eee',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', fontSize: '24px', fontWeight: '700', color: '#000', cursor: 'pointer' }}>←</button>
        <h1 style={{ flex: 1, fontSize: '18px', fontWeight: '700', color: '#000' }}>프로필 수정</h1>
        <button onClick={handleSave} style={{ background: 'transparent', border: 'none', color: '#5DA80E', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>저장</button>
      </div>

      {/* 프로필 사진 */}
      <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#A8DC4F', margin: '0 auto 12px',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '32px', fontWeight: '700', color: '#000',
        }}>
          {name[0] || '?'}
        </div>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', fontSize: '13px', cursor: 'pointer' }}>📷 사진 변경</button>
      </div>

      <div style={{ padding: '16px' }}>
        {/* 이름 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>이름</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 이메일 (소셜 로그인 값, 읽기전용) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>이메일</div>
          <input
            type="email"
            value={email}
            readOnly
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', background: '#f5f5f5', color: '#888', cursor: 'not-allowed' }}
          />
        </div>

        {/* 성별 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>성별</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ value: 'MALE', label: '남성' }, { value: 'FEMALE', label: '여성' }].map(opt => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: gender === opt.value ? '1px solid #A8DC4F' : '1px solid #ddd',
                  background: gender === opt.value ? '#A8DC4F20' : '#fff',
                  color: gender === opt.value ? '#5DA80E' : '#666',
                  fontSize: '14px',
                  fontWeight: gender === opt.value ? '700' : '400',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 생년월일 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>생년월일</div>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        {/* MBTI
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>MBTI</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {MBTI_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => setMbti(option)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: mbti === option ? '1px solid #A8DC4F' : '1px solid #ddd',
                  background: mbti === option ? '#A8DC4F20' : '#fff',
                  color: mbti === option ? '#5DA80E' : '#666',
                  fontSize: '12px',
                  fontWeight: mbti === option ? '700' : '400',
                  cursor: 'pointer',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div> */}

        {/* 자기소개 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>자기소개</div>
          <textarea
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            placeholder="자신을 소개해보세요 (200자 이내)"
            maxLength={200}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          <div style={{ color: '#999', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>{introduction.length}/200</div>
        </div>
      </div>
    </div>
  );
}