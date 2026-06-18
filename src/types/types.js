// =============================================================
// 쉬는시간 - 도메인 타입 정의 (ERD 기준)
// -------------------------------------------------------------
// - JS 프로젝트라 타입 강제는 안 되지만, JSDoc으로 힌트 제공
// - ERD 기준: snake_case → camelCase 로 변환해서 사용
//   (Spring Boot + Jackson 기본값이 camelCase. 백엔드 응답이
//    실제로 snake_case로 오면 변환 헬퍼 추가 예정)
// - 백엔드 API 붙기 전까지 더미 데이터도 이 구조를 따른다
// =============================================================


// =============================================================
// Enum 상수 (백엔드가 string으로 내려주는 값과 매칭)
// =============================================================

/** 회원 성별 */
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

/** 회원 상태 (※ ERD 원문 그대로 - WITHDRAWL은 오타지만 백엔드 기준) */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  WITHDRAWL: 'WITHDRAWL',
};

/** 소셜 로그인 플랫폼 (MVP는 APPLE 제외) */
export const AUTH_PROVIDER = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER',
  APPLE: 'APPLE',
};

/** 일정 카테고리 */
export const SCHEDULE_CATEGORY = {
  MEAL: 'MEAL',
  STUDY: 'STUDY',
  EXERCISE: 'EXERCISE',
  CULTURAL: 'CULTURAL',
  ETC: 'ETC',
};


/** 일정 카테고리 표시용 한글 라벨 */
export const SCHEDULE_CATEGORY_LABEL = {
  MEAL: '식사',
  STUDY: '스터디',
  EXERCISE: '스포츠',
  CULTURAL: '문화활동',
  ETC: '기타',
};

/**
 * 성향 테스트 - 연결 태도 (connection)
 * 외부 test.html에서 복귀 URL ?connection= 으로 전달받는 코드.
 * @see 02_성향테스트 명세
 */
export const PERSONALITY_CONNECTION = {
  BM: 'BM',
  BG: 'BG',
  JM: 'JM',
  GT: 'GT',
  DS: 'DS',
  GJ: 'GJ',
};

// TODO(기획/외부 확인): 코드별 한글 유형명 미수령 — 받으면 값만 채울 것
// 코드별 한글 유형명 (용어사전 '필드명' 시트, 승우님 6/7)
export const PERSONALITY_CONNECTION_LABEL = {
  BM: '시간경계형',
  BG: '가치중심형',
  JM: '자연접근형',
  GT: '관계탐색형',
  DS: '행동동행형',
  GJ: '속도조율형',
};

/**
 * 성향 테스트 - 사고 방식 (think)
 * 외부 test.html에서 복귀 URL ?think= 으로 전달받는 코드.
 * @see 02_성향테스트 명세
 */
export const PERSONALITY_THINK = {
  ESSENCE: 'ESSENCE',
  CONDITION: 'CONDITION',
  DEFINITION: 'DEFINITION',
  INTUITION: 'INTUITION',
  RESPONSIBILITY: 'RESPONSIBILITY',
  EVALUATION: 'EVALUATION',
};

// 코드별 한글 유형명 (용어사전 '필드명' 시트, 승우님 6/7)
export const PERSONALITY_THINK_LABEL = {
  ESSENCE: '본질',
  CONDITION: '조건',
  DEFINITION: '정의',
  INTUITION: '직관',
  RESPONSIBILITY: '책임',
  EVALUATION: '평가',
};

// connection 코드별 설명 문단
export const PERSONALITY_CONNECTION_DESC = {
  BM: '타인과의 거리보다 자신의 시간 자원과 에너지를 지키는 데 더 민감한 사람이다. 갑작스러운 요청, 예고 없는 개입, 즉흥적인 친밀감에 쉽게 피로를 느낀다. 시간의 경계가 존중되고 주고받는 방식이 안정적이면 오래 편안하게 관계를 유지한다.',
  BG: '관계를 감정의 친밀감만으로 보지 않고, 그 만남이 주는 정보와 기회, 배움과 성장의 가능성까지 함께 보는 사람이다. 목적이 불분명한 관계에는 쉽게 반응하지 않지만, 납득할 수 있는 가치가 보이면 빠르게 움직인다.',
  JM: '억지로 가까워지기보다, 자연스럽고 편안한 분위기 속에서 서서히 연결되는 것을 선호한다. 관계도 급하게 오르기보다 흐름에 따라 천천히 가까워질 때 가장 편안함을 느낀다.',
  GT: '인간관계를 끝이 없는 퍼즐게임처럼 바라보는 사람이다. 누구를 아는지가 아니라, 그 만남이 어떤 새로운 조합과 가능성을 만들어내는지가 더 중요하다.',
  DS: '말보다 함께 하는 경험에서 관계가 만들어진다고 느끼는 사람이다. 걷기, 먹기, 배우기, 체험하기처럼 실제로 같이 움직이는 과정 속에서 친밀감이 자연스럽게 자란다.',
  GJ: '쉽게 가까워지지 않는 것처럼 보일 수 있지만, 본질은 관계를 가볍게 보지 않기 때문에 속도를 신중히 조절하는 데 있다. 한번 신뢰가 형성되면 관계는 얕지 않고 오래 지속된다.',
};




/** 일정 상태 */
export const SCHEDULE_STATUS = {
  PENDING: 'PENDING',         // 모집중
  IN_PROGRESS: 'IN_PROGRESS', // 진행중 (약속시간 시작)
  COMPLETED: 'COMPLETED',     // 완료
  CANCELED: 'CANCELED',       // 취소
};

/** 일정 상태 표시용 한글 라벨 */
export const SCHEDULE_STATUS_LABEL = {
  PENDING: '모집중',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELED: '취소됨',
};

/** 일정 성별 조건 */
export const GENDER_CONDITION = {
  MALE_ONLY: 'MALE_ONLY',
  FEMALE_ONLY: 'FEMALE_ONLY',
  ANY: 'ANY',
};

// think 코드별 별칭 (제목용)
export const PERSONALITY_THINK_ALIAS = {
  ESSENCE: '관조하는 지성',
  CONDITION: '의미를 짓는 자',
  DEFINITION: '기록하는 예술가',
  INTUITION: '감정의 깊이를 탐색하는 자',
  RESPONSIBILITY: '고독을 감당하는 자',
  EVALUATION: '경험의 질을 평가하는 자',
};


// think 코드별 설명 문단
export const PERSONALITY_THINK_DESC = {
  ESSENCE: '세상을 파편이 아니라 하나의 풍경으로 봅니다. 남들이 놓치는 상태와 흐름을 감지하는 안테나가 강합니다. 보이지 않는 것을 보고, 서두르지 않고 관찰한 뒤 움직인다.',
  CONDITION: '흩어진 현상들에 자기만의 논리적 뼈대를 세워 의미를 만듭니다. 모든 자극을 해석하고 구조화하려는 힘이 강합니다. 이유 없는 연결보다, 설명 가능한 연결을 더 신뢰한다.',
  DEFINITION: '찰나의 경험이 휘발되지 않도록 글, 사진, 메모로 남깁니다. 지금의 밀도를 저장하고 아카이빙하는 성향이 강합니다. 관계를 빨리 정의하기보다, 천천히 기록하며 감도를 키운다.',
  INTUITION: '인간관계의 내면, 감정의 흐름, 진정성의 깊이를 탐구합니다. 표면적인 접촉보다 속 깊은 확인을 원합니다. 내면을 통해 진정성을 느끼고, 그 느낌을 바탕으로 결정한다.',
  RESPONSIBILITY: '자신의 고통을 쉽게 말하지 않고, 가까운 사람을 나쁜 사람으로 만들지 않기 위해 혼자 견디는 사람입니다. 자리에 없는 제3자의 입장까지 고려하며 감정을 쉽게 털어내지 못합니다. 고통을 비교나 하소연으로 풀지 않고, 혼자 견디며 감당하는 사람.',
  EVALUATION: '관계가 만들어내는 경험을 하나의 결과로 봅니다. 성장이 될지, 소모가 될지, 내가 타인에게 어떤 영향을 미쳤는지 따져보는 타입입니다. 관계의 결과를 되짚어보고, 그 경험이 내·타인에게 어떤 영향을 줬는지 평가한다.',
};

/** 참여자 역할 */
export const PARTICIPANT_ROLE = {
  CREATOR: 'CREATOR',
  PARTICIPANT: 'PARTICIPANT',
};

/** 참여자 상태 */
export const PARTICIPANT_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELED: 'CANCELED',
};

/** 멤버 이동 현황 */
export const MOVE_STATUS = {
  MOVING: 'MOVING',     // 이동중
  LATE: 'LATE',         // 지각 예정
  WAITING: 'WAITING',   // 목적지 대기중
  ARRIVED: 'ARRIVED',   // 도착
  ABSENT: 'ABSENT',     // 불참 양해
};

/** 멤버 이동 현황 표시용 한글 라벨 */
export const MOVE_STATUS_LABEL = {
  MOVING: '이동중',
  LATE: '지각 예정',
  WAITING: '목적지 대기중',
  ARRIVED: '도착',
  ABSENT: '불참 양해',
};

/** 요일 (operations.dayOfWeek) — 백엔드 풀네임 기준 (장소 상세 명세) */
export const DAY_OF_WEEK = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

/** 요일 표시용 한글 라벨 */
export const DAY_OF_WEEK_LABEL = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

/** QR 인증 상태 (attendances) */
export const ATTENDANCE_STATUS = {
  PENDING: 'PENDING',   // 미인증
  ATTENDED: 'ATTENDED', // 인증 완료
};


// =============================================================
// 엔티티 (ERD 테이블 1:1 매핑)
// =============================================================

/**
 * 회원
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email - 소셜 로그인에서 수신 (수정 가능)
 * @property {keyof typeof GENDER} gender
 * @property {keyof typeof USER_STATUS} status
 * @property {string|null} withdrawalDate - ISO datetime (ERD: withdrawl_date)
 */

/**
 * 회원 프로필
 * @typedef {Object} UserProfile
 * @property {number} id
 * @property {number} userId
 * @property {string} birthDate - YYYY-MM-DD (ERD는 DATETIME이지만 DATE 권장)
 * @property {string|null} profileImageUrl
 * @property {string|null} mbti - ex) 'INFP'
 * @property {string|null} introduction - 자기소개
 * @property {string|null} activity - ERD의 'Field' (활동) - 의미 확인 필요
 */

/**
 * 회원 인증 정보 (소셜 로그인)
 * @typedef {Object} UserAuth
 * @property {number} id
 * @property {number} userId
 * @property {keyof typeof AUTH_PROVIDER} provider
 * @property {string} providerId
 * @property {string} email
 */

/**
 * 장소 — 목록/상세 공통 (백엔드 명세 5/21)
 * - GET /api/v1/places (목록) 의 각 항목
 * - GET /api/v1/places/{id} (상세) 응답의 place 필드
 * @typedef {Object} Place
 * @property {number} id
 * @property {string} category - 카테고리명 문자열. ex) '음식점', '카페'
 * @property {string} name
 * @property {string} address
 * @property {string|null} contact - 연락처
 * @property {string|null} snsLink
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * 클라이언트 계산값 (백엔드 미제공):
 * @property {boolean} [isOpenNow] - operations 기반으로 클라이언트가 계산
 */

/**
 * 장소 이미지 (장소 상세의 images 배열)
 * @typedef {Object} PlaceImage
 * @property {number} id
 * @property {string} imageUrl
 * @property {boolean} isMain - 대표 이미지 여부
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * 영업시간 (장소 상세의 operations 배열, 요일별 1개씩 총 7개)
 * @typedef {Object} PlaceOperation
 * @property {number} id
 * @property {keyof typeof DAY_OF_WEEK} dayOfWeek
 * @property {string|null} openingTime - "HH:mm". null이면 휴무
 * @property {string|null} closingTime - "HH:mm". null이면 휴무
 * @property {string|null} breakTimeStart - "HH:mm" or null
 * @property {string|null} breakTimeEnd - "HH:mm" or null
 * @property {string|null} lastOrder - "HH:mm" or null
 */

/**
 * 장소 상세 응답 (GET /api/v1/places/{id})
 * @typedef {Object} PlaceDetail
 * @property {Place} place
 * @property {PlaceImage[]} images
 * @property {PlaceOperation[]} operations - 요일별 7개
 */

/**
 * 일정 (모임) - 백엔드 응답 형식 (5/23 확정)
 * @typedef {Object} Schedule
 * @property {number} id
 * @property {number} creatorId - 일정 생성자의 유저 id
 * @property {{id: number, name: string, address: string}} place - 장소 요약 (nested)
 * @property {string} title
 * @property {string} description
 * @property {keyof typeof SCHEDULE_CATEGORY} category
 * @property {string} scheduledAt - "yyyy-MM-dd HH:mm"
 * @property {number} maxParticipants
 * @property {number} currentParticipants
 * @property {keyof typeof GENDER_CONDITION} genderCondition
 * @property {keyof typeof SCHEDULE_STATUS} status
 * @property {string|null} canceledAt - status==CANCELED인 경우
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * 클라이언트 보조 필드 (mockDb / 진입 경로 결정):
 * @property {keyof typeof PARTICIPANT_ROLE} [myRole] - 현재 사용자 입장에서의 역할
 * @property {Participant[]} [participants] - 별도 API로 조회
 */

/**
 * 참여자
 * @typedef {Object} Participant
 * @property {number} id
 * @property {number} scheduleId
 * @property {number} userId
 * @property {keyof typeof PARTICIPANT_ROLE} role
 * @property {keyof typeof PARTICIPANT_STATUS} status
 * @property {string|null} canceledAt
 *
 * 조인되어 응답에 포함될 가능성 있는 필드:
 * @property {User} [user]
 * @property {UserProfile} [profile]
 */

/**
 * 현황 공유 (이동 소식)
 * - ERD: 테이블명 미지정 ('Untitled')
 * - 임시 명명: scheduleStatusShare
 * @typedef {Object} ScheduleStatusShare
 * @property {number} id
 * @property {number} scheduleId
 * @property {number} participantId
 * @property {keyof typeof MOVE_STATUS} moveStatus
 * @property {string|null} statusText - 부가 설명
 * @property {number|null} distance - 목적지까지 남은 거리 (m 단위 추정)
 */

/**
 * QR 매칭 인증 (attendances) - 백엔드 명세 5/30
 * - POST /api/v1/schedules/{id}/attendances (토큰 인증) → 단일 Attendance
 * - GET  /api/v1/schedules/{id}/attendances (상태 조회) → Attendance[]
 *
 * @typedef {Object} Attendance
 * @property {number} id
 * @property {number} scheduleId
 * @property {number} participantId
 * @property {number} userId
 * @property {keyof typeof ATTENDANCE_STATUS} status
 * @property {string|null} attendedAt - 인증 시각(ISO). PENDING이면 null
 * @property {string} createdAt
 * @property {string} updatedAt
 */


// =============================================================
// 공통 필드 (base_time_entity)
// =============================================================
// 모든 엔티티는 createdAt, updatedAt을 가질 수 있다.
// 필요 시 각 typedef에 다음을 추가:
//   @property {string} createdAt
//   @property {string} updatedAt