import { useState } from 'react';
import Modal from '../ui/Modal';
import {
  getPersonalityTestGateUrl,
  markOnboardingSeen,
  shouldShowPersonalityOnboarding,
} from '../../utils/personalityTestBridge';
import './OnboardingCarousel.css';

const SLIDES = [
  {
    title: '쉬는시간에 오신 걸 환영해요',
    body: '짧은 만남도, 나만의 속도로 시작할 수 있어요.',
  },
  {
    title: '이향인 성향 테스트',
    body: '관계 연결 방식과 사고 방식을 알아보면 프로필에 반영돼요.',
  },
  {
    title: '지금 시작해 볼까요?',
    body: '약 2–3분이면 끝나요. 결과는 안전하게 보관됩니다.',
  },
];

/**
 * 신규 접속자용 온보딩 캐러셀입니다.
 */
export default function OnboardingCarousel() {
  const [isOpen, setIsOpen] = useState(() => shouldShowPersonalityOnboarding());
  const [index, setIndex] = useState(0);

  if (!isOpen) {
    return null;
  }

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const handleClose = () => {
    markOnboardingSeen();
    setIsOpen(false);
  };

  const handlePrimary = () => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
      return;
    }

    markOnboardingSeen();
    setIsOpen(false);
    window.location.assign(getPersonalityTestGateUrl());
  };

  return (
    <Modal
      isOpen={isOpen}
      title={slide.title}
      confirmLabel={isLast ? '성향 테스트하기' : '다음'}
      cancelLabel="나중에"
      onConfirm={handlePrimary}
      onCancel={handleClose}
    >
      <div className="onboarding-carousel">
        <p className="onboarding-carousel__body">{slide.body}</p>
        <div className="onboarding-carousel__dots" aria-hidden="true">
          {SLIDES.map((item, dotIndex) => (
            <span
              key={item.title}
              className={`onboarding-carousel__dot${
                dotIndex === index ? ' onboarding-carousel__dot--active' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
