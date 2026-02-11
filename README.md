## ⏰ JGW Clock App

> **단순한 클록 코딩을 넘어, "왜?"라는 질문에 대한 답을 찾아가는 여정**

JGW Clock App은 iPhone 시계 앱의 UI/X를 모바일 웹 환경에 맞게 구현한 프로젝트입니다. <br />
단순 기능 구현에 그치지 않고, **설계 아키텍처의 타당성**, **성능 최적화**, **보안성**을 끊임없이 고민하며 점진적으로 코드를 개선해 나가는 과정을 담았습니다.

<br />

## ⚙️ JGW Clock App - FE Skills

|Category|Stack|Description|
|:--|:--|:--|
|**Framework**|**React**||
|**Language**|**TypeScript**||
|**Style**|**SCSS**||
|**Build Tool**|**Vite**||
|**Deployment**|**Vercel**||

<br />

## 🚀 Key Achievements & Growth (Core Documents)

Clock 프로젝트를 진행하면서 **디렉토리 구조 설계, 리팩토링, 성능 개선, 보안 이슈 대응 과정**에서의 **문제 분석 및 개선 기록**을 정리한 문서로 구성되어 있습니다.

<br />

**🏗️ Architecture & Clean Code**

- [**FSD 아키텍처 도입 배경**](./docs/fsd-architecture.md): 기존 **디렉토리 구조의 한계**를 분석하고, 확장성과 관심사 분리를 고려해 **FSD(Feature-Sliced Design) 아키텍처를 도입하게 된 배경**을 정리한 문서입니다.
- [**FSD 아키텍처 도입 이후 발생한 문제와 개선 과정**](./docs/fsd-problem.md): FSD 구조 도입 과정에서의 **이해 부족**과 **구조 설계 집착**으로 인해 **발생한 문제를 분석하고, 이를 어떻게 개선**했는지 정리한 문서입니다.
- [**도시 시간 계산 로직 리팩토링**](./docs/city-time-calculation-refactoring.md): 기존 도시 시간 계산 방식의 문제를 분석하고, **계산 로직을 재설계한 리팩토링 과정**을 단계적으로 정리한 문서입니다.
- [**Timer 로직 리팩토링**](./docs/timer-refactoring.md): 타이머 라우트에서 사용되는 `useTimer` 커스텀 훅의 **상태 관리 구조를 분석하고, 로직을 개선한 과정**을 정리한 문서입니다.
- [**헤더 제어 로직 리팩토링**](./docs/header-controls-refactoring.md): 기존 `useHeaderControls` 로직의 **책임 구조를 분석하고, 역할 분리 및 FSD 아키텍처 구조에 맞게 재구성한 과정**을 정리한 문서입니다.
- [**SCSS 구조 리팩토링**](./docs/scss-refactoring.md): 프로젝트 완료 이후 스타일시트 구조를 재분석하고, **유지보수성과 확장성을 고려해 SCSS 구조를 개선한 과정**을 정리한 문서입니다.

<br />

**⚡️ Performance & Optimization**

- [**Intl API 기반 도시 간 시차 계산 로직 리팩토링**](/docs/time-zone-convert-refactoring.md): 기존 **Convert Time Zone API의 네트워크 응답에 의존하던 시차 계산 구조**를 **Intl API 기반 클라이언트 계산 방식으로 리팩토링**하여, **네트워크 환경에 따른 응답 지연 문제를 개선**한 성능 최적화 과정을 정리한 문서입니다.
- [**Lighthouse SEO 점수 개선 및 Google Search Console 사이트 등록**](/docs/seo-optimization.md): 개발자 도구 Lighthouse를 활용해 **SEO 점수를 100점으로 개선**하고, 사이트를 **Google 및 Naver 검색엔진에 노출시키기 위한 선정 이유**와 **Google Search Console 등록 과정**을 정리한 문서입니다.

<br />

**🔐 Security**

- [**API Key 보호를 위한 Vercel 서버리스 함수 도입 과정**](/docs/vercel-functions-integration.md): 프로젝트 개발 완료 이후, **List Time Zone API의 API Key가 요청 경로에 노출되어 있던 문제**를 파악하고 이를 해결하기 위해 **Vercel 서버리스 함수를 도입한 과정**을 정리한 문서입니다. 또한 서버리스 함수 도입에 따라 기존 **IndexedDB 기반 브라우저 캐시 대체 방식**을 유지하지 않고, `Cache-Control` 응답 헤더를 활용한 **캐싱 전략 수정 과정**도 함께 다루고 있습니다.

<br />

## 📝 Troubleshooting

당시에는 **올바른 해결 과정이라고 판단해 문제 분석과 해결 과정을 기록한 문서**이지만, 이후 **오해와 전략 수정으로 기존 해결 방식이 무효화된 사례**입니다. 그럼에도 불구하고 당시 **문제 원인을 탐색하고 해결에 이르는 사고 과정**이 잘 드러나 있어 삭제하지 않고 보존하고 있습니다.

<br />

- [**파비콘 자원 재요청으로 인한 성능 최적화**](/docs/favicon-cahcing.md): **파비콘 파일명 오타로 인해 발생한 요청 이상 현상**을 분석한 기록 문서입니다. 실제 원인은 **단순한 오타**였지만, 원인을 인지하지 못한 상태로 문제를 추적하는 과정에서 **개발자 도구 기반 네트워크 분석 방법**과 **원인 가설을 검증해 나가는 판단 흐름**이 잘 드러나 있어 참고 목적의 기록으로 보존했습니다.
- [**동일한 데이터 재요청 문제 분석 및 IndexedDB 캐싱 도입 과정**](/docs/time-zone-db-list-request-caching.md): **Vercel 서비리스 함수 도입 이전**, **`Cache-Control` 부재로 인해 동일 API 응답이 반복 요청되던 구조적 문제**를 분석하고, 이를 완하하기 위해 **IndexedDB 기반 캐싱 전략을 설계･적용한 과정**을 정리한 문서입니다. 이후 **서버리스 함수 도입으로 캐싱 전략이 수정**되었지만, **상황에 맞는 해결 전략을 선택하는 문제 해결 과정**이 잘 나타나 있어 과정 기록으로서의 의미가 있다고 판단하여 그대로 유지했습니다.