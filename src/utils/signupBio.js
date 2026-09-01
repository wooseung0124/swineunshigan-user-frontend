const BIO_MAX_LENGTH = 200;

/** @type {Record<string, string>} */
const CONNECTION_BIO_LINES = {
  자연접근형: '편안함이 생기면 천천히 가까워지는 사람입니다.',
  관계탐색형: '사람과 사람 사이의 지도를 직접 그려 나가는 편입니다.',
  가치중심형: '납득이 되면 바로 움직이는 실용적인 편입니다.',
  속도조율형: '관계를 소중히 여겨 천천히 마음을 여는 사람입니다.',
  시간경계형: '경계가 지켜질 때 가장 자연스럽게 연결되는 사람입니다.',
  행동동행형: '같이 할 일이 있어야 마음이 붙는 경험 중심형입니다.',
};

/** @type {Record<string, string>} */
const THINKING_BIO_LINES = {
  '기록하는 예술가': '관계를 빨리 정의하기보다, 천천히 기록하며 감도를 키웁니다.',
  '의미를 짓는 자': '이유 없는 연결보다, 설명 가능한 연결을 더 신뢰합니다.',
  '감정의 깊이를 탐색하는 자':
    '내면을 통해 진정성을 느끼고, 그 느낌을 바탕으로 결정합니다.',
  '경험의 질을 평가하는 자':
    '관계의 결과를 되짚어보고, 그 경험이 타인에게 어떤 영향을 줬는지 평가합니다.',
  '고독을 감당하는 자':
    '고통을 비교나 하소연으로 풀지 않고, 혼자 견디며 감당하는 사람입니다.',
  '관조하는 지성': '보이지 않는 것을 보고, 서두르지 않고 관찰한 뒤 움직입니다.',
};

/**
 * @param {string} sentence
 * @returns {string}
 */
export function formalizeSentence(sentence) {
  const trimmed = sentence.replace(/[.。？?…]+$/, '').trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed.endsWith('습니다') || trimmed.endsWith('입니다')) {
    return `${trimmed}.`;
  }

  if (trimmed.endsWith('한다')) {
    return `${trimmed.slice(0, -2)}합니다.`;
  }

  if (trimmed.endsWith('운다')) {
    return `${trimmed.slice(0, -2)}웁니다.`;
  }

  if (trimmed.endsWith('인다')) {
    return `${trimmed.slice(0, -2)}입니다.`;
  }

  if (trimmed.endsWith('는다')) {
    return `${trimmed.slice(0, -2)}습니다.`;
  }

  if (trimmed.endsWith('간다')) {
    return `${trimmed.slice(0, -2)}갑니다.`;
  }

  if (trimmed.endsWith('닌다')) {
    return `${trimmed.slice(0, -2)}납니다.`;
  }

  if (trimmed.endsWith('다')) {
    return `${trimmed.slice(0, -1)}습니다.`;
  }

  return `${trimmed}입니다.`;
}

/**
 * @param {string} title
 * @param {string} summary
 * @param {Record<string, string>} presetLines
 * @returns {string}
 */
function resolveBioLine(title, summary, presetLines) {
  if (presetLines[title]) {
    return presetLines[title];
  }

  return formalizeSentence(summary);
}

/**
 * @param {string} bio
 * @param {number} maxLength
 * @returns {string}
 */
function truncateBio(bio, maxLength) {
  if (bio.length <= maxLength) {
    return bio;
  }

  const truncated = bio.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');

  if (lastPeriod > 0) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated;
}

/**
 * 성향 카드 summary를 바탕으로 추천 자기소개를 생성합니다.
 * @param {{ connection: { title: string, summary: string }, thinking: { title: string, summary: string } }|null} personalityResult
 * @returns {string}
 */
export function buildRecommendedBio(personalityResult) {
  if (!personalityResult) {
    return '';
  }

  const { connection, thinking } = personalityResult;

  const bio = [
    resolveBioLine(connection.title, connection.summary, CONNECTION_BIO_LINES),
    resolveBioLine(thinking.title, thinking.summary, THINKING_BIO_LINES),
  ]
    .filter(Boolean)
    .join(' ');

  return truncateBio(bio, BIO_MAX_LENGTH);
}

export { BIO_MAX_LENGTH };
