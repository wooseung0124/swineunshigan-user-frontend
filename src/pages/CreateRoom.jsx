import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectUser } from '../store/authStore';
import { api } from '../api/api';
import { SCHEDULE_CATEGORY, SCHEDULE_CATEGORY_LABEL } from '../types/types';

const CATEGORY_OPTIONS = Object.keys(SCHEDULE_CATEGORY).map(key => ({
  value: key,                          // enum 키 (MEAL, EXERCISE...)
  label: SCHEDULE_CATEGORY_LABEL[key], // 한글 (식사, 스포츠...)
}));
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
  const [selectedCategory, setSelectedCategory] = useState(SCHEDULE_CATEGORY.MEAL);
  const [selectedDate, setSelectedDate] = useState(DATES[0].iso);
  const [selectedTime, setSelectedTime] = useState({ hour: 8, minute: 30 });
  const [genderLimit, setGenderLimit] = useState('any');
  const [maxParticipants, setMaxParticipants] = useState(2);

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const currentUserId = useAuthStore.getState().user?.id;

  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [showPolicyDetail, setShowPolicyDetail] = useState(false);

  const [policyChecked, setPolicyChecked] = useState(false);    // 체크박스
  const [policyDetailAgreed, setPolicyDetailAgreed] = useState(false);  // 자세히보기 동의
  const canConfirm = policyChecked && policyDetailAgreed;


  const genderLabel = GENDER_OPTIONS.find(g => g.value === genderLimit)?.label || '무관';

  const handleSubmit = () => {
    document.activeElement?.blur();
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // 한글 카테고리 → 영문 enum
    
    // 시간 객체 → "HH:mm"
    const hh = String(selectedTime.hour).padStart(2, '0');
    const mm = String(selectedTime.minute).padStart(2, '0');
  
    const data = {
      title,
      description: activityPlan,
      category: selectedCategory,
      scheduledAt: `${selectedDate} ${hh}:${mm}`,
      genderCondition: genderLimit.toUpperCase(),  // any → ANY
      maxParticipants,
      place: { name: placeName, address: placeAddress },
    };
  
    api.schedules.create(data, currentUserId)
      .then(() => {
        setShowConfirm(false);
        setShowComplete(true);
      })
      .catch(err => {
        alert(err.message || '일정 개설에 실패했습니다.');
      });
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
              <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} style={chipStyle(selectedCategory === cat.value)}>{cat.label}</button>
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
          type="button"
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

{showConfirm && (
  <>
    {/* 뒤 회색 오버레이 — 누르면 닫힘 */}
    <div
      onClick={() => setShowConfirm(false)}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
    />
    {/* 하단 sliding-up 패널 */}
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0,
      background: '#fff',
      borderRadius: '16px 16px 0 0',
      padding: '24px',
      zIndex: 1001,
      animation: 'slideUp 0.3s ease',
    }}>
      <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
        서비스 운영 방침 동의 안내
      </div>
      <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
        서비스 운영 방침에 동의해야 일정을 개설할 수 있어요.
      </div>

      {/* 체크 + 자세히 보기 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={policyChecked}
          onChange={(e) => setPolicyChecked(e.target.checked)}
        />
          [필수] 서비스 운영 방침 동의
        </label>
        <button
          onClick={() => setShowPolicyDetail(true)}
          style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer' }}
        >
          자세히 보기
        </button>
      </div>

      {/* 닫기 / 동의하기 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setShowConfirm(false)}
          style={{ flex: 1, padding: '14px', background: '#f5f5f5', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
        >
          닫기
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{
            flex: 1, padding: '14px',
            background: canConfirm ? '#A8DC4F' : '#eee',
            color: canConfirm ? '#000' : '#999',
            border: 'none', borderRadius: '10px', fontWeight: '700',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
          }}
        >
          동의하기
        </button>
      </div>
    </div>
  </>
)}

{/* 운영방침 안내창 (자세히 보기) */}
{showPolicyDetail && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
    <div style={{ background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '420px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 + X */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
        <button
          onClick={() => setShowPolicyDetail(false)}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>
      {/* 내용 (스크롤) — 피그마 이미지 자리 */}
      <div style={{ overflowY: 'auto', padding: '0 20px 20px' }}>
        <img src="/policy-image.png" alt="서비스 운영 방침 안내" style={{ width: '100%', display: 'block' }} />
      </div>
      {/* 동의하기 */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={() => { setPolicyDetailAgreed(true); setShowPolicyDetail(false); }}
          style={{ width: '100%', padding: '14px', background: '#A8DC4F', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
        >
          동의하기
        </button>
      </div>
    </div>
  </div>
)}

      {/* 완료 모달 */}
      {showComplete && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '85%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
        <div style={{ fontSize: '18px', fontWeight: '700' }}>일정이 개설되었습니다</div>
        <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>시간과 장소를 꼭 준수해주세요</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#999' }}>장소</span>
          <span style={{ fontWeight: '500' }}>{placeName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#999' }}>일시</span>
          <span style={{ fontWeight: '500' }}>
            {selectedDate} {selectedTime.hour >= 12 ? '오후' : '오전'} {selectedTime.hour % 12 || 12}:{String(selectedTime.minute).padStart(2, '0')}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#999' }}>활동 유형</span>
          <span style={{ fontWeight: '500' }}>{SCHEDULE_CATEGORY_LABEL[selectedCategory]}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#999' }}>모집 인원</span>
          <span style={{ fontWeight: '500' }}>{maxParticipants}명</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => navigate('/home')}
          style={{ flex: 1, padding: '14px', background: '#f5f5f5', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
        >
          홈으로
        </button>
        <button
          type="button"
          onClick={() => navigate('/schedule')}
          style={{ flex: 1, padding: '14px', background: '#A8DC4F', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
        >
          일정 보러가기
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}