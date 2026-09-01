const INFO_ITEMS = [
  '이향인 성향 테스트는 회원가입시 필수사항으로 2-3분 정도 소요 돼요',
  '나의 가치관과 성향을 분석해요',
  '결과는 안전하게 보호돼요',
];

function MultilineText({ text, className }) {
  return (
    <span className={className}>
      {text.split('\n').map((line, index) => (
        <span key={line}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </span>
  );
}

export default function SignupPersonalityIntro({ title, subtitle }) {
  return (
    <section className="signup-personality">
      <header className="signup-personality__header">
        <h1 className="signup-personality__title">
          <MultilineText text={title} />
        </h1>
        <p className="signup-personality__subtitle">
          <MultilineText text={subtitle} />
        </p>
      </header>

      <div className="signup-personality__panel">
        {INFO_ITEMS.map((item) => (
          <p key={item} className="signup-personality__info-item">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
