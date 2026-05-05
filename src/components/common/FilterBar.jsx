import { useState } from 'react';

const FILTER_OPTIONS = ['전체', '영업중', '카페', '음식점', '문화시설', '레포츠'];

export default function FilterBar({ onFilterChange }) {
  const [selected, setSelected] = useState('전체');

  const handlePress = (filter) => {
    setSelected(filter);
    onFilterChange(filter);
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