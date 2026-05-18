import { mockDb } from './mockDb';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 백엔드 미연동 시 mockDb로 분기. 환경변수 false 또는 제거 시 진짜 fetch 호출.
// (auth/api 공용 플래그로 사용 중 - 현재 단계에선 어차피 같이 켜고 끔)
const IS_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

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
    list: () => request('/api/places'),
    detail: (id) => request(`/api/places/${id}`),
    search: (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      return request(`/api/places/search${params ? '?' + params : ''}`);
    },
  },

  // 마이페이지
  users: {
    me: () => request('/api/users/me'),
    update: (data) => request('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    withdraw: (reason) => request('/api/users/me', { method: 'DELETE', body: JSON.stringify({ reason }) }),
    profile: (id) => request(`/api/users/${id}`),
  },

  // 알림
  notifications: {
    list: () => request('/api/notifications'),
    read: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
    registerToken: (token) => request('/api/fcm/token', { method: 'POST', body: JSON.stringify({ token }) }),
  },

  // 큐레이션
  curations: {
    list: () => request('/api/curations'),
    detail: (id) => request(`/api/curations/${id}`),
  },

  // 북마크
  bookmarks: {
    list: () => request('/api/bookmarks'),
    add: (curationId) => request('/api/bookmarks', { method: 'POST', body: JSON.stringify({ curationId }) }),
    remove: (id) => request(`/api/bookmarks/${id}`, { method: 'DELETE' }),
  },
};