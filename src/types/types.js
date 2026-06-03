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