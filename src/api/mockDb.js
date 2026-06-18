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
// 영업시간(operations) 생성 헬퍼
// - 백엔드 장소 상세 응답의 operations 형식을 흉내냄 (요일 7개)
// - 평일/주말 통일된 기본 세트. 휴무 요일은 opening/closing = null
// - mock 전용. 백엔드 붙으면(IS_MOCK=false) 사용 안 됨.
// -------------------------------------------------------------
const WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

function buildOperations(startId, { opening = '10:30', closing = '22:00', closedDays = ['SUNDAY'] } = {}) {
  return WEEK.map((day, i) => {
    const closed = closedDays.includes(day);
    return {
      id: startId + i,
      dayOfWeek: day,
      openingTime: closed ? null : opening,
      closingTime: closed ? null : closing,
      breakTimeStart: null,
      breakTimeEnd: null,
      lastOrder: null,
    };
  });
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
  const createdAt = iso(-30 * DAY); // 장소 등록 시점 (적당히 과거)

  // ----- Places (백엔드 명세: category 문자열, 평면 구조) -----
  // images/operations는 별도 테이블(placeImages/placeOperations)로 분리(정규화)
  const places = [
    {
      id: 1,
      category: '음식점',
      name: '맞스터치 성수역점',
      address: '서울 성동구 성수동2가 289-10',
      contact: '02-1234-5678',
      snsLink: null,
      latitude: 37.5445,
      longitude: 127.0560,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 2,
      category: '카페',
      name: '서울숲 카페',
      address: '서울 성동구 서울숲길 17',
      contact: '02-9876-5432',
      snsLink: null,
      latitude: 37.5465,
      longitude: 127.0580,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 3,
      category: '카페',
      name: '성수 북카페',
      address: '서울 성동구 연무장길 15',
      contact: null,
      snsLink: null,
      latitude: 37.5430,
      longitude: 127.0540,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 4,
      category: '문화시설',
      name: '성수 미술관',
      address: '서울 성동구 성수일로 56',
      contact: '02-3333-4444',
      snsLink: null,
      latitude: 37.5455,
      longitude: 127.0570,
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 5,
      category: '레포츠',
      name: '서울숲 공원',
      address: '서울 성동구 뚝섬로 273',
      contact: null,
      snsLink: null,
      latitude: 37.5440,
      longitude: 127.0590,
      createdAt,
      updatedAt: createdAt,
    },
  ];

  // ----- Place Images (placeId로 연결) -----
  const placeImages = [
    { id: 1, placeId: 1, imageUrl: 'https://picsum.photos/seed/place1/600/400', isMain: true,  createdAt, updatedAt: createdAt },
    { id: 2, placeId: 1, imageUrl: 'https://picsum.photos/seed/place1b/600/400', isMain: false, createdAt, updatedAt: createdAt },
    { id: 3, placeId: 2, imageUrl: 'https://picsum.photos/seed/place2/600/400', isMain: true,  createdAt, updatedAt: createdAt },
    { id: 4, placeId: 3, imageUrl: 'https://picsum.photos/seed/place3/600/400', isMain: true,  createdAt, updatedAt: createdAt },
    { id: 5, placeId: 4, imageUrl: 'https://picsum.photos/seed/place4/600/400', isMain: true,  createdAt, updatedAt: createdAt },
    { id: 6, placeId: 5, imageUrl: 'https://picsum.photos/seed/place5/600/400', isMain: true,  createdAt, updatedAt: createdAt },
  ];

  // ----- Place Operations (placeId로 연결, 요일별 7개씩) -----
  // 통일 세트: 평일~토 10:30~22:00, 일요일 휴무. (mock 전용 흉내 데이터)
  const placeOperations = [
    ...places.flatMap((p, idx) =>
      buildOperations(idx * 7 + 1, { opening: '10:30', closing: '22:00', closedDays: ['SUNDAY'] })
        .map(op => ({ ...op, placeId: p.id }))
    ),
  ];

  // ----- Users (mock auth 3종 + 일정 참여자 4종) -----
  const users = [
    {
      id: 101, name: '김진우', email: 'jinwoo@kakao.com', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1995-12-09', profileImageUrl: null, mbti: 'INFP', introduction: '음악과 책을 좋아하는 프론트엔드 개발자입니다.', activity: '카페에서 책 읽기' },
    },
    {
      id: 102, name: '이수민', email: 'sumin@naver.com', gender: 'FEMALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1997-05-20', profileImageUrl: null, mbti: 'ENFJ', introduction: '사람 만나는 거 좋아해요.', activity: '카페 투어' },
    },
    {
      id: 103, name: '박지수', email: 'jisu@gmail.com', gender: 'FEMALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1998-09-03', profileImageUrl: null, mbti: 'ISFJ', introduction: '맛집 탐방을 좋아해요.', activity: '점심 메이트 찾기' },
    },
    {
      id: 104, name: '내목업', email: 'mockuser@example.com', gender: 'MALE', status: 'ACTIVE', withdrawalDate: null,
      profile: { birthDate: '1999-02-11', profileImageUrl: null, mbti: 'ENTP', introduction: '뭐든 일단 시도파.', activity: '신규 카페 탐방' },
    },
  ];

  // ----- Schedules -----
  // place nested는 백엔드 Schedule 응답 형식({id,name,address})에 맞춤
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
      place: { id: 1, name: '맞스터치 성수역점', address: '서울 성동구 성수동2가 289-10' },
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
      genderCondition: 'FEMALE_ONLY',
      maxParticipants: 3,
      status: 'PENDING',
      canceledAt: null,
      place: { id: 2, name: '서울숲 카페', address: '서울 성동구 서울숲길 17' },
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
      place: { id: 3, name: '성수 북카페', address: '서울 성동구 연무장길 15' },
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
      place: { id: 1, name: '맞스터치 성수역점', address: '서울 성동구 성수동2가 289-10' },
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
      place: { id: 5, name: '서울숲 공원', address: '서울 성동구 뚝섬로 273' },
      participants: [],
      currentParticipants: 2,
      myRole: 'CREATOR',
    },
  ];

  // ----- Notifications -----
  const notifications = [
    { id: 1, userId: 101, type: 'schedule_cancelled', title: '일정이 취소되었습니다',     body: '맞스터치 성수역점 - 점심 같이 먹어요 일정이 취소되었습니다.',                       createdAt: iso(-5 * MIN),  isRead: false },
    { id: 2, userId: 101, type: 'schedule_joined',    title: '새로운 참여자가 들어왔어요', body: "이수민님이 '성수동 스터디 모임'에 참여했습니다.",                                  createdAt: iso(-1 * HOUR), isRead: false },
    { id: 3, userId: 101, type: 'schedule_reminder',  title: '약속 시간이 다가오고 있어요', body: '독서 모임 시작까지 1시간 남았습니다.',                                              createdAt: iso(-3 * HOUR), isRead: false },
    { id: 4, userId: 101, type: 'schedule_completed', title: '일정이 완료되었습니다',     body: '서울숲 카페 - 카페 모임이 완료되었습니다.',                                          createdAt: iso(-1 * DAY),  isRead: true },
    { id: 5, userId: 101, type: 'system',             title: '쉬는시간 서비스 안내',       body: '새로운 큐레이션 콘텐츠가 등록되었어요. 확인해보세요!',                                createdAt: iso(-3 * DAY),  isRead: true },
  ];

  // ----- Curations -----
  const curations = [
    { id: 1, title: '성수동 분위기 좋은 카페 BEST 5',  summary: '요즘 성수에서 가장 핫한 카페들을 모아봤어요.',    category: '카페',     imageUrl: null, createdAt: '2026-04-28T10:00:00Z' },
    { id: 2, title: '서울숲 산책 코스 추천',           summary: '운동도 하고 자연도 즐기고. 추천 산책 코스 3가지.', category: '레포츠',   imageUrl: null, createdAt: '2026-04-25T10:00:00Z' },
    { id: 3, title: '성수에서 만나기 좋은 점심 맛집',   summary: '직장인부터 데이트까지, 점심 약속 잡기 좋은 맛집.',  category: '음식점',   imageUrl: null, createdAt: '2026-04-22T10:00:00Z' },
    { id: 4, title: '문화생활 즐기기 좋은 성수 갤러리', summary: '예술과 함께하는 시간. 매력적인 갤러리 4곳.',      category: '문화시설', imageUrl: null, createdAt: '2026-04-20T10:00:00Z' },
    { id: 5, title: '성수 핫플 - 인스타 감성 가득',     summary: '사진 찍기 좋은 성수의 인스타 핫플.',              category: '카페',     imageUrl: null, createdAt: '2026-04-18T10:00:00Z' },
  ];

// ----- Bookmarks (정규화 - userId 101이 큐레이션 1, 4 북마크) -----
const bookmarks = [
  { id: 1, userId: 101, curationId: 1, createdAt: iso(-2 * DAY) },
  { id: 2, userId: 101, curationId: 4, createdAt: iso(-1 * DAY) },
];
  return {
    schedules,
    statusShares: [],   // 단계 2(이동 소식)에서 사용 예정
    verifications: [],  // 단계 3(QR 인증)에서 사용
    places,
    placeImages,
    placeOperations,
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
  // schedules
  // ===========================================================
  schedules: {
    list: () => {
      mockLog('schedules.list');
      return ok(load().schedules);
    },
    create: (data, currentUserId) => {
      mockLog('schedules.create', data, currentUserId);
      const db = load();

      // 같은 날 이미 개설한 일정 차단 (운영방침 제3조)
      const dupDate = data.scheduledAt?.slice(0, 10);
      const dupExisting = db.schedules.find(s =>
        s.creatorId === currentUserId &&
        s.status !== 'CANCELED' &&
        s.scheduledAt?.slice(0, 10) === dupDate
      );
      if (dupExisting) {
        return Promise.reject({
          code: 'DUPLICATE_DAY',
          message: '일정은 하루에 하나만 개설할 수 있어요.',
          existing: dupExisting,
        });
      }
      

      const newId = db.schedules.length
        ? Math.max(...db.schedules.map(s => s.id)) + 1
        : 1;

      const u = db.users.find(x => x.id === currentUserId);

      const newSchedule = {
        id: newId,
        creatorId: currentUserId,
        placeId: data.place?.id ?? null,
        title: data.title,
        description: data.description,
        category: data.category,
        scheduledAt: data.scheduledAt,
        genderCondition: data.genderCondition,
        maxParticipants: data.maxParticipants,
        status: 'PENDING',
        canceledAt: null,
        place: {
          id: data.place?.id ?? null,
          name: data.place?.name ?? '',
          address: data.place?.address ?? '',
        },
        participants: [
          {
            id: Date.now(),
            scheduleId: newId,
            userId: currentUserId,
            role: 'CREATOR',
            status: 'ACTIVE',
            canceledAt: null,
            user: u ? { id: u.id, name: u.name, gender: u.gender, status: u.status } : null,
            profile: u?.profile
              ? { mbti: u.profile.mbti, introduction: u.profile.introduction, profileImageUrl: u.profile.profileImageUrl }
              : null,
          },
        ],
        currentParticipants: 1,
        myRole: 'CREATOR',
      };

      db.schedules.push(newSchedule);
      save(db);
      return ok(newSchedule);
    },

    listByPlace: (placeId) => {
      mockLog('schedules.listByPlace', placeId);
      return ok(load().schedules.filter(s => s.placeId === Number(placeId)));
    },

    detail: (id, currentUserId) => {
      mockLog('schedules.detail', id, currentUserId);
      const found = load().schedules.find(s => s.id === Number(id));
      if (!found) return fail(`Schedule not found: ${id}`);
    
      // 로그인 유저 기준으로 myRole 계산 (하드코딩 myRole 대체)
      let myRole = null; // 비참여자(GUEST)
      if (currentUserId != null) {
        if (found.creatorId === currentUserId) {
          myRole = 'CREATOR';
        } else if (found.participants?.some(
          p => p.userId === currentUserId && p.status === 'ACTIVE'
        )) {
          myRole = 'PARTICIPANT';
        }
      }
    
      return ok({ ...found, myRole });
    },

    join: (scheduleId, currentUserId, currentUserGender) => {
      mockLog('schedules.join', scheduleId, currentUserId);
      const db = load();
      const found = db.schedules.find(s => s.id === Number(scheduleId));
      if (!found) return fail('일정을 찾을 수 없습니다.');

      // ③ 본인 개설 일정
      if (found.creatorId === currentUserId) return fail('본인이 개설한 일정입니다.');

      // ② 이미 참여 중
      const already = found.participants?.some(
        p => p.userId === currentUserId && p.status === 'ACTIVE'
      );
      if (already) return fail('이미 참여 중인 일정입니다.');

      // ⑤ 모집 상태 (PENDING만)
      if (found.status !== 'PENDING') return fail('모집이 종료된 일정입니다.');

      // ④ 정원
      if (found.currentParticipants >= found.maxParticipants) {
        return fail('모집 인원이 찼습니다.');
      }

      // ⑥ 성별 조건
      if (found.genderCondition === 'MALE_ONLY' && currentUserGender !== 'MALE') {
        return fail('성별 제한이 있습니다.');
      }
      if (found.genderCondition === 'FEMALE_ONLY' && currentUserGender !== 'FEMALE') {
        return fail('성별 제한이 있습니다.');
      }

      // ⑦ 동일 날 개설 이력 + 시간 겹침 (앞뒤 3시간)
      if (found.scheduledAt) {
        const targetTime = new Date(found.scheduledAt).getTime();
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        const mine = db.schedules.filter(s =>
          s.id !== found.id &&
          s.status !== 'CANCELED' &&
          s.scheduledAt &&
          (s.creatorId === currentUserId ||
           s.participants?.some(p => p.userId === currentUserId && p.status === 'ACTIVE'))
        );
        const targetDate = found.scheduledAt.slice(0, 10);
        const sameDayCreated = mine.some(s =>
          s.creatorId === currentUserId && s.scheduledAt.slice(0, 10) === targetDate
        );
        if (sameDayCreated) return fail('같은 날 이미 개설한 일정이 있습니다.');
        const overlap = mine.some(s =>
          Math.abs(new Date(s.scheduledAt).getTime() - targetTime) < THREE_HOURS
        );
        if (overlap) return fail('같은 시간대에 참여 중인 일정이 있습니다.');
      }
      // ─── 검증 통과: 참여 처리 ───
      const u = db.users.find(x => x.id === currentUserId);
      found.participants.push({
        id: Date.now(),
        scheduleId: found.id,
        userId: currentUserId,
        role: 'PARTICIPANT',
        status: 'ACTIVE',
        canceledAt: null,
        user: u ? { id: u.id, name: u.name, gender: u.gender, status: u.status } : null,
        profile: u?.profile
          ? { mbti: u.profile.mbti, introduction: u.profile.introduction, profileImageUrl: u.profile.profileImageUrl }
          : null,
      });
      found.currentParticipants += 1;

      save(db);
      return ok({ ...found, myRole: 'PARTICIPANT' });
    },

    leave: (scheduleId, currentUserId) => {
      mockLog('schedules.leave', scheduleId, currentUserId);
      const db = load();
      const found = db.schedules.find(s => s.id === Number(scheduleId));
      if (!found) return fail(`Schedule not found: ${scheduleId}`);

      const idx = found.participants?.findIndex(
        p => p.userId === currentUserId && p.status === 'ACTIVE'
      );
      if (idx == null || idx === -1) return fail('참여 중인 일정이 아닙니다.');

      found.participants.splice(idx, 1);
      found.currentParticipants = Math.max(0, found.currentParticipants - 1);

      save(db);
      return ok({ ...found, myRole: null });
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
    remove: (id) => {
      mockLog('schedules.remove(hide)', { id });
      const db = load();
      const idx = db.schedules.findIndex(s => s.id === Number(id));
      if (idx === -1) return fail(`Schedule not found: ${id}`);
      // hard delete 아님 — 개설자 목록에서만 숨김 (일정 자체는 보존)
      db.schedules[idx] = {
        ...db.schedules[idx],
        hiddenByCreator: true,
        hiddenAt: new Date().toISOString(),
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
  // statusShares (이동 소식)
  // ===========================================================
  statusShares: {
    // 내 현황 전송/갱신 (upsert)
    upsert: (scheduleId, userId, payload) => {
      mockLog('statusShares.upsert', scheduleId, userId, payload);
      const db = load();
      const now = new Date().toISOString();
      const existing = db.statusShares.find(
        s => s.scheduleId === Number(scheduleId) && s.userId === userId
      );
      if (existing) {
        existing.moveStatus = payload.moveStatus;
        existing.statusText = payload.statusText ?? null;
        existing.distance = payload.distance ?? null;  // 실제 거리는 백엔드 계산
        existing.updatedAt = now;
        save(db);
        return ok(existing);
      }
      const created = {
        id: Date.now(),
        scheduleId: Number(scheduleId),
        userId,
        moveStatus: payload.moveStatus,
        statusText: payload.statusText ?? null,
        distance: payload.distance ?? null,
        updatedAt: now,
      };
      db.statusShares.push(created);
      save(db);
      return ok(created);
    },

    // 내 현황 조회 (페이지 재접속 시)
    mine: (scheduleId, userId) => {
      mockLog('statusShares.mine', scheduleId, userId);
      const db = load();
      const found = db.statusShares.find(
        s => s.scheduleId === Number(scheduleId) && s.userId === userId
      );
      return ok(found || null);
    },

    // 일정 전체 현황 목록
    list: (scheduleId) => {
      mockLog('statusShares.list', scheduleId);
      const db = load();
      return ok(db.statusShares.filter(s => s.scheduleId === Number(scheduleId)));
    },
  },
  // ===========================================================
  // places
  // ===========================================================
  places: {
    // 목록: place 메타만 반환 (images/operations 불필요)
    list: () => {
      mockLog('places.list');
      return ok(load().places);
    },

    // 상세: {place, images, operations} 조립 (백엔드 명세 형식)
    detail: (id) => {
      mockLog('places.detail', id);
      const db = load();
      const place = db.places.find(p => p.id === Number(id));
      if (!place) return fail(`Place not found: ${id}`);

      const images = db.placeImages.filter(img => img.placeId === Number(id));
      // operations는 요일 순서 보장 (월→일)
      const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      const operations = db.placeOperations
        .filter(op => op.placeId === Number(id))
        .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek))
        // 백엔드 응답엔 placeId가 없으므로 제거하고 반환
        .map(({ placeId, ...rest }) => rest);

      return ok({ place, images, operations });
    },

    // 검색: 단순 키워드 (name / address / category 부분 일치)
    // 백엔드 = /api/v1/places/search?keyword=. mock은 keyword 없으면 전체.
    search: (keyword) => {
      mockLog('places.search', keyword);
      const q = String(keyword || '').trim().toLowerCase();
      const all = load().places;
      if (!q) return ok(all);
      const filtered = all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
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