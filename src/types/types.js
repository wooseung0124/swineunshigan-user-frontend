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
  EXERCISE: '운동',
  CULTURAL: '문화활동',
  ETC: '기타',
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

/** 요일 (opening_hours.day_of_week) */
export const DAY_OF_WEEK = {
  MON: 'MON',
  TUE: 'TUE',
  WED: 'WED',
  THU: 'THU',
  FRI: 'FRI',
  SAT: 'SAT',
  SUN: 'SUN',
};


// =============================================================
// 엔티티 (ERD 테이블 1:1 매핑)
// =============================================================

/**
 * 회원
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
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
 * 장소 카테고리
 * @typedef {Object} PlaceCategory
 * @property {number} id
 * @property {string} name - ex) '카페', '음식점', '문화시설', '레포츠'
 */

/**
 * 장소
 * @typedef {Object} Place
 * @property {number} id
 * @property {number} categoryId
 * @property {string} name
 * @property {string} address
 * @property {string|null} snsLink
 * @property {string|null} contact - 연락처
 * @property {number} latitude
 * @property {number} longitude
 *
 * 조인되어 응답에 포함될 가능성 있는 필드:
 * @property {PlaceCategory} [category]
 * @property {OpeningHours[]} [openingHours]
 * @property {PlaceImage[]} [images]
 * @property {boolean} [isOpenNow] - 클라이언트 계산 or 백엔드 계산값
 */

/**
 * 장소 이미지
 * @typedef {Object} PlaceImage
 * @property {number} id
 * @property {number} placeId
 * @property {string} imageUrl
 * @property {boolean} isMain
 */

/**
 * 영업 시간
 * @typedef {Object} OpeningHours
 * @property {number} id
 * @property {number} placeId
 * @property {keyof typeof DAY_OF_WEEK} dayOfWeek
 * @property {string} openingTime - HH:mm (ERD는 DATETIME이지만 TIME 권장)
 * @property {string} closingTime - HH:mm
 * @property {boolean} isOpened
 */

/**
 * 일정 (모임)
 * @typedef {Object} Schedule
 * @property {number} id
 * @property {number} placeId
 * @property {string} title
 * @property {string} description
 * @property {keyof typeof SCHEDULE_CATEGORY} category
 * @property {string} dateTime - ISO datetime
 * @property {keyof typeof GENDER_CONDITION} genderCondition
 * @property {number} maxParticipants
 * @property {keyof typeof SCHEDULE_STATUS} status
 * @property {string|null} canceledAt
 *
 * 조인되어 응답에 포함될 가능성 있는 필드:
 * @property {Place} [place]
 * @property {Participant[]} [participants]
 * @property {number} [currentParticipants] - 계산값
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
 * 매칭 인증 기록 (QR 인증)
 * - ERD: 테이블명 미지정 ('Untitled7'), 컬럼 id만 존재
 * - ※ 백엔드 분과 합의 필요. 아래는 프론트 추정 스키마.
 *
 * @typedef {Object} MatchVerification
 * @property {number} id
 * @property {number} scheduleId
 * @property {number} verifierId       - 인증한 사람 (보통 개설자)
 * @property {number} verifiedUserId   - 인증된 사람 (참여자)
 * @property {string} verifiedAt       - 인증 시각 (ISO datetime)
 */

/**
 * QR 코드 페이로드 (참여자 화면에 표시되는 데이터)
 * - 개설자가 스캔하면 이 JSON이 디코딩됨
 * - 백엔드에서는 이 페이로드를 받아 검증 후 MatchVerification 생성
 *
 * @typedef {Object} QRPayload
 * @property {number} scheduleId
 * @property {number} userId           - QR을 발급한 사람 (참여자)
 * @property {number} issuedAt         - QR 발급 시각 (Unix ms) - 만료 검증용
 * @property {string} nonce            - 일회용 토큰 (재사용 방지)
 */


// =============================================================
// 공통 필드 (base_time_entity)
// =============================================================
// 모든 엔티티는 createdAt, updatedAt을 가질 수 있다.
// 필요 시 각 typedef에 다음을 추가:
//   @property {string} createdAt
//   @property {string} updatedAt
