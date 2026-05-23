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
// 콘솔 로그 (mock 호출 추적용)
// -------------------------------------------------------------
function mockLog(fnName, args) {
  if (args === undefined) {
    console.log(`[MOCK API] ${fnName}() 호출`);
  } else {
    console.log(`[MOCK API] ${fnName}() 호출`, args);
  }
}

// -------------------------------------------------------------
// Seed 데이터 생성 (모듈 첫 로드 시점 기준 상대 시간)
// -------------------------------------------------------------
function generateSeed() {
  const now = Date.now();
  const MIN = 60 * 1000;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const iso = (offset) => new Date(now + offset).toISOString();
  // 백엔드 scheduledAt 형식: "yyyy-MM-dd HH:mm"
  const scheduledAtFmt = (offset) => {
    const d = new Date(now + offset);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // ----- Places (HomePage DUMMY_PLACES와 동일 구조) -----
  const places = [
    {
      id: 1,
      categoryId: 1,
      name: '맞스터치 성수역점',
      address: '서울 성동구 성수동2가 289-10',
      snsLink: null,
      contact: '02-1234-5678',
      latitude: 37.5445,
      longitude: 127.0560,
      category: { id: 1, name: '음식점' },
      images: [],
      openingHours: [],
      isOpenNow: true,
    },
    {
      id: 2,
      categoryId: 2,
      name: '서울숲 카페',
      address: '서울 성동구 서울숲길 17',
      snsLink: null,
      contact: '02-9876-5432',
      latitude: 37.5465,
      longitude: 127.0580,
      category: { id: 2, name: '카페' },
      images: [],
      openingHours: [],
      isOpenNow: true,
    },
    {
      id: 3,
      categoryId: 2,
      name: '성수 북카페',
      address: '서울 성동구 연무장길 15',
      snsLink: null,
      contact: null,
      latitude: 37.5430,
      longitude: 127.0540,
      category: { id: 2, name: '카페' },
      images: [],
      openingHours: [],
      isOpenNow: false,
    },
    {
      id: 4,
      categoryId: 3,
      name: '성수 미술관',
      address: '서울 성동구 성수일로 56',
      snsLink: null,
      contact: '02-3333-4444',
      latitude: 37.5455,
      longitude: 127.0570,
      category: { id: 3, name: '문화시설' },
      images: [],
      openingHours: [],
      isOpenNow: true,
    },
    {
      id: 5,
      categoryId: 4,
      name: '서울숲 공원',
      address: '서울 성동구 뚝섬로 273',
      snsLink: null,
      contact: null,
      latitude: 37.5440,
      longitude: 127.0590,
      category: { id: 4, name: '레포츠' },
      images: [],
      openingHours: [],
      isOpenNow: true,
    },
  ];

  // ----- Users (mock auth 3종 + 일정 참여자 4종) -----
  const users = [
    {
      id: 1001, name: '카카오목업', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1995-01-01', profileImageUrl: null, mbti: 'INFP', introduction: '카카오로 로그인한 테스트 사용자.', activity: '카페에서 책 읽기' },
    },
    {
      id: 1002, name: '네이버목업', gender: 'FEMALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1996-03-15', profileImageUrl: null, mbti: 'ENFP', introduction: '네이버로 로그인한 테스트 사용자.', activity: '서울숲 산책' },
    },
    {
      id: 1003, name: '구글목업', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1994-07-22', profileImageUrl: null, mbti: 'INTJ', introduction: '구글로 로그인한 테스트 사용자.', activity: '운동' },
    },
    {
      id: 101, name: '김진우', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1995-12-09', profileImageUrl: null, mbti: 'INFP', introduction: '음악과 책을 좋아하는 프론트엔드 개발자입니다.', activity: '카페에서 책 읽기' },
    },
    {
      id: 102, name: '이수민', gender: 'FEMALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1997-05-20', profileImageUrl: null, mbti: 'ENFJ', introduction: '사람 만나는 거 좋아해요.', activity: '카페 투어' },
    },
    {
      id: 103, name: '박지수', gender: 'FEMALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1998-09-03', profileImageUrl: null, mbti: 'ISFJ', introduction: '맛집 탐방을 좋아해요.', activity: '점심 메이트 찾기' },
    },
    {
      id: 104, name: '내목업', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1999-02-11', profileImageUrl: null, mbti: 'ENTP', introduction: '뭐든 일단 시도파.', activity: '신규 카페 탐방' },
    },
  ];

  // ----- Schedules (기존 동일) -----
  const schedules = [
    {
      id: 1,
      creatorId: 101,
      placeId: 1,
      title: '성수동 스터디 모임',
      description: '각자 공부할 자료를 가져와서 조용히 작업하는 모임입니다. 중간에 짧은 휴식 시간도 있어요.',
      category: 'STUDY',
      scheduledAt: scheduledAtFmt(1 * HOUR), // 1시간 후 → 매칭 인증 활성
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
      creatorId: 103,
      placeId: 2,
      title: '점심 같이 먹어요',
      description: '간단히 점심 같이 하실 분 모집합니다.',
      category: 'MEAL',
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
      creatorId: 102,
      placeId: 3,
      title: '독서 모임',
      description: '책 좋아하시는 분들과 함께해요.',
      category: 'CULTURAL',
      genderCondition: 'ANY',
      maxParticipants: 4,
      status: 'PENDING',
      scheduledAt: scheduledAtFmt(1 * DAY),
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
      creatorId: 103,
      placeId: 1,
      title: '아침 스터디',
      description: '아침형 인간들의 스터디.',
      category: 'STUDY',
      genderCondition: 'ANY',
      maxParticipants: 4,
      scheduledAt: scheduledAtFmt(-2 * DAY),
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
      creatorId: 101,
      placeId: 5,
      title: '운동 같이 해요',
      description: '러닝 메이트 구합니다.',
      category: 'EXERCISE',
      genderCondition: 'ANY',
      maxParticipants: 4,
      status: 'CANCELED',
      scheduledAt: scheduledAtFmt(-1 * DAY),
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
  ];

  // ----- Notifications (NotificationsPage DUMMY_NOTIFICATIONS 이관) -----
  // 'time' 문자열 ('5분 전' 등)은 createdAt(ISO)로 변환. UI에서 상대 시간 포맷.
  // userId=1001(카카오)에게 할당. 실제 mock 로그인된 사용자에 따라 list 필터링 적용.
  const notifications = [
    { id: 1, userId: 1001, type: 'schedule_cancelled', title: '일정이 취소되었습니다',     body: '맞스터치 성수역점 - 점심 같이 먹어요 일정이 취소되었습니다.',                       createdAt: iso(-5 * MIN),  isRead: false },
    { id: 2, userId: 1001, type: 'schedule_joined',    title: '새로운 참여자가 들어왔어요', body: "이수민님이 '성수동 스터디 모임'에 참여했습니다.",                                  createdAt: iso(-1 * HOUR), isRead: false },
    { id: 3, userId: 1001, type: 'schedule_reminder',  title: '약속 시간이 다가오고 있어요', body: '독서 모임 시작까지 1시간 남았습니다.',                                              createdAt: iso(-3 * HOUR), isRead: false },
    { id: 4, userId: 1001, type: 'schedule_completed', title: '일정이 완료되었습니다',     body: '서울숲 카페 - 카페 모임이 완료되었습니다.',                                          createdAt: iso(-1 * DAY),  isRead: true },
    { id: 5, userId: 1001, type: 'system',             title: '쉬는시간 서비스 안내',       body: '새로운 큐레이션 콘텐츠가 등록되었어요. 확인해보세요!',                                createdAt: iso(-3 * DAY),  isRead: true },
  ];

  // ----- Curations (CurationPage DUMMY_FEEDS 이관) -----
  // 'bookmarked' 플래그는 bookmarks 테이블로 분리 (정규화).
  const curations = [
    { id: 1, title: '성수동 분위기 좋은 카페 BEST 5',  summary: '요즘 성수에서 가장 핫한 카페들을 모아봤어요.',    category: '카페',     imageUrl: null, createdAt: '2026-04-28T10:00:00Z' },
    { id: 2, title: '서울숲 산책 코스 추천',           summary: '운동도 하고 자연도 즐기고. 추천 산책 코스 3가지.', category: '레포츠',   imageUrl: null, createdAt: '2026-04-25T10:00:00Z' },
    { id: 3, title: '성수에서 만나기 좋은 점심 맛집',   summary: '직장인부터 데이트까지, 점심 약속 잡기 좋은 맛집.',  category: '음식점',   imageUrl: null, createdAt: '2026-04-22T10:00:00Z' },
    { id: 4, title: '문화생활 즐기기 좋은 성수 갤러리', summary: '예술과 함께하는 시간. 매력적인 갤러리 4곳.',      category: '문화시설', imageUrl: null, createdAt: '2026-04-20T10:00:00Z' },
    { id: 5, title: '성수 핫플 - 인스타 감성 가득',     summary: '사진 찍기 좋은 성수의 인스타 핫플.',              category: '카페',     imageUrl: null, createdAt: '2026-04-18T10:00:00Z' },
  ];

  // ----- Bookmarks (정규화 - userId 1001이 큐레이션 1, 4 북마크) -----
  const bookmarks = [
    { id: 1, userId: 1001, curationId: 1, createdAt: iso(-2 * DAY) },
    { id: 2, userId: 1001, curationId: 4, createdAt: iso(-1 * DAY) },
  ];

  return {
    schedules,
    statusShares: [],   // 단계 2(이동 소식)에서 사용 예정
    verifications: [],  // 단계 3(QR 인증)에서 사용
    places,
    users,
    notifications,
    curations,
    bookmarks,
    withdrawalLogs: [],
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

// 다음 ID (자동 증가)
function nextId(rows) {
  return rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
}

const ok = (data) => Promise.resolve(data);
const fail = (msg) => Promise.reject(new Error(msg));

// -------------------------------------------------------------
// Public API
// -------------------------------------------------------------
export const mockDb = {
  // ===========================================================
  // schedules (기존)
  // ===========================================================
  schedules: {
    create: (data) => request('/api/schedules', { method: 'POST', body: JSON.stringify(data) }),
    list: () => {
      mockLog('schedules.list');
      return ok(load().schedules);
    },
    listByPlace: (placeId) => {
      mockLog('schedules.listByPlace', placeId);
      return ok(load().schedules.filter(s => s.placeId === placeId));
    },

    detail: (id) => {
      mockLog('schedules.detail', id);
      const found = load().schedules.find(s => s.id === Number(id));
      return found ? ok(found) : fail(`Schedule not found: ${id}`);
    },

    update: (id, patch) => {
      mockLog('schedules.update', { id, patch });
      const db = load();
      const idx = db.schedules.findIndex(s => s.id === Number(id));
      if (idx === -1) return fail(`Schedule not found: ${id}`);
      db.schedules[idx] = { ...db.schedules[idx], ...patch };
      save(db);
      return ok(db.schedules[idx]);
    },

    cancel: (id, reason) => {
      mockLog('schedules.cancel', { id, reason });
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

    verifications: (scheduleId) => {
      mockLog('schedules.verifications', scheduleId);
      const db = load();
      return ok(db.verifications.filter(v => v.scheduleId === Number(scheduleId)));
    },

    verifyQR: (scheduleId, qrPayload) => {
      mockLog('schedules.verifyQR', { scheduleId, qrPayload });
      const db = load();
      const schedule = db.schedules.find(s => s.id === Number(scheduleId));
      if (!schedule) return fail('일정을 찾을 수 없습니다.');

      if (qrPayload?.scheduleId !== schedule.id) {
        return fail('이 일정의 QR이 아닙니다.');
      }

      const participant = schedule.participants?.find(p => p.userId === qrPayload.userId);
      if (!participant) return fail('이 일정의 참여자가 아닙니다.');

      const QR_TTL_MS = 5 * 60 * 1000;
      if (!qrPayload.issuedAt || Date.now() - qrPayload.issuedAt > QR_TTL_MS) {
        return fail('만료된 QR입니다. 새로 발급받아주세요.');
      }

      const already = db.verifications.find(v =>
        v.scheduleId === schedule.id && v.verifiedUserId === participant.userId
      );
      if (already) return fail('이미 인증된 참여자입니다.');

      const creator = schedule.participants.find(p => p.role === 'CREATOR');
      const verification = {
        id: nextId(db.verifications),
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

  // ===========================================================
  // places
  // ===========================================================
  places: {
    list: () => {
      mockLog('places.list');
      return ok(load().places);
    },

    detail: (id) => {
      mockLog('places.detail', id);
      const found = load().places.find(p => p.id === Number(id));
      return found ? ok(found) : fail(`Place not found: ${id}`);
    },

    search: (query) => {
      mockLog('places.search', query);
      const q = String(query || '').trim().toLowerCase();
      const all = load().places;
      if (!q) return ok(all);
      const filtered = all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
      return ok(filtered);
    },
  },

  // ===========================================================
  // users
  // ===========================================================
  users: {
    detail: (id) => {
      mockLog('users.detail', id);
      if (id == null) return fail('userId가 비어있습니다.');
      const found = load().users.find(u => u.id === Number(id));
      return found ? ok(found) : fail(`User not found: ${id}`);
    },

    update: (id, data) => {
      mockLog('users.update', { id, data });
      if (id == null) return fail('userId가 비어있습니다.');
      const db = load();
      const idx = db.users.findIndex(u => u.id === Number(id));
      if (idx === -1) return fail(`User not found: ${id}`);

      // 최상위 필드(name/gender 등) + profile.* 필드 둘 다 갱신 가능
      const { profile: profilePatch, ...userPatch } = data || {};
      db.users[idx] = {
        ...db.users[idx],
        ...userPatch,
        profile: { ...(db.users[idx].profile || {}), ...(profilePatch || {}) },
      };
      save(db);
      return ok(db.users[idx]);
    },

    withdrawal: (id, reason) => {
      mockLog('users.withdrawal', { id, reason });
      if (id == null) return fail('userId가 비어있습니다.');
      const db = load();
      const idx = db.users.findIndex(u => u.id === Number(id));
      if (idx === -1) return fail(`User not found: ${id}`);

      const now = new Date().toISOString();
      db.users[idx] = {
        ...db.users[idx],
        status: 'WITHDRAWL', // ERD 원문 표기 유지
        withdrawalDate: now,
      };
      const logRow = {
        id: nextId(db.withdrawalLogs),
        userId: Number(id),
        reason: reason || null,
        withdrawnAt: now,
      };
      db.withdrawalLogs.push(logRow);
      save(db);
      return ok({ user: db.users[idx], log: logRow });
    },
  },

  // ===========================================================
  // notifications
  // ===========================================================
  notifications: {
    list: (userId) => {
      mockLog('notifications.list', userId);
      const db = load();
      // userId 미지정 시 빈 배열 (로그아웃 상태 등)
      if (userId == null) return ok([]);
      const filtered = db.notifications
        .filter(n => n.userId === Number(userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return ok(filtered);
    },

    markAsRead: (id) => {
      mockLog('notifications.markAsRead', id);
      const db = load();
      const idx = db.notifications.findIndex(n => n.id === Number(id));
      if (idx === -1) return fail(`Notification not found: ${id}`);
      db.notifications[idx] = { ...db.notifications[idx], isRead: true };
      save(db);
      return ok(db.notifications[idx]);
    },

    markAllAsRead: (userId) => {
      mockLog('notifications.markAllAsRead', userId);
      if (userId == null) return fail('userId가 비어있습니다.');
      const db = load();
      db.notifications = db.notifications.map(n =>
        n.userId === Number(userId) ? { ...n, isRead: true } : n
      );
      save(db);
      return ok({ updated: db.notifications.filter(n => n.userId === Number(userId)).length });
    },
  },

  // ===========================================================
  // curations
  // ===========================================================
  curations: {
    list: () => {
      mockLog('curations.list');
      const all = load().curations
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return ok(all);
    },

    detail: (id) => {
      mockLog('curations.detail', id);
      const found = load().curations.find(c => c.id === Number(id));
      return found ? ok(found) : fail(`Curation not found: ${id}`);
    },
  },

  // ===========================================================
  // bookmarks
  // ===========================================================
  bookmarks: {
    list: (userId) => {
      mockLog('bookmarks.list', userId);
      if (userId == null) return ok([]);
      const db = load();
      const rows = db.bookmarks.filter(b => b.userId === Number(userId));
      // 큐레이션 객체 조인해서 같이 반환
      const joined = rows.map(b => ({
        ...b,
        curation: db.curations.find(c => c.id === b.curationId) || null,
      }));
      return ok(joined);
    },

    toggle: (userId, curationId) => {
      mockLog('bookmarks.toggle', { userId, curationId });
      if (userId == null) return fail('userId가 비어있습니다.');
      const db = load();
      const idx = db.bookmarks.findIndex(b =>
        b.userId === Number(userId) && b.curationId === Number(curationId)
      );
      if (idx >= 0) {
        // 이미 북마크 → 제거
        const removed = db.bookmarks[idx];
        db.bookmarks.splice(idx, 1);
        save(db);
        return ok({ bookmarked: false, removed });
      }
      // 신규 추가
      const row = {
        id: nextId(db.bookmarks),
        userId: Number(userId),
        curationId: Number(curationId),
        createdAt: new Date().toISOString(),
      };
      db.bookmarks.push(row);
      save(db);
      return ok({ bookmarked: true, added: row });
    },

    check: (userId, curationId) => {
      mockLog('bookmarks.check', { userId, curationId });
      if (userId == null) return ok({ bookmarked: false });
      const db = load();
      const exists = db.bookmarks.some(b =>
        b.userId === Number(userId) && b.curationId === Number(curationId)
      );
      return ok({ bookmarked: exists });
    },

    // 보조: bookmark id로 직접 삭제 (api.bookmarks.remove와 매핑)
    removeById: (id) => {
      mockLog('bookmarks.removeById', id);
      const db = load();
      const idx = db.bookmarks.findIndex(b => b.id === Number(id));
      if (idx === -1) return fail(`Bookmark not found: ${id}`);
      const [removed] = db.bookmarks.splice(idx, 1);
      save(db);
      return ok(removed);
    },
  },

  /** 디버그: seed 데이터로 초기화 */
  reset: () => {
    mockLog('reset');
    localStorage.removeItem(STORAGE_KEY);
    return load();
  },
};
