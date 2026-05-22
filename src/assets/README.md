# src/assets

번들에 포함되는 정적 자산을 보관하는 폴더.

`import` 구문으로 코드에서 참조 (Vite가 해시 처리 + 작은 파일은 base64 인라인).

```jsx
import bannerImg from '../assets/images/main-banner.png';
import searchIcon from '../assets/icons/search.svg';
```

## 폴더 구조

```
src/assets/
├── images/      사진·배경·일러스트·캐릭터 등 (PNG / JPG / WebP)
└── icons/       SVG 아이콘 전용 (단색·다색 모두)
```

### `images/`
- **용도**: 사진, 배경, 일러스트, 캐릭터, 큰 비주얼 자산
- **권장 포맷**: PNG (투명도 필요), JPG (사진), WebP (최신 브라우저 최적화)
- **네이밍**: kebab-case, 영문 (예: `main-banner.png`, `empty-state-bookmark.png`)
- **크기**: 1MB 이하 권장

### `icons/`
- **용도**: UI 아이콘 (검색, 알림, 닫기, 화살표 등)
- **포맷**: SVG 전용
- **네이밍**: kebab-case (예: `chevron-right.svg`, `bookmark-filled.svg`)
- **색상**: 가능하면 `fill="currentColor"`로 만들어 CSS `color`로 제어 가능하게

## 어디에 두면 안 되나

| 상황 | 추천 위치 |
|---|---|
| 절대 경로(`/foo.png`)로 외부에서 접근해야 함 | `public/` |
| OG 이미지, manifest, favicon 등 메타 자산 | `public/` |
| 백엔드에서 받는 동적 이미지 (유저 프로필 사진 등) | 저장 안 함 (URL만 보관) |
