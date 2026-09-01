/** @typedef {{ title: string, summary: string, tags?: string[], description: string }} PersonalityProfile */

/** @type {PersonalityProfile[]} */
export const CONNECTION_TYPES = [
  {
    title: '자연접근형',
    summary: '편안함이 생기면 천천히 가까워지는 사람',
    tags: ['소프트 연결형', '편안함', '낮은 압박', '자연스러움', '느슨함'],
    description:
      '억지로 가까워지기보다, 자연스럽고 편안한 분위기 속에서 서서히 연결되는 것을 선호한다. 관계도 급하게 오르기보다 흐름에 따라 천천히 가까워질 때 가장 편안함을 느낀다.',
  },
  {
    title: '관계탐색형',
    summary: '사람과 사람 사이의 지도를 직접 그려 나가는 확장형',
    tags: ['관계 확장형', '주도 탐험형', '사람 중심', '네트워크', '연결성'],
    description:
      '인간관계를 끝이 없는 퍼즐게임처럼 바라보는 사람이다. 누구를 아는지 아니라, 그 만남이 어떤 새로운 조합과 가능성을 만들어내는지 더 중요하다.',
  },
  {
    title: '가치중심형',
    summary: '납득이 되면 바로 움직이는 실용형 연결러',
    tags: ['목적형 연결러', '효율', '정보', '가치', '시간 낭비 회피'],
    description:
      '관계를 감정의 친밀감만으로 보지 않고, 그 만남이 주는 정보와 기회, 배움과 성장의 가능성까지 함께 보는 사람이다. 목적이 불분명한 관계에는 쉽게 반응하지 않지만, 납득할 수 있는 가치가 보이면 빠르게 움직인다.',
  },
  {
    title: '속도조율형',
    summary: '마음이 없어서가 아니라, 관계를 소중히 여겨 천천히 여는 사람',
    tags: ['신중 연결형', '조심스러운 애착', '보호', '속도 조절'],
    description:
      '쉽게 가까워지지 않는 것처럼 보일 수 있지만, 본질은 관계를 가볍게 보지 않기 때문에 속도를 신중히 조절하는 데 있다. 한 번 신뢰가 형성되면 관계는 얕지 않고 오래 지속된다.',
  },
  {
    title: '시간경계형',
    summary: '경계가 지켜질 때 가장 자연스럽게 연결되는 사람',
    tags: ['선택적 연결', '독립 안정형', '거리감', '신뢰', '리듬'],
    description:
      '타인과의 거리보다 자신의 시간 자원과 에너지를 지키는 데 더 민감한 사람이다. 갑작스러운 요청, 예고 없는 개입, 즉흥적인 친밀감에 쉽게 피로를 느낀다. 시간의 경계가 존중되고 주고받는 방식이 안정적이면 오래 편안하게 관계를 유지한다.',
  },
  {
    title: '행동동행형',
    summary: '같이 할 일이 있어야 마음이 붙는 경험형 연결러',
    tags: ['경험 동기형', '활동 중심형', '체험', '같이 하기', '행위 우선'],
    description:
      '말보다 함께 하는 경험에서 관계가 만들어진다고 느끼는 사람이다. 걷기, 먹기, 배우기, 체험하기처럼 실제로 같이 움직이는 과정 속에서 친밀감이 자연스럽게 자란다.',
  },
];

/** @type {PersonalityProfile[]} */
export const THINKING_TYPES = [
  {
    title: '기록하는 예술가',
    summary: '관계를 빨리 정의하기보다, 천천히 기록하며 감도를 키운다',
    description:
      '찰나의 경험이 휘발되지 않도록 글, 사진, 메모로 남깁니다. 지금의 밀도를 저장하고 아카이빙하는 성향이 강합니다.',
  },
  {
    title: '의미를 짓는 자',
    summary: '이유 없는 연결보다, 설명 가능한 연결을 더 신뢰한다',
    description:
      '흩어진 현상들에 자기만의 논리적 뼈대를 세워 의미를 만듭니다. 모든 자극을 해석하고 구조화하려는 힘이 강합니다.',
  },
  {
    title: '감정의 깊이를 탐색하는 자',
    summary: '내면을 통해 진정성을 느끼고, 그 느낌을 바탕으로 결정한다',
    description:
      '인간관계의 내면, 감정의 흐름, 진정성의 깊이를 탐구합니다. 표면적인 접촉보다 속 깊은 확인을 원합니다.',
  },
  {
    title: '경험의 질을 평가하는 자',
    summary: '관계의 결과를 되짚어보고, 그 경험이 내가 타인에게 어떤 영향을 줬는지 평가한다',
    description:
      '관계가 만들어내는 경험을 하나의 결과로 봅니다. 성장이 될지, 소모가 될지, 내가 타인에게 어떤 영향을 미쳤는지 따져보는 타입입니다.',
  },
  {
    title: '고독을 감당하는 자',
    summary: '고통을 비교나 하소연으로 풀지 않고, 혼자 견디며 감당하는 사람',
    description:
      '자신의 고통을 쉽게 말하지 않고, 가까운 사람을 나쁜 사람으로 만들지 않기 위해 혼자 견디는 사람입니다. 자리에 없는 제 3자의 입장까지 고려하며 감정을 쉽게 털어내지 못합니다.',
  },
  {
    title: '관조하는 지성',
    summary: '보이지 않는 것을 보고, 서두르지 않고 관찰한 뒤 움직인다',
    description:
      '세상을 파편이 아니라 하나의 풍경으로 봅니다. 남들이 놓치는 상태와 흐름을 감지하는 안테나가 강합니다.',
  },
];

/**
 * @param {string[]} tags
 * @returns {{ formTags: string[], otherTags: string[] }}
 */
export function partitionTagsByFormSuffix(tags = []) {
  return {
    formTags: tags.filter((tag) => tag.endsWith('형')),
    otherTags: tags.filter((tag) => !tag.endsWith('형')),
  };
}

/**
 * @param {PersonalityProfile[]} items
 * @returns {PersonalityProfile}
 */
function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * 테스트마다 연결 방식(~형)과 사고 방식을 무작위로 조합합니다.
 * @returns {{ headline: string, connection: PersonalityProfile & { label: string }, thinking: PersonalityProfile & { label: string } }}
 */
export function pickRandomPersonalityResult() {
  const connection = pickRandomItem(CONNECTION_TYPES);
  const thinking = pickRandomItem(THINKING_TYPES);

  return {
    headline: `${connection.title} - ${thinking.title}`,
    connection: {
      label: '나의 연결 방식',
      ...connection,
    },
    thinking: {
      label: '나의 사고 방식',
      ...thinking,
    },
  };
}
