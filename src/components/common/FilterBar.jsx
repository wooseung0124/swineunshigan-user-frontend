import { useState } from 'react';
import { Button, Chip } from '../ui';
import './FilterBar.css';

const TIME_OPTIONS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const CATEGORY_OPTIONS = [
  '각자 스터디',
  '독학으로 그룹 과외',
  '조용한 식사',
  '유튜브 시청',
  '도시락 파티',
  '짧은 독서 모임',
  '여행중',
  '커피챗',
];

export default function FilterBar({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const activeCount = [selectedDate, selectedTime, selectedCategory].filter(Boolean).length;

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

  return (
    <div className="filter-bar">
      <button
        type="button"
        className={`filter-bar__toggle${activeCount > 0 ? ' filter-bar__toggle--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        필터링
        {activeCount > 0 && <span className="filter-bar__count">{activeCount}</span>}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="filter-bar__backdrop"
            onClick={() => setIsOpen(false)}
            aria-label="필터 닫기"
          />

          <div className="filter-bar__panel" role="dialog" aria-label="일정 필터">
            <section className="filter-bar__section">
              <h3 className="filter-bar__section-title">날짜</h3>
              <div className="filter-bar__chips">
                <Chip
                  selected={selectedDate === 'today'}
                  onClick={() => setSelectedDate(selectedDate === 'today' ? null : 'today')}
                >
                  오늘
                </Chip>
                <Chip
                  selected={selectedDate === 'tomorrow'}
                  onClick={() => setSelectedDate(selectedDate === 'tomorrow' ? null : 'tomorrow')}
                >
                  내일
                </Chip>
              </div>
            </section>

            <section className="filter-bar__section">
              <h3 className="filter-bar__section-title">시간</h3>
              <div className="filter-bar__chips">
                {TIME_OPTIONS.map((time) => (
                  <Chip
                    key={time}
                    selected={selectedTime === time}
                    onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                  >
                    {time}
                  </Chip>
                ))}
              </div>
            </section>

            <section className="filter-bar__section">
              <h3 className="filter-bar__section-title">옵션</h3>
              <div className="filter-bar__chips">
                {CATEGORY_OPTIONS.map((category) => (
                  <Chip
                    key={category}
                    selected={selectedCategory === category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Chip>
                ))}
              </div>
            </section>

            <div className="filter-bar__actions">
              <Button variant="secondary" onClick={handleReset}>
                초기화
              </Button>
              <Button onClick={handleApply}>적용하기</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
