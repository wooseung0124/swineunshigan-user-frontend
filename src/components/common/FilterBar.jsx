import { useState } from 'react';

const FILTER_OPTIONS = ['카페', '음식점', '문화시설', '레포츠'];

export default function FilterBar({ onFilterChange }) {
  const [selected, setSelected] = useState(null);

  const handlePress = (filter) => {
    // 같은 필터 다시 누르면 선택 해제 (전체 표시)
    const next = selected === filter ? null : filter;
    setSelected(next);
    onFilterChange(next);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      scrollbarWidth: 'none',
    }}>
      {FILTER_OPTIONS.map(filter => (
        <button
          key={filter}
          onClick={() => handlePress(filter)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            background: selected === filter ? '#4CAF50' : '#fff',
            color: selected === filter ? '#fff' : '#333',
            fontSize: '13px',
            fontWeight: selected === filter ? '700' : '400',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}