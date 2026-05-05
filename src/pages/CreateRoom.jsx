import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CATEGORY_OPTIONS = ['식사', '스터디', '문화활동', '스포츠', '기타'];
const GENDER_OPTIONS = [
  { value: 'any', label: '무관' },
  { value: 'male_only', label: '남자' },
  { value: 'female_only', label: '여자' },
];
const PARTICIPANT_OPTIONS = [4, 3, 2];

const generateTimeOptions = () => {
  const times = [];
  for (let h = 5; h <= 18; h++) {
    times.push({ hour: h, minute: 0 });
    times.push({ hour: h, minute: 30 });
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

const formatTime = (hour, minute) => {
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}시 ${minute === 0 ? '0분' : '30분'}`;
};

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d.getDate(),
      day: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
      iso: d.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }
  return dates;
};

const DATES = generateDates();

export default function CreateRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const place = location.state?.place;
  const placeName = place?.name || place?.place_name || '프리모바치오바치 홍대본점';
  const placeAddress = place?.address || place?.road_address_name || '서울특별시 마포구 홍익로 2길 27-22';

  const [title, setTitle] = useState('');
  const [activityPlan, setActivityPlan] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('식사');
  const [selectedDate, setSelectedDate] = useState(DATES[0].iso);
  const [selectedTime, setSelectedTime] = useState({ hour: 8, minute: 30 });
  const [genderLimit, setGenderLimit] = useState('any');
  const [maxParticipants, setMaxParticipants] = useState(2);

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const genderLabel = GENDER_OPTIONS.find(g => g.value === genderLimit)?.label || '무관';

  const handleSubmit = () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    console.log({ placeName, title, selectedDate, selectedTime, activityPlan, selectedCategory, maxParticipants, genderLimit });
    setShowConfirm(false);
    setShowComplete(true);
  };

  const chipStyle = (isActive) => ({
    padding: '10px 18px',
    borderRadius: '24px',
    border: isActive ? '1px solid #A8DC4F' : '1px solid #ddd',
    background: isActive ? '#A8DC4F20' : '#fff',
    color: isActive ? '#5DA80E' : '#666',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}>
        <button 
  onClick={() => navigate(-1)} 
  style={{ 
    background: 'transparent', 
    border: 'none', 
    fontSize: '24px', 
    fontWeight: '700',
    color: '#000',
    cursor: 'pointer',
    padding: '4px 8px',
  }}
>
  ←
</button>
        <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#000' }}>일정 개설</h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* 장소 정보 */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '8px',
            background: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px',
          }}>🍽️</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#666', fontSize: '12px', marginBottom: '2px' }}>음식점</div>
            <div style={{ color: '#000', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{placeName}</div>
            <div style={{ color: '#666', fontSize: '12px', marginBottom: '2px' }}>{placeAddress}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>내 위치 기준 151m</div>
            <div style={{ color: '#5DA80E', fontSize: '12px', marginTop: '4px' }}>영업 중 · 23:00에 영업종료 ⌄</div>
          </div>
        </div>

        <button style={{
          width: '100%', padding: '12px', background: '#f5f5f5',
          borderRadius: '10px', border: 'none', fontSize: '13px', cursor: 'pointer', marginBottom: '16px',
        }}>📞 전화</button>

        {/* 제목 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>제목</div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 활동 소개 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>활동 소개</div>
          <textarea
            value={activityPlan}
            onChange={e => setActivityPlan(e.target.value)}
            placeholder="활동 중심으로 일정을 소개해주세요. 어떻게 만나는지 같이 알려주시면 좋아요."
            maxLength={400}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          <div style={{ color: '#999', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>{activityPlan.length}/400</div>
        </div>

        {/* 활동 유형 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>활동 유형</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORY_OPTIONS.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={chipStyle(selectedCategory === cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>날짜</div>
          <div style={{ fontSize: '13px', color: '#000', marginBottom: '8px' }}>4월</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {DATES.map(d => (
              <div
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                style={{
                  flex: 1,
                  height: '56px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedDate === d.iso ? '#A8DC4F20' : 'transparent',
                  border: selectedDate === d.iso ? '1px solid #A8DC4F' : '1px solid transparent',
                }}
              >
                <div style={{
                  fontSize: '11px',
                  marginBottom: '4px',
                  color: d.day === '일' ? '#ff3b30' : d.day === '토' ? '#007aff' : '#666',
                }}>{d.day}</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: selectedDate === d.iso ? '#5DA80E' : '#000',
                }}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 시간 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>시간</div>
          <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ color: '#666', fontSize: '11px', lineHeight: '18px' }}>• 이용시간은 오전 5시~오후 6시 이용 가능합니다</div>
            <div style={{ color: '#666', fontSize: '11px', lineHeight: '18px' }}>• 당일 개설은 약속 시각 3시간 전까지 가능합니다</div>
            <div style={{ color: '#666', fontSize: '11px', lineHeight: '18px' }}>• 참여 일정이 있는 경우, 해당 시간은 비활성화 됩니다</div>
          </div>

          {/* 시간 박스 */}
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '14px' }}>
            <div style={{
              color: '#A8DC4F',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #eee',
            }}>
              {formatTime(selectedTime.hour, selectedTime.minute)} ⌄
            </div>
            <div style={{ display: 'flex', height: '192px' }}>
              {/* 시 */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
              {Array.from({ length: 14 }, (_, i) => i + 5).map(hour => {
                  const isActive = selectedTime.hour === hour;
                  return (
                    <div
                      key={hour}
                      onClick={() => setSelectedTime({ ...selectedTime, hour })}
                      style={{
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer',
                        background: isActive ? '#A8DC4F20' : 'transparent',
                        color: isActive ? '#5DA80E' : '#999',
                        fontWeight: isActive ? '700' : '400',
                        fontSize: '14px',
                      }}
                    >
                      {hour < 12 ? '오전' : '오후'} {hour > 12 ? hour - 12 : hour}시
                    </div>
                  );
                })}
              </div>
              {/* 분 */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {[0, 30].map(minute => {
                  const isActive = selectedTime.minute === minute;
                  return (
                    <div
                      key={minute}
                      onClick={() => setSelectedTime({ ...selectedTime, minute })}
                      style={{
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer',
                        background: isActive ? '#A8DC4F20' : 'transparent',
                        color: isActive ? '#5DA80E' : '#999',
                        fontWeight: isActive ? '700' : '400',
                        fontSize: '14px',
                      }}
                    >
                      {minute === 0 ? '0분' : '30분'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 성별 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>성별</div>
          <div
            onClick={() => setShowGenderModal(true)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '14px',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: '#000', fontSize: '14px' }}>{genderLabel}</span>
            <span style={{ color: '#999', fontSize: '18px' }}>›</span>
          </div>
        </div>

        {/* 인원수 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#000', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>인원수</div>
          <div
            onClick={() => setShowParticipantsModal(true)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '14px',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: '#000', fontSize: '14px' }}>{maxParticipants}인</span>
            <span style={{ color: '#999', fontSize: '18px' }}>›</span>
          </div>
        </div>

        {/* 일정 개설하기 */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            background: '#A8DC4F',
            borderRadius: '10px',
            padding: '16px',
            border: 'none',
            color: '#000',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '24px',
          }}
        >
          일정 개설하기
        </button>
      </div>

      {/* 성별 모달 */}
      {showGenderModal && (
        <>
          <div onClick={() => setShowGenderModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '20px', paddingBottom: '40px', zIndex: 999 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>성별</div>
              <button onClick={() => setShowGenderModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', color: '#999', cursor: 'pointer' }}>✕</button>
            </div>
            {GENDER_OPTIONS.map(g => (
              <div
                key={g.value}
                onClick={() => { setGenderLimit(g.value); setShowGenderModal(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  border: `2px solid ${genderLimit === g.value ? '#A8DC4F' : '#ddd'}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                }}>
                  {genderLimit === g.value && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#A8DC4F' }} />}
                </div>
                <span style={{ fontSize: '15px' }}>{g.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 인원수 모달 */}
      {showParticipantsModal && (
        <>
          <div onClick={() => setShowParticipantsModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '20px', paddingBottom: '40px', zIndex: 999 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>인원수</div>
              <button onClick={() => setShowParticipantsModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', color: '#999', cursor: 'pointer' }}>✕</button>
            </div>
            {PARTICIPANT_OPTIONS.map(n => (
              <div
                key={n}
                onClick={() => { setMaxParticipants(n); setShowParticipantsModal(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  border: `2px solid ${maxParticipants === n ? '#A8DC4F' : '#ddd'}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                }}>
                  {maxParticipants === n && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#A8DC4F' }} />}
                </div>
                <span style={{ fontSize: '15px' }}>{n}인</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 동의 모달 */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '85%', maxWidth: '400px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>서비스 운영 방침 안내</div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '20px', marginBottom: '20px' }}>
              • 다른 참여자에게 불쾌감을 주는 행위를 금지합니다.<br />
              • 약속 시간을 준수해주세요.<br />
              • 무단 불참 시 패널티가 부과될 수 있습니다.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>취소</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: '12px', background: '#A8DC4F', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>동의하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      {showComplete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '85%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>일정 개설 완료!</div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>참여자들이 들어올 때까지 기다려주세요.</div>
            <button onClick={() => navigate('/home')} style={{ width: '100%', padding: '12px', background: '#A8DC4F', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}