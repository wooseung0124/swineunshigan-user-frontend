// =============================================================
// 인증 스토어 (zustand + persist)
// -------------------------------------------------------------
// - 토큰/유저를 localStorage에 영속화
// - persist 키: 'auth-storage' (단일 키로 통일. 기존 'token'/'user'/'auth_token' 폐기)
// - 새로고침 시 자동 rehydrate되며 api 모듈에도 토큰 동기화
// =============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setAuthToken } from '../api/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      // ----- state -----
      /** @type {import('../types/types').User | null} */
      user: null,
      /** @type {string | null} */
      token: null,
      /** @type {boolean} rehydrate(localStorage 복원) 완료 여부 */
      _hasHydrated: false,
      /**
       * 로그인: 토큰과 유저 정보를 저장하고 fetch용 토큰을 동기화한다.
       * @param {string} token
       * @param {import('../types/types').User} user
       */
      login: (token, user) => {
        setAuthToken(token);
        set({ token, user });
      },

      /** 로그아웃: 토큰/유저를 비우고 fetch용 토큰도 초기화한다. */
      logout: () => {
        setAuthToken(null);
        set({ token: null, user: null });
      },

      /**
       * 유저 정보만 갱신 (프로필 수정 등)
       * @param {import('../types/types').User} user
       */
      setUser: (user) => set({ user }),

      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 새로고침 후 rehydrate 시점에 api 모듈로 토큰 동기화
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
        state?.setHasHydrated(true);
      
      },
    }
  )
);

// =============================================================
// 편의 셀렉터
// -------------------------------------------------------------
// 사용 예:
//   const isAuthenticated = useAuthStore(selectIsAuthenticated);
//   const user            = useAuthStore((s) => s.user);
//   const login           = useAuthStore((s) => s.login);
//
// hook 외부 (이벤트 핸들러 등)에서 즉시 조회가 필요한 경우:
//   const { token } = useAuthStore.getState();
// =============================================================
export const selectIsAuthenticated = (s) => !!s.token;
export const selectHasHydrated = (s) => s._hasHydrated;
export const selectUser = (s) => s.user;
export const selectLogin = (s) => s.login;
export const selectLogout = (s) => s.logout;
