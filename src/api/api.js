import { mockDb } from './mockDb';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 백엔드 미연동 시 mockDb로 분기. 환경변수 false 또는 제거 시 진짜 fetch 호출.
// (auth/api 공용 플래그로 사용 중 - 현재 단계에선 어차피 같이 켜고 끔)
const IS_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// mock 분기에서 "현재 로그인된 user id"가 필요한 경우 사용.
// authStore를 직접 import하면 순환 참조가 생기므로 localStorage에서 직접 읽음.
function getCurrentUserIdFromStorage() {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.id ?? null;
  } catch {
    return null;
  }
}

let authToken = null;
export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API 에러 [${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // 인증
  auth: {
    kakaoLogin: (code, redirectUri) =>
      request('/api/auth/kakao/callback', {
        method: 'POST',
        body: JSON.stringify({ code, redirectUri }),
      }),
    naverLogin: (code, redirectUri) =>
      request('/api/auth/naver/callback', {
        method: 'POST',
        body: JSON.stringify({ code, redirectUri }),
      }),
    googleLogin: (code, redirectUri) =>
      request('/api/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({ code, redirectUri }),
      }),
    me: () => request('/api/auth/me'),
  },

  // 일정
  schedules: {
    create: (data) => request('/api/schedules', { method: 'POST', body: JSON.stringify(data) }),

    list: (filters = {}) => {
      if (IS_MOCK) return mockDb.schedules.list();
      const params = new URLSearchParams(filters).toString();
      return request(`/api/schedules${params ? '?' + params : ''}`);
    },
    listByPlace: (placeId) => {
      if (IS_MOCK) return mockDb.schedules.listByPlace(placeId);
      return request(`/api/schedules?placeId=${placeId}`);
    },

    detail: (id) => {
      if (IS_MOCK) return mockDb.schedules.detail(id);
      return request(`/api/schedules/${id}`);
    },

    update: (id, data) => {
      if (IS_MOCK) return mockDb.schedules.update(id, data);
      return request(`/api/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },

    cancel: (id, reason) => {
      if (IS_MOCK) return mockDb.schedules.cancel(id, reason);
      return request(`/api/schedules/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) });
    },

    join: (id) => request(`/api/schedules/${id}/join`, { method: 'POST' }),
    leave: (id) => request(`/api/schedules/${id}/leave`, { method: 'DELETE' }),
    upcoming: () => request('/api/schedules/upcoming'),

    // QR 인증 기록 목록
    verifications: (id) => {
      if (IS_MOCK) return mockDb.schedules.verifications(id);
      return request(`/api/schedules/${id}/verifications`);
    },

    // QR 인증 처리 (개설자가 참여자 QR을 스캔)
    verifyQR: (id, qrPayload) => {
      if (IS_MOCK) return mockDb.schedules.verifyQR(id, qrPayload);
      return request(`/api/schedules/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify(qrPayload),
      });
    },
  },

  // 장소
  places: {
    list: () => {
      if (IS_MOCK) return mockDb.places.list();
      return request('/api/places');
    },

    detail: (id) => {
      if (IS_MOCK) return mockDb.places.detail(id);
      return request(`/api/places/${id}`);
    },

    search: (filters = {}) => {
      if (IS_MOCK) {
        // 가장 흔한 검색 키 두 가지를 같이 지원
        const q = filters.q ?? filters.query ?? filters.keyword ?? '';
        return mockDb.places.search(q);
      }
      const params = new URLSearchParams(filters).toString();
      return request(`/api/places/search${params ? '?' + params : ''}`);
    },
  },

  // 마이페이지
  users: {
    me: () => {
      if (IS_MOCK) {
        const id = getCurrentUserIdFromStorage();
        return mockDb.users.detail(id);
      }
      return request('/api/users/me');
    },

    update: (data) => {
      if (IS_MOCK) {
        const id = getCurrentUserIdFromStorage();
        return mockDb.users.update(id, data);
      }
      return request('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) });
    },

    withdraw: (reason) => {
      if (IS_MOCK) {
        const id = getCurrentUserIdFromStorage();
        return mockDb.users.withdrawal(id, reason);
      }
      return request('/api/users/me', { method: 'DELETE', body: JSON.stringify({ reason }) });
    },

    profile: (id) => {
      if (IS_MOCK) return mockDb.users.detail(id);
      return request(`/api/users/${id}`);
    },
  },

  // 알림
  notifications: {
    list: () => {
      if (IS_MOCK) {
        const userId = getCurrentUserIdFromStorage();
        return mockDb.notifications.list(userId);
      }
      return request('/api/notifications');
    },

    read: (id) => {
      if (IS_MOCK) return mockDb.notifications.markAsRead(id);
      return request(`/api/notifications/${id}/read`, { method: 'PATCH' });
    },

    // 신규: 전체 읽음 처리
    readAll: () => {
      if (IS_MOCK) {
        const userId = getCurrentUserIdFromStorage();
        return mockDb.notifications.markAllAsRead(userId);
      }
      return request('/api/notifications/read-all', { method: 'PATCH' });
    },

    registerToken: (token) =>
      request('/api/fcm/token', { method: 'POST', body: JSON.stringify({ token }) }),
  },

  // 큐레이션
  curations: {
    list: () => {
      if (IS_MOCK) return mockDb.curations.list();
      return request('/api/curations');
    },

    detail: (id) => {
      if (IS_MOCK) return mockDb.curations.detail(id);
      return request(`/api/curations/${id}`);
    },
  },

  // 북마크
  bookmarks: {
    list: () => {
      if (IS_MOCK) {
        const userId = getCurrentUserIdFromStorage();
        return mockDb.bookmarks.list(userId);
      }
      return request('/api/bookmarks');
    },

    add: (curationId) => {
      if (IS_MOCK) {
        // mock에서는 toggle로 매핑 (이미 있으면 no-op처럼 동작)
        const userId = getCurrentUserIdFromStorage();
        return mockDb.bookmarks.toggle(userId, curationId);
      }
      return request('/api/bookmarks', { method: 'POST', body: JSON.stringify({ curationId }) });
    },

    remove: (id) => {
      if (IS_MOCK) return mockDb.bookmarks.removeById(id);
      return request(`/api/bookmarks/${id}`, { method: 'DELETE' });
    },

    // 신규: 토글 (있으면 제거, 없으면 추가) — 1 round-trip
    toggle: (curationId) => {
      if (IS_MOCK) {
        const userId = getCurrentUserIdFromStorage();
        return mockDb.bookmarks.toggle(userId, curationId);
      }
      return request('/api/bookmarks/toggle', { method: 'POST', body: JSON.stringify({ curationId }) });
    },

    // 신규: 북마크 여부 확인
    check: (curationId) => {
      if (IS_MOCK) {
        const userId = getCurrentUserIdFromStorage();
        return mockDb.bookmarks.check(userId, curationId);
      }
      return request(`/api/bookmarks/check?curationId=${encodeURIComponent(curationId)}`);
    },
  },
};