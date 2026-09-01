import PersonalityResultCards from '../components/personality/PersonalityResultCards';

export default function SignupPersonalityResult({ result }) {
  if (!result) {
    return null;
  }

  return (
    <section className="signup-result">
      <header className="signup-result__header">
        <p className="signup-result__eyebrow">나의 이향인 성향 테스트 결과는?</p>
        <h1 className="signup-result__headline">{result.headline}</h1>
      </header>

      <PersonalityResultCards
        connection={result.connection}
        thinking={result.thinking}
      />
    </section>
  );
}
