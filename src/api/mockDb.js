// =============================================================
// Mock DB - localStorage 기반 가짜 데이터베이스
// -------------------------------------------------------------
// - VITE_USE_MOCK_AUTH=true 일 때 api.* 함수들이 이걸 사용
// - 백엔드 미연동 상태에서 CRUD 동작을 흉내내 풀 플로우 테스트 가능
// - 새로고침해도 데이터 유지 (localStorage)
// - 백엔드 붙으면 환경변수 false로 → 자동으로 진짜 API 호출로 전환
// -------------------------------------------------------------
// 디버그: 콘솔에서 `localStorage.removeItem('mock-db')` 또는
//        `import('./api/mockDb').then(m => m.mockDb.reset())` 으로 초기화
// =============================================================

const STORAGE_KEY = 'mock-db';

// -------------------------------------------------------------
// Seed 데이터 생성 (모듈 첫 로드 시점 기준 상대 시간)
// -------------------------------------------------------------
// 매칭 인증 활성화(2h 전) 테스트가 가능하도록 dateTime을 동적으로 생성.
// 처음 한 번만 localStorage에 저장되고 이후엔 그 값 그대로 사용.
function generateSeed() {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const iso = (offset) => new Date(now + offset).toISOString();

  return {
    schedules: [
      {
        id: 1,
        placeId: 1,
        title: '성수동 스터디 모임',
        description: '각자 공부할 자료를 가져와서 조용히 작업하는 모임입니다. 중간에 짧은 휴식 시간도 있어요.',
        category: 'STUDY',
        dateTime: iso(1 * HOUR), // 1시간 후 → 매칭 인증 활성
        genderCondition: 'ANY',
        maxParticipants: 4,
        status: 'PENDING',
        canceledAt: null,
        place: {
          id: 1, categoryId: 1,
          name: '맞스터치 성수역점',
          address: '서울 성동구 성수동2가 289-10',
          snsLink: null, contact: '02-1234-5678',
          latitude: 37.5445, longitude: 127.0560,
          category: { id: 1, name: '음식점' },
          images: [],
        },
        participants: [
          {
            id: 1, scheduleId: 1, userId: 101,
            role: 'CREATOR', status: 'ACTIVE', canceledAt: null,
            user: { id: 101, name: '김진우', gender: 'MALE', status: 'ACTIVE' },
            profile: { mbti: 'INFP', introduction: '', profileImageUrl: null },
          },
          {
            id: 2, scheduleId: 1, userId: 102,
            role: 'PARTICIPANT', status: 'ACTIVE', canceledAt: null,
            user: { id: 102, name: '이수민', gender: 'FEMALE', status: 'ACTIVE' },
            profile: { mbti: 'ENFJ', introduction: '', profileImageUrl: null },
          },
        ],
        currentParticipants: 2,
        myRole: 'CREATOR',
      },
      {
        id: 2,
        placeId: 2,
        title: '점심 같이 먹어요',
        description: '간단히 점심 같이 하실 분 모집합니다.',
        category: 'MEAL',
        dateTime: iso(1.5 * HOUR), // 1.5시간 후 → 매칭 인증 활성 (PARTICIPANT QR 테스트용)
        genderCondition: 'ANY',
        maxParticipants: 3,
        status: 'PENDING',
        canceledAt: null,
        place: {
          id: 2, categoryId: 2,
          name: '서울숲 카페',
          address: '서울 성동구 서울숲길 17',
          snsLink: null, contact: '02-9876-5432',
          latitude: 37.5465, longitude: 127.0580,
          category: { id: 2, name: '카페' },
          images: [],
        },
        participants: [
          {
            id: 3, scheduleId: 2, userId: 103,
            role: 'CREATOR', status: 'ACTIVE', canceledAt: null,
            user: { id: 103, name: '박지수', gender: 'FEMALE', status: 'ACTIVE' },
            profile: { mbti: 'ISFJ', introduction: '', profileImageUrl: null },
          },
          {
            id: 4, scheduleId: 2, userId: 104,
            role: 'PARTICIPANT', status: 'ACTIVE', canceledAt: null,
            user: { id: 104, name: '내목업', gender: 'MALE', status: 'ACTIVE' },
            profile: { mbti: 'ENTP', introduction: '', profileImageUrl: null },
          },
        ],
        currentParticipants: 2,
        myRole: 'PARTICIPANT',
      },
      {
        id: 3,
        placeId: 3,
        title: '독서 모임',
        description: '책 좋아하시는 분들과 함께해요.',
        category: 'CULTURAL',
        dateTime: iso(1 * DAY), // 내일 → 미활성
        genderCondition: 'ANY',
        maxParticipants: 4,
        status: 'PENDING',
        canceledAt: null,
        place: {
          id: 3, categoryId: 2,
          name: '성수 북카페',
          address: '서울 성동구 연무장길 15',
          snsLink: null, contact: null,
          latitude: 37.5430, longitude: 127.0540,
          category: { id: 2, name: '카페' },
          images: [],
        },
        participants: [],
        currentParticipants: 4,
        myRole: 'PARTICIPANT',
      },
      {
        id: 4,
        placeId: 1,
        title: '아침 스터디',
        description: '아침형 인간들의 스터디.',
        category: 'STUDY',
        dateTime: iso(-2 * DAY), // 2일 전 → 완료
        genderCondition: 'ANY',
        maxParticipants: 4,
        status: 'COMPLETED',
        canceledAt: null,
        place: {
          id: 1, categoryId: 1,
          name: '맞스터치 성수역점',
          address: '서울 성동구 성수동2가 289-10',
          snsLink: null, contact: '02-1234-5678',
          latitude: 37.5445, longitude: 127.0560,
          category: { id: 1, name: '음식점' },
          images: [],
        },
        participants: [],
        currentParticipants: 4,
        myRole: 'PARTICIPANT',
      },
      {
        id: 5,
        placeId: 5,
        title: '운동 같이 해요',
        description: '러닝 메이트 구합니다.',
        category: 'EXERCISE',
        dateTime: iso(-1 * DAY), // 1일 전 → 취소됨
        genderCondition: 'ANY',
        maxParticipants: 4,
        status: 'CANCELED',
        canceledAt: iso(-1.5 * DAY),
        place: {
          id: 5, categoryId: 4,
          name: '서울숲 공원',
          address: '서울 성동구 뚝섬로 273',
          snsLink: null, contact: null,
          latitude: 37.5440, longitude: 127.0590,
          category: { id: 4, name: '레포츠' },
          images: [],
        },
        participants: [],
        currentParticipants: 2,
        myRole: 'CREATOR',
      },
    ],
    statusShares: [],   // 단계 2(이동 소식)에서 사용
    verifications: [],  // 단계 3(QR 인증)에서 사용
  };
}

// -------------------------------------------------------------
// 내부 헬퍼
// -------------------------------------------------------------
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* corrupted, reseed below */ }
  }
  const seed = generateSeed();
  save(seed);
  return seed;
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 모든 mock 메소드는 Promise를 반환 (실제 fetch와 동일한 인터페이스 유지)
const ok = (data) => Promise.resolve(data);
const fail = (msg) => Promise.reject(new Error(msg));

// -------------------------------------------------------------
// Public API
// -------------------------------------------------------------
export const mockDb = {
  schedules: {
    /** 전체 일정 목록 */
    list: () => ok(load().schedules),

    /** ID로 일정 상세 조회 */
    detail: (id) => {
      const found = load().schedules.find(s => s.id === Number(id));
      return found ? ok(found) : fail(`Schedule not found: ${id}`);
    },

    /** 일정 부분 갱신 */
    update: (id, patch) => {
      const db = load();
      const idx = db.schedules.findIndex(s => s.id === Number(id));
      if (idx === -1) return fail(`Schedule not found: ${id}`);
      db.schedules[idx] = { ...db.schedules[idx], ...patch };
      save(db);
      return ok(db.schedules[idx]);
    },

    /** 일정 취소 (status → CANCELED) */
    cancel: (id, reason) => {
      const db = load();
      const idx = db.schedules.findIndex(s => s.id === Number(id));
      if (idx === -1) return fail(`Schedule not found: ${id}`);
      db.schedules[idx] = {
        ...db.schedules[idx],
        status: 'CANCELED',
        canceledAt: new Date().toISOString(),
        cancelReason: reason || null,
      };
      save(db);
      return ok(db.schedules[idx]);
    },

    /** 특정 일정의 인증 기록 조회 */
    verifications: (scheduleId) => {
      const db = load();
      return ok(db.verifications.filter(v => v.scheduleId === Number(scheduleId)));
    },

    /**
     * QR 인증 처리 (개설자가 참여자 QR을 스캔했을 때).
     * - payload: { scheduleId, userId, issuedAt, nonce }
     * - 검증 순서: scheduleId 일치 / 참여자 존재 / 5분 이내 / 중복 인증 방지
     */
    verifyQR: (scheduleId, qrPayload) => {
      const db = load();
      const schedule = db.schedules.find(s => s.id === Number(scheduleId));
      if (!schedule) return fail('일정을 찾을 수 없습니다.');

      if (qrPayload?.scheduleId !== schedule.id) {
        return fail('이 일정의 QR이 아닙니다.');
      }

      const participant = schedule.participants?.find(p => p.userId === qrPayload.userId);
      if (!participant) return fail('이 일정의 참여자가 아닙니다.');

      // QR 만료 (5분)
      const QR_TTL_MS = 5 * 60 * 1000;
      if (!qrPayload.issuedAt || Date.now() - qrPayload.issuedAt > QR_TTL_MS) {
        return fail('만료된 QR입니다. 새로 발급받아주세요.');
      }

      // 중복 인증 방지
      const already = db.verifications.find(v =>
        v.scheduleId === schedule.id && v.verifiedUserId === participant.userId
      );
      if (already) return fail('이미 인증된 참여자입니다.');

      const creator = schedule.participants.find(p => p.role === 'CREATOR');
      const newId = db.verifications.length > 0
        ? Math.max(...db.verifications.map(v => v.id)) + 1
        : 1;
      const verification = {
        id: newId,
        scheduleId: schedule.id,
        verifierId: creator?.userId ?? null,
        verifiedUserId: participant.userId,
        verifiedAt: new Date().toISOString(),
      };
      db.verifications.push(verification);
      save(db);

      return ok({ verification, participant });
    },
  },

  /** 디버그: seed 데이터로 초기화 */
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    return load();
  },
};
