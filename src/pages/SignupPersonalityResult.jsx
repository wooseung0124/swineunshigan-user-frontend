import { partitionTagsByFormSuffix } from '../data/personalityTypes';

function TagRows({ tags }) {
  const { formTags, otherTags } = partitionTagsByFormSuffix(tags);

  if (formTags.length === 0 && otherTags.length === 0) {
    return null;
  }

  return (
    <div className="signup-result__tags">
      {formTags.length > 0 && (
        <div className="signup-result__tag-row">
          {formTags.map((tag) => (
            <span key={tag} className="signup-result__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {otherTags.length > 0 && (
        <div className="signup-result__tag-row">
          {otherTags.map((tag) => (
            <span key={tag} className="signup-result__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultCard({ section }) {
  return (
    <article className="signup-result__card">
      <p className="signup-result__card-label">{section.label}</p>
      <h2 className="signup-result__card-title">{section.title}</h2>
      <p className="signup-result__card-summary">{section.summary}</p>

      {section.tags?.length > 0 && <TagRows tags={section.tags} />}

      <div className="signup-result__divider" aria-hidden="true" />
      <p className="signup-result__description">{section.description}</p>
    </article>
  );
}

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

      <ResultCard section={result.connection} />
      <ResultCard section={result.thinking} />
    </section>
  );
}
