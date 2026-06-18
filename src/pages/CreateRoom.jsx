import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectUser } from '../store/authStore';
import { api } from '../api/api';
import { SCHEDULE_CATEGORY, SCHEDULE_CATEGORY_LABEL } from '../types/types';

// 운영방침 전문 (디자인팀 보드). big=true는 제5조~ (폰트 큰 그룹)
const POLICY = [
  { title: '제1조 (목적)', body: '이 운영정책은 쉬는 시간 서비스 내에서 회원이 안전하고 쾌적하게 서비스를 이용할 수 있도록 서비스 운영 기준과 회원 관리 기준을 규정하는 것을 목적으로 합니다.' },
  { title: '제2조 (서비스 이용 기본 원칙)', body: "쉬는 시간은 '어색함도, 강제적인 교류도 없는, 무애프터(無 After), 느슨한 연결'을 지향합니다. 회원은 다음 기본 원칙을 준수하여야 합니다.\n· 상대방의 의사를 존중하고 어떠한 형태의 강요·압박도 하지 않습니다.\n· 일정 참여는 자유의사에 기반하며, 당일 혹은 그 이후 별도의 연락·교류·연락처·SNS 공유 등을 강요하지 않습니다.\n· 이성 관계나 연애 감정을 목적으로 서비스를 이용하거나 이를 일방적으로 표시·요구하는 행위를 하지 않습니다.\n· 서비스의 목적(이향인들 간의 부담 없는 소수 오프라인 만남)에 부합하는 방식으로만 이용합니다." },
  { title: '제3조 (일정 개설)', body: '회원은 다음 조건을 충족하면 일정을 개설할 수 있습니다.\n· 카메라·갤러리·위치 앱 권한 3가지에 모두 동의한 회원만 일정을 개설할 수 있습니다.\n· 동일한 날짜에 하루 1개의 일정만 개설할 수 있습니다.\n· 일정을 개설하기 전에 서비스 운영 정책에 동의하여야 합니다.\n· 입력 항목: 일정 제목(필수), 활동 소개(필수), 활동 카테고리(스터디/식사/문화활동/스포츠/기타, 필수), 날짜·시간(약속 시각 최소 3시간 전까지, 필수), 성별 조건(동성만/이성 포함/성별 무관, 필수), 인원수(2~4명, 필수), 장소(개설 후 변경 불가, 필수)' },
  { title: '제4조 (일정 참여)', body: '회원은 다음 조건을 모두 충족한 경우에 일정에 참여 신청할 수 있습니다.\n· 카메라·갤러리·위치 앱 권한 3가지에 모두 동의한 경우\n· 마이페이지 프로필 상세 정보를 모두 입력 완료한 경우\n· 일정에 설정된 성별 조건을 충족할 것\n· 해당 일정 약속 시각 기준 앞뒤 3시간 이내에 이미 참여 중인 다른 일정이 없을 것\n· 일정 최대 인원이 초과되지 않을 것' },
  { title: '제5조 (일정 수정)', big: true, body: '일정 개설자는 다음 조건을 모두 충족한 경우에만 일정을 수정할 수 있습니다.\n· 일정이 아직 모집 중인 상태(대기중)이어야 합니다.\n· 현재 참여 신청한 회원이 한 명도 없어야 합니다.\n· 수정 가능 항목은 일정 제목, 날짜·시간, 활동 소개, 활동 카테고리, 인원수(3~4명)이며, 장소와 성별 조건은 변경할 수 없습니다.' },
  { title: '제6조 (일정 취소)', big: true, body: '일정 취소는 모집 중인 상태(대기중)에서만 가능하며, 약속 당일과 전날에는 취소할 수 없습니다.\n· 일정 개설자가 취소하는 경우: 참여 신청한 회원이 없으면 별도 사유 없이 즉시 취소됩니다. 참여 신청한 회원이 1명 이상이면 취소 사유를 반드시 입력해야 하며, 참여 중인 회원 전원에게 취소 사실이 안내됩니다.\n· 일정 참여자가 취소하는 경우: 해당 회원만 일정에서 이탈하며, 일정 자체는 유지됩니다. 일정 개설자에게 이탈 사실이 안내됩니다.' },
  { title: '제7조 (현장 도착 인증)', big: true, body: "회사는 일정 당일 참여자 간 현장 도착을 상호 확인할 수 있는 QR 인증 기능을 제공합니다.\n· 현장 도착 인증 기능은 약속 시각 2시간 전부터 활성화됩니다.\n· 인증을 위해서는 카메라와 위치 권한 동의가 필요합니다.\n· 인증 코드(QR)는 생성 후 30초간 유효하며, 만료 후 재발급할 수 있습니다.\n· 본인이 생성한 인증 코드를 본인이 직접 사용하는 행위는 허용되지 않습니다.\n· 인증 코드 위·변조 또는 목적지 외 장소에서의 인증 시도는 금지되며, 적발 시 운영 조치를 받을 수 있습니다.\n· 카메라 고장 등 부득이한 사유로 QR 스캔이 어려운 경우, 이동 현황 전달 기능에서 '목적지 대기중'을 선택하여 전송하면 운영팀이 확인 후 도착 처리합니다." },
  { title: '제8조 (패널티 및 징계)', big: true, body: '패널티 기준\n다음 행위에 대해 패널티가 부과됩니다.' },
];


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
function Row({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: last ? 0 : '12px' }}>
      <span style={{ color: '#999' }}>{label}</span>
      <span style={{ color: '#000', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function formatDup(scheduledAt) {
  if (!scheduledAt) return '-';
  const [date, time] = scheduledAt.split(' ');
  const [y, m, d] = date.split('-');
  const [h, min] = (time || '00:00').split(':');
  const hour = Number(h);
  const period = hour < 12 ? '오전' : '오후';
  const dh = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${Number(m)}월 ${Number(d)}일 ${period} ${dh}:${min}`;
}
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
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);

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
        if (err.code === 'DUPLICATE_DAY') {
          setShowConfirm(false);
          setDuplicateInfo(err.existing);
          setShowDuplicate(true);
          return;
        }
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
        <h3 style={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#242423', margin: '0 0 16px' }}>서비스 운영 방침 안내</h3>
        {POLICY.map((sec, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{
              color: '#242423',
              fontSize: sec.big ? '16px' : '14px',
              fontWeight: 600,
              lineHeight: sec.big ? 1.8 : 1.5,
              letterSpacing: sec.big ? '-0.32px' : '-0.28px',
              marginBottom: '6px',
            }}>{sec.title}</div>
            <div style={{
              color: '#656563',
              fontSize: sec.big ? '14px' : '12px',
              fontWeight: 400,
              lineHeight: sec.big ? 1.8 : 1.5,
              letterSpacing: sec.big ? '-0.28px' : '-0.24px',
              whiteSpace: 'pre-line',
            }}>{sec.body}</div>
          </div>
        ))}
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

      {/* 중복 개설 팝업 (하루 하나) */}
      {showDuplicate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px 24px', width: '85%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', fontSize: '17px', fontWeight: 700, color: '#000', lineHeight: 1.5, marginBottom: '20px' }}>
              일정은 하루에 하나만<br />개설 할 수 있어요
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: '#000', marginBottom: '10px' }}>내가 개설한 일정</div>
            <div style={{ background: '#f7f7f7', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <Row label="일시" value={formatDup(duplicateInfo?.scheduledAt)} />
              <Row label="장소" value={duplicateInfo?.place?.name || '-'} />
              <Row label="모집인원" value={`${duplicateInfo?.currentParticipants ?? 1}/${duplicateInfo?.maxParticipants ?? '-'}명`} />
              <Row label="카테고리" value={SCHEDULE_CATEGORY_LABEL[duplicateInfo?.category] || '-'} last />
            </div>

            <button
              onClick={() => setShowDuplicate(false)}
              style={{ width: '100%', padding: '15px', background: '#A8DC4F', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}