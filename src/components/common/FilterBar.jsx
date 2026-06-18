import { useState } from 'react';

const TIME_OPTIONS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const CATEGORY_OPTIONS = ['각자 스터디', '독학으로 그룹 과외', '조용한 식사', '유튜브 시청', '도시락 파티', '짧은 독서 모임', '여행중', '커피챗'];

export default function FilterBar({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleApply = () => {
    onFilterChange({
      date: selectedDate,
      time: selectedTime,
      category: selectedCategory,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedCategory(null);
    onFilterChange({ date: null, time: null, category: null });
    setIsOpen(false);
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
    whiteSpace: 'nowrap',
  });

  // 선택된 필터 개수
  const activeCount = [selectedDate, selectedTime, selectedCategory].filter(Boolean).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* 필터 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: activeCount > 0 ? '#FEE500' : '#2a2a2a',
          color: activeCount > 0 ? '#000' : '#fff',
          border: '1px solid #555',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        🔍 필터링
        {activeCount > 0 && (
          <span style={{
            background: '#ff3b30',
            color: '#fff',
            fontSize: '11px',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* 필터 패널 */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 998,
            }}
          />
          <div style={{
            position: 'absolute',
            top: '44px',
            left: 0,
            right: 0,
            background: '#1a1a1a',
            borderRadius: '16px',
            padding: '20px',
            zIndex: 999,
            minWidth: '300px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            {/* 날짜 */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                📅 날짜
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedDate(selectedDate === 'today' ? null : 'today')}
                  style={chipStyle(selectedDate === 'today')}
                >
                  오늘
                </button>
                <button
                  onClick={() => setSelectedDate(selectedDate === 'tomorrow' ? null : 'tomorrow')}
                  style={chipStyle(selectedDate === 'tomorrow')}
                >
                  내일
                </button>
              </div>
            </div>

            {/* 시간 */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                🕐 시간
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TIME_OPTIONS.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                    style={chipStyle(selectedTime === time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 옵션 */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                🏷️ 옵션
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORY_OPTIONS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    style={chipStyle(selectedCategory === cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                초기화
              </button>
              <button
                onClick={handleApply}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#FEE500',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                적용하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}