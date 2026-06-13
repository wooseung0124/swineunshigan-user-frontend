import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 온보딩 1~6 메시지 (요엘님 확정 텍스트)
const SLIDES = [
  {
    title: "혼자도, 같이도 괜찮은 시간 '쉬는시간'",
    body: '약속을 만들고 싶은 날,\n저질러보는 게릴라 즉흥 동행 서비스',
  },
  {
    title: '오늘 뭔가 하고 싶었는데,\n그냥 혼자 넘긴 적 있나요?',
    body: '그 마음, 이번엔 그냥 넘기지 마세요.\n아무도 안 오면 그냥 솔로런.\n어차피 혼자 해도 됐던 거니까요.',
  },
  {
    title: '10초면 충분해요!',
    body: '활동, 시간, 장소를 고르면 일정이 열려요.\n약속 장소에 만나서 서로 QR 코드를 인증하면 끝!',
  },
  {
    title: '아무도 안 와도 괜찮아요.',
    body: '관계를 만들러 오는 곳이 아니에요.\n그냥 지금 하고 싶은 걸,\n일단 열어 보는 곳이에요.',
  },
  {
    title: '소식을 놓치지 않으려면\n딱! 두 가지만 확인해 주세요 😉',
    body: '· 홈 화면에 추가하기\n· 알림 허용하기\n(아이폰은 iOS 16.4 이상부터 푸시 지원돼요)',
  },
  {
    title: '지금, 첫 장면을 열어볼까요?',
    body: '당신의 빛나는 시간이 시작됩니다.',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  const handleNext = () => {
    if (isLast) {
      navigate('/onboarding/test'); // 작업 2번에서 테스트 안내 화면 채움
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        {step > 0 ? (
          <button onClick={handleBack} style={S.iconBtn} aria-label="이전">←</button>
        ) : (
          <span style={S.iconBtn} />
        )}
      </div>

      <div style={S.body}>
        <h1 style={S.title}>{slide.title}</h1>
        <p style={S.desc}>{slide.body}</p>
      </div>

      <div style={S.footer}>
        <div style={S.dots}>
          {SLIDES.map((_, i) => (
            <span key={i} style={i === step ? S.dotActive : S.dot} />
          ))}
        </div>
        <button onClick={handleNext} style={S.nextBtn}>
          {isLast ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', minHeight: '56px',
    padding: '0 var(--spacing-4)',
  },
  iconBtn: {
    background: 'transparent', border: 'none', fontSize: 'var(--font-size-heading-3)',
    color: 'var(--color-text)', cursor: 'pointer', width: '24px', padding: 0, lineHeight: 1,
  },
  body: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '0 var(--spacing-6)',
  },
  title: {
    fontSize: 'var(--font-size-heading-1)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', lineHeight: 1.4, margin: 0, whiteSpace: 'pre-line',
  },
  desc: {
    marginTop: 'var(--spacing-5)', fontSize: 'var(--font-size-body-lg)',
    color: 'var(--color-text-gray)', lineHeight: 1.6, whiteSpace: 'pre-line',
  },
  footer: {
    padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-10)',
    display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)',
  },
  dots: { display: 'flex', justifyContent: 'center', gap: 'var(--spacing-2)' },
  dot: {
    width: '6px', height: '6px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-border)',
  },
  dotActive: {
    width: '20px', height: '6px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-primary)',
  },
  nextBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};