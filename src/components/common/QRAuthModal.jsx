export default function QRAuthModal({ open, onClose }) {
    if (!open) return null;
  
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px 24px',
            width: '85%',
            maxWidth: '320px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            textAlign: 'center',
          }}
        >
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#000',
          }}>
            인증하기
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '24px',
          }}>
            QR 코드를 스캔하거나 보여주세요
          </p>
  
          {/* QR 코드 자리 (시연용 placeholder) */}
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto 24px',
            background: '#f5f5f5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
          }}>
            QR 코드 자리
          </div>
  
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: '12px',
              border: 'none',
              background: '#A8DC4F',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      </div>
    );
  }