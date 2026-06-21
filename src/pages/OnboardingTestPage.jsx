import { markOnboardingSeen } from '../utils/onboarding';
import { PERSONALITY_TEST_URL } from '../utils/personality';

export default function OnboardingTestPage() {
  const handleStartTest = () => {
    markOnboardingSeen(); // 외부로 나가면 앱을 떠나므로, 여기서 본 것으로 간주
    window.location.href = PERSONALITY_TEST_URL;
  };

  return (
    <div style={S.page}>
      <div style={S.body}>
        <h1 style={S.title}>나의 관계성향은 어떨까?</h1>
        <p style={S.desc}>여러분의 관계연결성향은 어떤지<br />테스트 해보세요</p>
      </div>

      <div style={S.footer}>
        <button onClick={handleStartTest} style={S.primaryBtn}>나의 성향 알아보기</button>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)',
    display: 'flex', flexDirection: 'column',
  },
  body: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', textAlign: 'center', padding: '0 var(--spacing-6)',
  },
  title: {
    fontSize: 'var(--font-size-heading-1)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', lineHeight: 1.4, margin: 0,
  },
  desc: {
    marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-body-lg)',
    color: 'var(--color-text-gray)', lineHeight: 1.6,
  },
  footer: {
    padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-10)',
  },
  primaryBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};