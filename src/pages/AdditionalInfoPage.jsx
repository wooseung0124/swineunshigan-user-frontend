import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { promotePendingToUser } from '../utils/personality';

export default function AdditionalInfoPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [signupToken, setSignupToken] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const navState = window.history.state?.usr || {};
    if (!navState.signupToken) {
      navigate('/');
      return;
    }
    setSignupToken(navState.signupToken);
    const su = navState.socialUser || {};
    if (su.email) setEmail(su.email);
    if (su.name) setName(su.name);
    if (su.gender) setGender(su.gender);
    if (su.birthDate) setBirthDate(su.birthDate);
  }, []);

  const handleComplete = () => {
    if (!name.trim()) { alert('이름을 입력해 주세요.'); return; }
    if (!gender) { alert('성별을 선택해 주세요.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) { alert('생년월일을 YYYY-MM-DD 형식으로 입력해 주세요.'); return; }

    setSaving(true);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/signup/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signupToken,
        name: name.trim(),
        gender,
        birthDate,
        email,
        nickname: name.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authStatus !== 'SIGNUP_SUCCESS' || !data.token?.accessToken) {
          throw new Error('가입 실패');
        }
        login(data.token.accessToken, data.user);
        promotePendingToUser(data.user.id);
        navigate('/home');
      })
      .catch(() => {
        alert('가입에 실패했습니다. 다시 시도해 주세요.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.headerTitle}>추가 정보 입력</h1>
        <button onClick={handleComplete} disabled={saving} style={S.completeBtn}>
          {saving ? '처리중' : '완료'}
        </button>
      </div>

      <div style={S.body}>
        <p style={S.guide}>서비스 이용을 위해 추가 정보를 입력해 주세요.</p>

        <label style={S.label}>이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          style={S.input}
        />

        <label style={{ ...S.label, marginTop: 'var(--spacing-5)' }}>성별</label>
        <div style={S.genderRow}>
          {[{ v: 'MALE', l: '남자' }, { v: 'FEMALE', l: '여자' }].map((opt) => {
            const on = gender === opt.v;
            return (
              <button
                key={opt.v}
                onClick={() => setGender(opt.v)}
                style={on ? S.genderOn : S.genderOff}
              >
                {opt.l}
              </button>
            );
          })}
        </div>

        <label style={{ ...S.label, marginTop: 'var(--spacing-5)' }}>생년월일</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          style={S.input}
        />
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-light)',
  },
  headerTitle: {
    fontSize: 'var(--font-size-heading-3)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', margin: 0,
  },
  completeBtn: {
    background: 'transparent', border: 'none', color: 'var(--color-primary-dark)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', padding: 0,
  },
  body: { padding: 'var(--spacing-4)', maxWidth: '480px', margin: '0 auto' },
  guide: {
    fontSize: 'var(--font-size-body)', color: 'var(--color-text-gray)',
    margin: '0 0 var(--spacing-6)', lineHeight: 1.5,
  },
  label: {
    display: 'block', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text)', marginBottom: 'var(--spacing-2)',
  },
  input: {
    width: '100%', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-base)',
    border: '1px solid var(--color-border)', fontSize: 'var(--font-size-body)',
    boxSizing: 'border-box', fontFamily: 'inherit', color: 'var(--color-text)',
  },
  genderRow: { display: 'flex', gap: 'var(--spacing-3)' },
  genderOff: {
    flex: 1, padding: 'var(--spacing-3)', borderRadius: 'var(--radius-base)',
    border: '1px solid var(--color-border)', background: 'var(--color-background)',
    color: 'var(--color-text)', fontSize: 'var(--font-size-body)', cursor: 'pointer',
  },
  genderOn: {
    flex: 1, padding: 'var(--spacing-3)', borderRadius: 'var(--radius-base)',
    border: '1px solid var(--color-primary)', background: 'var(--color-primary-light)',
    color: 'var(--color-primary-dark)', fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};