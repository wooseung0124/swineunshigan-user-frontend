import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  '각자 스터디', '독학으로 그룹 과외', '조용한 식사',
  '유튜브 시청', '도시락 파티', '짧은 독서 모임',
  '활동 계획 관련 스몰 도킹', '여행중', '커피챗'
];

const TIME_OPTIONS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function CreateRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const place = location.state?.place;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [activityPlan, setActivityPlan] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [genderLimit, setGenderLimit] = useState('random');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const toggleOption = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!title || !date || !time) {
      alert('방 제목, 날짜, 시간을 입력해주세요.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // TODO: 백엔드 API 연동
    console.log({
      placeId: place?.id,
      placeName: place?.place_name,
      title,
      date,
      time,
      activityPlan,
      options: selectedOptions,
      maxParticipants,
      genderLimit,
    });
    setShowConfirm(false);
    setShowComplete(true);
  };

  // 오늘/내일 날짜 계산
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const labelStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #444',
    background: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const chipStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: isActive ? '2px solid #FEE500' : '1px solid #555',
    background: isActive ? '#FEE500' : '#2a2a2a',
    color: isActive ? '#000' : '#ccc',
    fontSize: '13px',
    fontWeight: isActive ? '700' : '400',
    cursor: 'pointer',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      color: '#fff',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #333',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '700' }}>방 만들기</h1>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 장소 정보 */}
        {place && (
          <div style={{
            padding: '14px',
            background: '#1e1e1e',
            borderRadius: '12px',
            border: '1px solid #333',
          }}>
            <p style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{place.place_name}</p>
            <p style={{ fontSize: '13px', color: '#999' }}>📍 {place.road_address_name || place.address_name}</p>
            {place.phone && <p style={{ fontSize: '13px', color: '#999' }}>📞 {place.phone}</p>}
          </div>
        )}

        {/* 방 제목 */}
        <div>
          <label style={labelStyle}>방 제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="방 제목을 입력하세요"
            style={inputStyle}
          />
        </div>

        {/* 약속 날짜 */}
        <div>
          <label style={labelStyle}>📅 약속 날짜</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button onClick={() => setDate(today)} style={chipStyle(date === today)}>오늘</button>
            <button onClick={() => setDate(tomorrow)} style={chipStyle(date === tomorrow)}>내일</button>
          </div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={today}
            style={inputStyle}
          />
        </div>

        {/* 약속 시간 */}
        <div>
          <label style={labelStyle}>🕐 약속 시간</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TIME_OPTIONS.map(t => (
              <button key={t} onClick={() => setTime(t)} style={chipStyle(time === t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 활동 계획 */}
        <div>
          <label style={labelStyle}>📝 활동 계획</label>
          <textarea
            value={activityPlan}
            onChange={e => setActivityPlan(e.target.value)}
            placeholder="어떤 활동을 할 예정인지 작성해주세요"
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {/* 옵션 선택 */}
        <div>
          <label style={labelStyle}>🏷️ 옵션 선택</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORY_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                style={chipStyle(selectedOptions.includes(option))}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 모집 인원 */}
        <div>
          <label style={labelStyle}>👥 모집 최대 인원</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMaxParticipants(Math.max(2, maxParticipants - 1))}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#333', color: '#fff', border: 'none',
                fontSize: '18px', cursor: 'pointer',
              }}
            >−</button>
            <span style={{ fontSize: '20px', fontWeight: '700' }}>{maxParticipants}명</span>
            <button
              onClick={() => setMaxParticipants(maxParticipants + 1)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#333', color: '#fff', border: 'none',
                fontSize: '18px', cursor: 'pointer',
              }}
            >+</button>
          </div>
        </div>

        {/* 성별 제한 */}
        <div>
          <label style={labelStyle}>🚻 성별 제한</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setGenderLimit('same')} style={chipStyle(genderLimit === 'same')}>
              동성끼리
            </button>
            <button onClick={() => setGenderLimit('random')} style={chipStyle(genderLimit === 'random')}>
              랜덤
            </button>
          </div>
        </div>

        {/* 약속 잡기 버튼 */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '16px',
            background: '#FEE500',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          약속 잡기
        </button>
      </div>

      {/* 서비스 운영 방침 동의 모달 */}
      {showConfirm && (
        <>
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e1e1e', borderRadius: '16px',
            padding: '24px', zIndex: 1001, width: '85%', maxWidth: '400px',
            color: '#fff',
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '12px' }}>
              서비스 운영 방침 안내
            </h3>
            <div style={{
              fontSize: '13px', color: '#aaa', lineHeight: '1.6',
              maxHeight: '200px', overflowY: 'auto', marginBottom: '20px',
            }}>
              <p>• 다른 참여자에게 불쾌감을 주는 행위를 금지합니다.</p>
              <p>• 약속 시간을 준수해주세요.</p>
              <p>• 무단 불참 시 패널티가 부과될 수 있습니다.</p>
              <p>• 개인정보를 무단으로 수집하거나 공유하지 마세요.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: '12px', background: '#333',
                  color: '#fff', border: '1px solid #555',
                  borderRadius: '10px', cursor: 'pointer',
                }}
              >취소</button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1, padding: '12px', background: '#FEE500',
                  color: '#000', border: 'none',
                  borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                }}
              >동의하기</button>
            </div>
          </div>
        </>
      )}

      {/* 완료 모달 */}
      {showComplete && (
        <>
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e1e1e', borderRadius: '16px',
            padding: '24px', zIndex: 1001, width: '85%', maxWidth: '400px',
            textAlign: 'center', color: '#fff',
          }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              방 만들기 완료!
            </h3>
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px' }}>
              참여자들이 들어올 때까지 기다려주세요.
            </p>
            <button
              onClick={() => navigate('/home')}
              style={{
                width: '100%', padding: '14px', background: '#FEE500',
                color: '#000', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              }}
            >닫기</button>
          </div>
        </>
      )}
    </div>
  );
}