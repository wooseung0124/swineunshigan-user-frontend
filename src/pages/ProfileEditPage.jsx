import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('김진우');
  const [mbti, setMbti] = useState('INFP');
  const [introduction, setIntroduction] = useState('음악과 책을 좋아하는 프론트엔드 개발자입니다.');
  const [soloActivity, setSoloActivity] = useState('카페에서 책 읽기');
  const [challengeProject, setChallengeProject] = useState('쉬는시간 서비스 개발');

  const handleSave = () => {
    console.log({ name, mbti, introduction, soloActivity, challengeProject });
    alert('프로필이 업데이트되었습니다.');
    navigate(-1);
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
          {name[0]}
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

        {/* MBTI */}
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
        </div>

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

        {/* 혼자서 주로 하는 활동 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>혼자서 주로 하는 활동</div>
          <input
            type="text"
            value={soloActivity}
            onChange={e => setSoloActivity(e.target.value)}
            placeholder="예: 카페에서 책 읽기"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 나만의 프로젝트 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>나만의 프로젝트</div>
          <textarea
            value={challengeProject}
            onChange={e => setChallengeProject(e.target.value)}
            placeholder="도전 중인 프로젝트가 있나요?"
            maxLength={150}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          <div style={{ color: '#999', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>{challengeProject.length}/150</div>
        </div>
      </div>
    </div>
  );
}