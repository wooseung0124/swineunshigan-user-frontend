import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { markOnboardingSeen } from '../utils/onboarding';
import { PERSONALITY_TEST_URL } from '../utils/personality';


import img1 from '../components/icons/캐러셀.svg';
import img2 from '../components/icons/캐러셀1.svg';
import img3 from '../components/icons/캐러셀2.svg';
import img4 from '../components/icons/캐러셀3.svg';
import img5 from '../components/icons/케러셀5.png';
import img6 from '../components/icons/캐러셀6.svg';
import img7 from '../components/icons/캐러셀7.svg';


// 슬라이드 1~7 (요엘님 확정 텍스트 + 시안 버튼 라벨)
const SLIDES = [
  { img: img1, title: "혼자도, 같이도 괜찮은 시간\n'쉬는시간'", body: '문득 누군가와 함께하고 싶은 순간, 가볍게 약속을 열어보세요.\n혼자도 좋고, 함께라면 더 좋은 시간.\n당신의 평범한 순간에 작은 동행을 더해보세요.', btn: '다음' },
  { img: img2, title: '오늘, 하고 싶은 게 있었나요?', body: '누군가 함께하면 더 좋고,\n아니어도 그대로 즐겨도 돼요.', btn: '다음' },
  { img: img3, title: '10초면 충분해요!', body: '활동, 시간, 장소를 고르면\n약속이 바로 열려요.', btn: '다음' },
  { img: img4, title: '아무도 안 와도 괜찮아요', body: '함께할 사람이 나타나면 좋고,\n아니어도 당신의 시간은 그대로 빛나니까요.', btn: '다음' },
  { img: img5, title: '소식을 놓치지 않으려면\n딱! 두 가지만 확인해 주세요! 😉', body: '휴대폰 홈 화면에 추가하면 더 편하게 사용할 수 있어요\n홈화면에 추가하신 후 알림을 허용해주세요\n(단, 아이폰인 경우 iOS 16.4 이상만 알림 허용이 됩니다)', btn: '다음' },
  { img: img6, title: '지금, 첫 장면을 열어볼까요?', body: '혼자여도 좋고, 함께라면 더 좋은 시간.\n당신의 빛나는 시작이 여기서 펼쳐집니다.', btn: '둘러보기' },
  { img: img7, title: '나의 관계성향은 어떨까?', body: '여러분의 관계연결성향은 어떤지 테스트 해보세요', btn: '나의 성향 알아보기' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  const finishOnboarding = () => {
    markOnboardingSeen();  // dontShow 조건 제거: 온보딩을 봤으면(닫든 끝까지 보든) 다시 안 띄움
  };

  const handleNext = () => {
    if (isLast) {
      // 마지막: 성향 테스트(외부)로
      markOnboardingSeen();
      window.location.href = PERSONALITY_TEST_URL;
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleClose = () => {
    finishOnboarding();
    localStorage.setItem('resttime:permission:pending', 'true');  // 홈에서 권한 팝업 뜨게
    navigate('/home');
  };

  return (
    <div style={S.overlay}>
      {/* 상단: 다시 보지 않기 / 닫기 */}
      <div style={S.topBar}>
        <label style={S.dontShow}>
          <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} style={S.checkbox} />
          다시 보지 않기
        </label>
        <button onClick={handleClose} style={S.closeBtn}>닫기</button>
      </div>

      {/* 하단 시트 카드 */}
      <div style={S.card}>
        <h1 style={S.title}>{slide.title}</h1>
        <p style={S.body}>{slide.body}</p>

        <div style={S.imgWrap}>
          <img src={slide.img} alt="" style={S.img} />
        </div>

        {/* 진행 점 */}
        <div style={S.dots}>
          {SLIDES.map((_, i) => (
            <span key={i} style={i === step ? S.dotActive : S.dot} />
          ))}
        </div>

        <button onClick={handleNext} style={S.nextBtn}>{slide.btn}</button>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 1000,
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 'var(--spacing-4)',
  },
  dontShow: {
    display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-body-sm)', color: 'var(--color-text-white)', cursor: 'pointer',
  },
  checkbox: { width: '16px', height: '16px', accentColor: 'var(--color-primary-500)' },
  closeBtn: {
    background: 'transparent', border: 'none', color: 'var(--color-text-white)',
    fontSize: 'var(--font-size-body)', cursor: 'pointer',
  },
  card: {
    background: 'var(--color-background)',
    borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)',
    padding: 'var(--spacing-8) var(--spacing-6) var(--spacing-6)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  title: {
    fontSize: 'var(--font-size-heading-2)', fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text)', lineHeight: 1.4, margin: 0, textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  body: {
    marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-gray)', lineHeight: 1.6, textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  imgWrap: {
    width: '100%', display: 'flex', justifyContent: 'center',
    margin: 'var(--spacing-6) 0',
  },
  img: { width: '60%', maxWidth: '220px', height: 'auto' },
  dots: { display: 'flex', justifyContent: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' },
  dot: {
    width: '6px', height: '6px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-border)', transition: 'all 0.3s ease',
  },
  dotActive: {
    width: '20px', height: '6px', borderRadius: 'var(--radius-round)',
    background: 'var(--color-primary-500)', transition: 'all 0.3s ease',
  },
  nextBtn: {
    width: '100%', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
    border: 'none', background: 'var(--color-primary-500)', color: 'var(--color-text)',
    fontSize: 'var(--font-size-body-lg)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
  },
};