// 웹은 JS라 TypeScript처럼 타입 강제는 안 되지만, JSDoc으로 타입 힌트 가능

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} gender
 * @property {string} mbti
 * @property {string} introduction
 */

/**
 * @typedef {Object} Place
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string} address
 * @property {string} [phone]
 * @property {number} latitude
 * @property {number} longitude
 * @property {boolean} isOpen
 */

/**
 * @typedef {Object} Schedule
 * @property {number} id
 * @property {string} title
 * @property {string} date
 * @property {string} time
 * @property {string} category
 * @property {number} maxParticipants
 * @property {number} currentParticipants
 * @property {string} status
 */

export const SCHEDULE_STATUS = {
    WAITING: 'waiting',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  };
  
  export const SCHEDULE_CATEGORY = {
    FOOD: '식사',
    STUDY: '스터디',
    CULTURE: '문화활동',
    SPORTS: '스포츠',
    ETC: '기타',
  };
  
  export const GENDER_LIMIT = {
    MALE_ONLY: 'male_only',
    FEMALE_ONLY: 'female_only',
    ANY: 'any',
  };