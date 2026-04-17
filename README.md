# swineunshigan-user-frontend
커뮤니티 사용자 전용 앱 프론트엔드

## 🚀 개발 환경 셋팅

### 1. 레포 클론
git clone https://github.com/shineunsigan-project/User_Front_end_App.git

cd User_Front_end_App

### 2. 브랜치 규칙
- 작업 시작 전 반드시 develop에서 분기
  - git checkout develop
  - git pull origin develop
  - git checkout -b feature/내-기능명

### 3. 작업 완료 후
- git add .
- git commit -m "feat: 기능 설명"
- git push origin feature/내-기능명
→ GitHub에서 develop으로 PR 생성

  - PR (Pull Request) 는 "내가 작업한 브랜치의 코드를 다른 브랜치에 합쳐달라는 요청"

 
    | [내 작업 브랜치] → | [공통 브랜치] |
    | --- | --- |
    | feature/내-기능명 → | develop |
    | (로컬에서 작업한 내 코드) → | PR (github 팀 공용 코드) |

  - (1) git push origin feature/내-기능명 으로 내 브랜치를 GitHub에 올림
  - (2) GitHub 사이트에 접속하면 "Compare & pull request" 버튼이 뜸
  - (3) push request를 하면 GitHub 저장소에 가면 이런 UI가 나타나요.
    - [base: develop  ←  compare: feature/내-기능명]

 
      | 구분 | 브랜치 | 설명 |
      |------|--------|------|
      | `compare` | `feature/내-기능명` | 내가 작업한 브랜치 |
      | `base` | `develop` | 합쳐질 목적지 브랜치 |

      "base"는 목적지입니다. 기본값이 main으로 설정되어 있는 경우가 많은데, 이걸 develop으로 바꿔주는 작업입니다.
      
      즉 "feature/내-기능명에 있는 내 코드를 → develop 브랜치로 합쳐달라"는 요청서를 만드는 과정입니다.

      실제 클릭 순서는 다음과 같습니다.

       - (1) GitHub에서 내 저장소 접속
       - (2) "Compare & pull request" 버튼 클릭
       - (3) base 브랜치를 main → develop으로 변경
       - (4) 제목/설명 작성 후 "Create pull request" 클릭
     
      항상 base를 develop으로 맞춰서 PR 보내주세요. main은 최종 배포용으로 작업할 겁니다. 명심하세요.
    

### 4. main 직접 push 금지 ❌
### 5. .env 파일 커밋 금지 🚨

### 6. 디자이너 파일 업로드
 - GitHub 사이트에서 직접 업로드
 - 이미지 넣을 폴더 클릭 (예: public/images)
 - "Add file" → "Upload files" 클릭
 - 파일 드래그 앤 드롭
 - 하단 "Commit changes" 클릭

   - 디자이너 주의사항

  
    | 항목 | 권장 |
    | --- | --- |
    | 파일명 | 한글, 공백 금지 → main-banner.png 형태로 |
    | 파일 | 형식PNG, SVG, WebP 권장 |
    | 파일 | 크기1MB 이하 권장 (GitHub 제한 100MB) |
    | 올릴 브랜치 | develop 또는 담당자와 사전 협의 | 

---

## 📌 프로젝트 개요
- **서비스명**: 쉬는시간
- **분류**: 커뮤니티 플랫폼 (스마트폰 App)
- **개발 기간**: 2026. 02. 01 ~ 진행중
- **관련 레포**: 백엔드 Repository (링크 추가 예정)

## 🛠️ 기술 스택
- **Frontend**: (추가 예정)
- **Backend**: (추가 예정)
- **형상 관리**: GitHub
- **협업 툴**: (추가 예정)

## 👥 팀 구성
| 역할 | 담당자 | 담당 기능 |
|---|---|---|
| Frontend | (추가 예정) | |
| Backend | (추가 예정) | |

## ⚙️ 주요 기능
- (추가 예정)

## 📦 라이브러리
- (추가 예정)

## 📊 진행 현황
- (추가 예정)
