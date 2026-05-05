import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SlideUpPanel({ place, onClose }) {
  const navigate = useNavigate();
  if (!place) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 999,
        }}
      />

      {/* 슬라이드 업 패널 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1a1a1a',
        borderRadius: '20px 20px 0 0',
        padding: '20px',
        zIndex: 1000,
        maxHeight: '50vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease-out',
        color: '#fff',
      }}>
        {/* 드래그 핸들 */}
        <div style={{
          width: '40px',
          height: '4px',
          background: '#555',
          borderRadius: '2px',
          margin: '0 auto 16px',
        }} />

        {/* 장소 이름 */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '8px',
        }}>
          {place.name}
        </h2>

        {/* 카테고리 */}
        {place.category && (
          <span style={{
            fontSize: '13px',
            color: '#aaa',
            marginBottom: '12px',
            display: 'block',
          }}>
            {place.category}
          </span>
        )}

        {/* 주소 */}
        <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '6px' }}>
          📍 {place.address}
        </p>

        {/* 전화번호 */}
        {place.phone && (
          <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '16px' }}>
            📞 {place.phone}
          </p>
        )}

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button style={{
            flex: 1,
            padding: '14px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            방 조회하기
          </button>
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (!token) {
                if (confirm('로그인이 필요합니다. 로그인 하시겠습니까?')) {
                  navigate('/');
                }
                return;
              }
              onClose();
              navigate('/create-room', { state: { place } });
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: '#FEE500',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            방 만들기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}