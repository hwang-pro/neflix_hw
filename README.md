# 🎬 Netflix Clone

TMDB API를 활용한 Netflix 스타일 영화 브라우징 웹사이트

## 📋 프로젝트 개요

이 프로젝트는 React와 TMDB API를 사용하여 Netflix와 유사한 영화 브라우징 웹사이트를 구현한 클론 프로젝트입니다.

## ✨ 주요 기능

- 🔐 로그인/회원가입 기능
- 🏠 홈 페이지 (인기 영화, 현재 상영작, 최고 평점, 개봉 예정)
- 📊 대세 콘텐츠 페이지 (Table View / 무한 스크롤)
- 🔍 찾아보기 페이지 (장르 필터링, 검색)
- ❤️ 찜한 리스트 페이지
- 📱 반응형 디자인 (모바일, 태블릿, 데스크탑)

## 🛠️ 기술 스택

- **Frontend**: React 18.3.1
- **Routing**: React Router DOM 6.30.2
- **API**: TMDB API
- **Styling**: CSS3 (Animations, Transitions, Transform)
- **State Management**: Local Storage

## 📦 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/hwang-pro/netflix_clone.git
cd netflix_clone
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 TMDB API 키를 설정하세요:
```
REACT_APP_TMDB_API_KEY=your_api_key_here
```

TMDB API 키 발급: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

4. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🚀 사용 방법

1. **회원가입**
   - `/signin` 페이지에서 회원가입
   - 비밀번호는 TMDB API 키를 사용합니다

2. **로그인**
   - 회원가입한 이메일과 비밀번호로 로그인

3. **영화 탐색**
   - 홈 페이지에서 다양한 카테고리 영화 확인
   - 대세 콘텐츠 페이지에서 인기 영화 탐색
   - 찾아보기 페이지에서 장르별 필터링 및 검색

4. **찜하기**
   - 영화 카드의 하트 아이콘을 클릭하여 찜 목록에 추가/제거
   - 내가 찜한 리스트 페이지에서 저장된 영화 확인

## 📁 프로젝트 구조

```
src/
├── components/        # 재사용 컴포넌트
│   ├── Header.jsx    # 상단 네비게이션 바
│   ├── MovieCard.jsx # 영화 카드 컴포넌트
│   └── Loading.jsx   # 로딩 스피너
├── pages/            # 페이지 컴포넌트
│   ├── SignIn.jsx    # 로그인/회원가입
│   ├── Home.jsx      # 메인 페이지
│   ├── Popular.jsx   # 대세 콘텐츠
│   ├── Search.jsx    # 찾아보기
│   └── Wishlist.jsx  # 찜한 리스트
├── utils/            # 유틸리티 함수
│   ├── api.js       # TMDB API 호출 함수
│   ├── auth.js      # 인증 관련 함수
│   └── storage.js   # Local Storage 관리
├── styles/           # CSS 파일
├── App.js           # 라우팅 설정
└── index.js         # 진입점
```

## 🌿 Git Flow 전략

이 프로젝트는 Git Flow 전략을 따릅니다:

- `main`: 최종 완성본
- `develop`: 데모 버전 (모든 feature 통합)
- `feature/*`: 각 기능별 개발 브랜치
  - `feature/login`: 로그인 기능
  - `feature/movie_card`: 영화 카드 컴포넌트
  - `feature/routing`: 라우팅 보호 기능
  - `feature/loading`: 로딩 컴포넌트

## 📝 주요 특징

- ✅ Gitflow 전략 적용
- ✅ 의미있는 커밋 메시지
- ✅ 환경 변수를 통한 API Key 관리
- ✅ 동적 페이지 구성
- ✅ 반응형 디자인
- ✅ CSS 애니메이션 및 트랜지션 효과

## 🔒 보안

- API Key는 환경 변수로 관리되며 `.env` 파일은 `.gitignore`에 포함되어 있습니다
- 코드에 API Key를 하드코딩하지 않습니다

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👤 작성자

hwang-pro
