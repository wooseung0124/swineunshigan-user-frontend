import { partitionTagsByFormSuffix } from '../../data/personalityTypes';
import './PersonalityResultCards.css';

function TagRows({ tags }) {
  const { formTags, otherTags } = partitionTagsByFormSuffix(tags);

  if (formTags.length === 0 && otherTags.length === 0) {
    return null;
  }

  return (
    <div className="personality-result-cards__tags">
      {formTags.length > 0 && (
        <div className="personality-result-cards__tag-row">
          {formTags.map((tag) => (
            <span key={tag} className="personality-result-cards__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {otherTags.length > 0 && (
        <div className="personality-result-cards__tag-row">
          {otherTags.map((tag) => (
            <span key={tag} className="personality-result-cards__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonalityResultCard({ section }) {
  return (
    <article className="personality-result-cards__card">
      <p className="personality-result-cards__card-label">{section.label}</p>
      <h2 className="personality-result-cards__card-title">{section.title}</h2>
      <p className="personality-result-cards__card-summary">{section.summary}</p>

      {section.tags?.length > 0 && <TagRows tags={section.tags} />}

      <div className="personality-result-cards__divider" aria-hidden="true" />
      <p className="personality-result-cards__description">{section.description}</p>
    </article>
  );
}

/**
 * 성향 테스트 결과 카드 목록.
 */
export default function PersonalityResultCards({ connection, thinking }) {
  if (!connection || !thinking) {
    return null;
  }

  return (
    <div className="personality-result-cards">
      <PersonalityResultCard section={connection} />
      <PersonalityResultCard section={thinking} />
    </div>
  );
}
