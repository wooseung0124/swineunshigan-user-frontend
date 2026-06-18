import { useNavigate } from 'react-router-dom';

export default function LoginRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogin = () => {
    onClose();
    navigate('/');
  };

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
          padding: '28px 24px 20px',
          width: '85%',
          maxWidth: '320px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#000',
        }}>
          로그인이 필요해요
        </h3>
        <p style={{
          fontSize: '14px',
          textAlign: 'center',
          color: '#666',
          marginBottom: '24px',
        }}>
          로그인 하시겠습니까?
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              background: '#fff',
              color: '#666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: '12px',
              border: 'none',
              background: '#A8DC4F',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}