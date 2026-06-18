import { useState } from 'react';

const DUMMY_FEEDS = [
  { id: 1, title: '성수동 분위기 좋은 카페 BEST 5', summary: '요즘 성수에서 가장 핫한 카페들을 모아봤어요.', category: '카페', date: '2026-04-28', bookmarked: true },
  { id: 2, title: '서울숲 산책 코스 추천', summary: '운동도 하고 자연도 즐기고. 추천 산책 코스 3가지.', category: '레포츠', date: '2026-04-25', bookmarked: false },
  { id: 3, title: '성수에서 만나기 좋은 점심 맛집', summary: '직장인부터 데이트까지, 점심 약속 잡기 좋은 맛집.', category: '음식점', date: '2026-04-22', bookmarked: false },
  { id: 4, title: '문화생활 즐기기 좋은 성수 갤러리', summary: '예술과 함께하는 시간. 매력적인 갤러리 4곳.', category: '문화시설', date: '2026-04-20', bookmarked: true },
  { id: 5, title: '성수 핫플 - 인스타 감성 가득', summary: '사진 찍기 좋은 성수의 인스타 핫플.', category: '카페', date: '2026-04-18', bookmarked: false },
];

const CATEGORY_OPTIONS = ['전체', '카페', '음식점', '문화시설', '레포츠'];

const CATEGORY_COLOR = {
  카페: '#FF9500',
  음식점: '#FF3B30',
  문화시설: '#5856D6',
  레포츠: '#4CD964',
};

const CATEGORY_EMOJI = {
  카페: '☕',
  음식점: '🍽️',
  문화시설: '🎨',
  레포츠: '🌳',
};

export default function CurationPage() {
  const [feeds, setFeeds] = useState(DUMMY_FEEDS);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filtered = selectedCategory === '전체'
    ? feeds
    : feeds.filter(f => f.category === selectedCategory);

  const handleBookmark = (id, e) => {
    e.stopPropagation();
    setFeeds(prev => prev.map(f => f.id === id ? { ...f, bookmarked: !f.bookmarked } : f));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>큐레이션</h1>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #A8DC4F' : '1px solid #ddd',
              background: selectedCategory === cat ? '#A8DC4F' : '#fff',
              color: selectedCategory === cat ? '#000' : '#666',
              fontSize: '13px',
              fontWeight: selectedCategory === cat ? '700' : '400',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 피드 리스트 */}
      <div style={{ padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>큐레이션 피드가 없습니다</div>
        ) : (
          filtered.map(feed => (
            <div
              key={feed.id}
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* 이미지 영역 */}
              <div style={{
                height: '160px',
                background: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '60px',
              }}>
                {CATEGORY_EMOJI[feed.category]}
              </div>

              {/* 내용 */}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: CATEGORY_COLOR[feed.category] + '20',
                    color: CATEGORY_COLOR[feed.category],
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {feed.category}
                  </span>
                  <button
                    onClick={(e) => handleBookmark(feed.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '22px',
                      color: '#FEE500',
                      cursor: 'pointer',
                    }}
                  >
                    {feed.bookmarked ? '★' : '☆'}
                  </button>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>{feed.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '18px', marginBottom: '8px' }}>{feed.summary}</p>
                <div style={{ color: '#999', fontSize: '12px' }}>{feed.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}