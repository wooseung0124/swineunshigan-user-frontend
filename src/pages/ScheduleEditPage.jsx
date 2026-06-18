import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore, selectUser } from '../store/authStore';
import { api } from '../api/api';
import { SCHEDULE_CATEGORY, SCHEDULE_CATEGORY_LABEL } from '../types/types';

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
    });
  }
  return dates;
};
const DATES = generateDates();


const CATEGORY_OPTIONS = Object.keys(SCHEDULE_CATEGORY).map(key => ({
  value: key,
  label: SCHEDULE_CATEGORY_LABEL[key],
}));
const GENDER_LABEL = { ANY: '성별 무관', MALE_ONLY: '남자만', FEMALE_ONLY: '여자만', any: '성별 무관', male_only: '남자만', female_only: '여자만' };
const PARTICIPANT_OPTIONS = [4, 3, 2];

export default function ScheduleEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore(selectUser);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 수정 가능 필드 (제5조)
  const [title, setTitle] = useState('');
  const [activityPlan, setActivityPlan] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SCHEDULE_CATEGORY.MEAL);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState({ hour: 8, minute: 30 });
  const [maxParticipants, setMaxParticipants] = useState(2);

  // 수정 불가 필드 (제5조 — 표시만, 잠금)
  const [placeName, setPlaceName] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const [genderCondition, setGenderCondition] = useState('ANY');

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  // 기존 일정 값 불러와서 채우기
  useEffect(() => {
    api.schedules.detail(id, user?.id)
      .then((s) => {
        setTitle(s.title || '');
        setActivityPlan(s.description || '');
        setSelectedCategory(s.category || SCHEDULE_CATEGORY.MEAL);
        setMaxParticipants(s.maxParticipants || 2);
        // scheduledAt "YYYY-MM-DD HH:mm" → 분리
        if (s.scheduledAt) {
          const [datePart, timePart] = s.scheduledAt.split(' ');
          setSelectedDate(datePart || '');
          if (timePart) {
            const [h, m] = timePart.split(':');
            setSelectedTime({ hour: Number(h), minute: Number(m) });
          }
        }
        // 잠금 필드
        setPlaceName(s.place?.name || '');
        setPlaceAddress(s.place?.address || '');
        setGenderCondition(s.genderCondition || 'ANY');
      })
      .catch((err) => alert(err.message || '일정을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleSave = async () => {
    document.activeElement?.blur();
    if (!title) { alert('제목을 입력해주세요.'); return; }

    const hh = String(selectedTime.hour).padStart(2, '0');
    const mm = String(selectedTime.minute).padStart(2, '0');

    // 제5조: 수정 가능 항목만 전송 (장소·성별 제외)
    const data = {
      title,
      description: activityPlan,
      category: selectedCategory,
      scheduledAt: `${selectedDate} ${hh}:${mm}`,
      maxParticipants,
    };

    setSubmitting(true);
    try {
      await api.schedules.update(id, data);
      navigate(`/schedule/${id}`, { state: { toast: '일정이 수정되었습니다' } });
    } catch (err) {
      alert(err.message || '일정 수정에 실패했습니다.');
      setSubmitting(false);
    }
  };

  const chipStyle = (isActive) => ({
    padding: '10px 18px', borderRadius: '24px',
    border: isActive ? '1px solid var(--color-primary-500)' : '1px solid var(--color-border)',
    background: isActive ? 'var(--color-primary-100)' : 'var(--color-background)',
    color: isActive ? 'var(--color-primary-700)' : 'var(--color-text-gray)',
    fontSize: '13px', fontWeight: isActive ? '600' : '400', cursor: 'pointer',
  });

  const formatTime = (hour, minute) => {
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}시 ${minute === 0 ? '0분' : '30분'}`;
  };

  if (loading) {
    return <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-gray)' }}>불러오는 중...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', fontSize: '24px', fontWeight: '700', color: 'var(--color-text)', cursor: 'pointer', padding: '4px 8px' }}>←</button>
        <h1 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>일정 수정</h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* 장소 (잠금) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>장소 <span style={{ color: 'var(--color-text-light-gray)', fontWeight: 400, fontSize: '12px' }}>(변경 불가)</span></div>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-card-light)', border: '1px solid var(--color-border-light)' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-gray)' }}>{placeName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-light-gray)', marginTop: '2px' }}>{placeAddress}</div>
          </div>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>제목</div>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요"
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        {/* 활동 소개 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>활동 소개</div>
          <textarea value={activityPlan} onChange={e => setActivityPlan(e.target.value)} maxLength={400}
            placeholder="활동 중심으로 일정을 소개해주세요."
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '14px', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          <div style={{ color: 'var(--color-text-light-gray)', fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>{activityPlan.length}/400</div>
        </div>

        {/* 활동 유형 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>활동 유형</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORY_OPTIONS.map(cat => (
              <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} style={chipStyle(selectedCategory === cat.value)}>{cat.label}</button>
            ))}
          </div>
        </div>

        {/* 날짜 — 개설과 동일한 7일 가로 버튼 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>날짜</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '8px' }}>
            {selectedDate ? `${Number(selectedDate.split('-')[1])}월` : ''}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {DATES.map(d => (
              <div
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                style={{
                  flex: 1, height: '56px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  borderRadius: '8px', cursor: 'pointer',
                  background: selectedDate === d.iso ? 'var(--color-primary-100)' : 'transparent',
                  border: selectedDate === d.iso ? '1px solid var(--color-primary-500)' : '1px solid transparent',
                }}
              >
                <div style={{
                  fontSize: '11px', marginBottom: '4px',
                  color: d.day === '일' ? '#ff3b30' : d.day === '토' ? '#007aff' : 'var(--color-text-gray)',
                }}>{d.day}</div>
                <div style={{
                  fontSize: '14px', fontWeight: '600',
                  color: selectedDate === d.iso ? 'var(--color-primary-700)' : 'var(--color-text)',
                }}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 시간 — CreateRoom과 동일한 휠 방식 (정시/30분만) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>시간</div>
          <div style={{ background: 'var(--color-card-light)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ color: 'var(--color-text-gray)', fontSize: '11px', lineHeight: '18px' }}>• 이용시간은 오전 5시~오후 6시 이용 가능합니다</div>
            <div style={{ color: 'var(--color-text-gray)', fontSize: '11px', lineHeight: '18px' }}>• 당일 개설은 약속 시각 3시간 전까지 가능합니다</div>
            <div style={{ color: 'var(--color-text-gray)', fontSize: '11px', lineHeight: '18px' }}>• 참여 일정이 있는 경우, 해당 시간은 비활성화 됩니다</div>
          </div>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ color: 'var(--color-primary-500)', fontSize: '14px', fontWeight: '600', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
              {formatTime(selectedTime.hour, selectedTime.minute)} ⌄
            </div>
            <div style={{ display: 'flex', height: '192px' }}>
              {/* 시 */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {Array.from({ length: 14 }, (_, i) => i + 5).map(hour => {
                  const isActive = selectedTime.hour === hour;
                  return (
                    <div key={hour} onClick={() => setSelectedTime({ ...selectedTime, hour })}
                      style={{ height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer', background: isActive ? 'var(--color-primary-100)' : 'transparent', color: isActive ? 'var(--color-primary-700)' : 'var(--color-text-light-gray)', fontWeight: isActive ? '700' : '400', fontSize: '14px' }}>
                      {hour < 12 ? '오전' : '오후'} {hour > 12 ? hour - 12 : hour}시
                    </div>
                  );
                })}
              </div>
              {/* 분 — 0분/30분만 */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {[0, 30].map(minute => {
                  const isActive = selectedTime.minute === minute;
                  return (
                    <div key={minute} onClick={() => setSelectedTime({ ...selectedTime, minute })}
                      style={{ height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer', background: isActive ? 'var(--color-primary-100)' : 'transparent', color: isActive ? 'var(--color-primary-700)' : 'var(--color-text-light-gray)', fontWeight: isActive ? '700' : '400', fontSize: '14px' }}>
                      {minute === 0 ? '0분' : '30분'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 성별 (잠금) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>성별 조건 <span style={{ color: 'var(--color-text-light-gray)', fontWeight: 400, fontSize: '12px' }}>(변경 불가)</span></div>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-card-light)', border: '1px solid var(--color-border-light)', fontSize: '14px', color: 'var(--color-text-gray)' }}>
            {GENDER_LABEL[genderCondition] || '성별 무관'}
          </div>
        </div>

        {/* 인원수 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>인원수</div>
          <div onClick={() => setShowParticipantsModal(true)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '14px', cursor: 'pointer' }}>
            <span style={{ color: 'var(--color-text)', fontSize: '14px' }}>{maxParticipants}인</span>
            <span style={{ color: 'var(--color-text-light-gray)', fontSize: '18px' }}>›</span>
          </div>
        </div>

        {/* 저장 */}
        <button type="button" onClick={handleSave} disabled={submitting}
          style={{ width: '100%', background: 'var(--color-primary-500)', borderRadius: '10px', padding: '16px', border: 'none', color: 'var(--color-text)', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '24px' }}>
          {submitting ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* 인원수 모달 */}
      {showParticipantsModal && (
        <>
          <div onClick={() => setShowParticipantsModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-background)', borderRadius: '16px 16px 0 0', padding: '20px', paddingBottom: '40px', zIndex: 999 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>인원수</div>
              <button onClick={() => setShowParticipantsModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', color: 'var(--color-text-light-gray)', cursor: 'pointer' }}>✕</button>
            </div>
            {PARTICIPANT_OPTIONS.map(n => (
              <div key={n} onClick={() => { setMaxParticipants(n); setShowParticipantsModal(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', cursor: 'pointer' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${maxParticipants === n ? 'var(--color-primary-500)' : 'var(--color-border)'}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {maxParticipants === n && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary-500)' }} />}
                </div>
                <span style={{ fontSize: '15px' }}>{n}인</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}