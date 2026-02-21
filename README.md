## ⏰ JGW Clock App

> 🔗 [JGW Clock](https://jgw-clock-app.vercel.app/) 링크를 클릭하시면 Vercel을 통해 배포된 사이트로 이동하실 수 있습니다.

**JGW Clock App**은 **iPhone 시계 앱 UI/UX**를 참고해 **모바일 웹 환경**에 맞게 구현한 프로젝트입니다. <br />
프로젝트 개발 이후, **완성도를 높이기 위해 기존 코드를 분석**하고 **리팩토링**, **성능 최적화**, **보안성 개선**을 중심으로 **개선해 나간 과정**을 문서로 정리했습니다.

<br />

**■ JGW Clock - KPI(Key Performance Indicator)**

- [**Lighthouse 전 항목 100점 달성**](./docs/images/lighthouse-all-items-perfact-score.png) 및 **Google Search Console, Naver Search Advisor에 사이트 등록 완료**
- JavaScript 번들 총 592.54kB를 Vite의 Chunk 단위 코드 분할을 통해 **311.16kB(메인 번들)**, **111.88kB(GSAP 번들)**, **167.99kB(기타 패키지 번들)** 로 **분리**
- jsDelivr CDN 스타일 초기화 파일을 `global.scss`에 병합하여 **CSS 요청 수를 제거**하고, **FCP 측정 시점을 2.4s → 1.8s로 단축**
- **Vercel 서버리스 함수 도입**을 통해 **Time Zone API 요청 시 API Key 노출 문제를 해결**하고, **`Cache-Control` 기반 브라우저 캐시 전략을 적용하여 동일 List Time Zone API의 반복 요청 구조 개선**
- 두 도시 간 시차 계산 로직을 **Intl API 기반**으로 전환하여 **네트워크 의존성 제거**하고, 3G 환경에서 약 **2.04s 발생하던 UI 반영 지연 문제 개선**

<br />

## 📱 Live Demo

<img alt="JGW Clock App 시연 영상" src="./docs/images/clock-live-demo.gif" width="280px" />

<br />

## ⚙️ JGW Clock App - FE Skills

<table>
  <thead>
    <tr>
      <th><img width="128px" alt="React icon" src="https://www.svgrepo.com/show/452092/react.svg" /></th>
      <th><img width="128px" alt="TypeScript icon" src="https://www.svgrepo.com/show/303600/typescript-logo.svg" /></th>
      <th><img width="128px" alt="SCSS icon" src="https://www.svgrepo.com/show/374068/scss.svg" /></th>
      <th><img width="128px" alt="Vite icon" src="https://www.svgrepo.com/show/354521/vitejs.svg" /></th>
      <th><img width="128px" alt="Vercel icon" src="https://www.svgrepo.com/show/354512/vercel.svg" /></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><b>React</b></td>
      <td align="center"><b>TypeScript</b></td>
      <td align="center"><b>SCSS</b></td>
      <td align="center"><b>Vite</b></td>
      <td align="center"><b>Vercel</b></td>
    </tr>
  </tbody>
</table>

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

- [**Intl API 기반 도시 간 시차 계산 로직 리팩토링**](./docs/time-zone-convert-refactoring.md): 기존 **Convert Time Zone API의 네트워크 응답에 의존하던 시차 계산 구조**를 **Intl API 기반 클라이언트 계산 방식으로 리팩토링**하여, **네트워크 환경에 따른 응답 지연 문제를 개선**한 성능 최적화 과정을 정리한 문서입니다.

- [**Lighthouse SEO 점수 개선 및 Google Search Console 사이트 등록**](./docs/seo-optimization.md): 개발자 도구 Lighthouse를 활용해 **SEO 점수를 100점으로 개선**하고, 사이트를 **Google 및 Naver 검색엔진에 노출시키기 위한 선정 이유**와 **Google Search Console 등록 과정**을 정리한 문서입니다.

- [**Google Lighthouse 지표 개선**](./docs/google-lighthouse-upgrade.md): Clock 프로젝트 개발 완료 이후 Google Lighthouse를 활용해 100점을 달성하지 못한 **Performance**, **Accessibility** 항목의 **감점 요인을 분석한 내용을 정리한 문서**입니다. 해당 문서에는 **Accessibility 개선 과정만 다루었으며,** Performance 항목은 내용이 방대해 별도 문서에서 개선 과정을 정리했습니다.

- [**FCP 개선을 위한 CSS 최적화**](./docs/fcp-css-optimization.md): **CSS로 인한 FCP 측정 지연 원인을 분석**하고, **jsDelivr CDN 스타일 초기화 파일 요청의 불필요성을 검토한 뒤 요청 제거 과정**과 **CSS 번들 결과물의 파일 크기를 축소한 이유, 그리고 이에 대한 적합성을 판단**한 과정을 정리한 문서입니다.

- [**FCP 개선을 위한 JavaScript 최적화**](./docs/fcp-javascript-optimization.md): **JavaScript로 인한 FCP 측정 지연 원인을 분석**하고, **`rollup-plugin-visualizer`와 Vite의 Chunk 단위 코드 분할을 통해 메인 번들 결과물을 분리**한 과정, **`React.lazy()`를 활용해 FCP 측정 시점을 단축한 과정**을 정리한 문서입니다. 또한 **각 방법 적용에 따른 추가적인 이점과 단점을 분석**하고, 이에 대한 **합리적인 트레이드오프(Trade-off) 관계가 성립하는지**에 대한 내용도 함께 다루었습니다.

<br />

**🔐 Security**

- [**API Key 보호를 위한 Vercel 서버리스 함수 도입 과정**](./docs/vercel-functions-integration.md): 프로젝트 개발 완료 이후, **List Time Zone API의 API Key가 요청 경로에 노출되어 있던 문제**를 파악하고 이를 해결하기 위해 **Vercel 서버리스 함수를 도입한 과정**을 정리한 문서입니다. 또한 서버리스 함수 도입에 따라 기존 **IndexedDB 기반 브라우저 캐시 대체 방식**을 유지하지 않고, `Cache-Control` 응답 헤더를 활용한 **캐싱 전략 수정 과정**도 함께 다루고 있습니다.

<br />

## 📝 Troubleshooting

당시에는 **올바른 해결 과정이라고 판단해 문제 분석과 해결 과정을 기록한 문서**이지만, 이후 **오해와 전략 수정으로 기존 해결 방식이 무효화된 사례**입니다. 그럼에도 불구하고 당시 **문제 원인을 탐색하고 해결에 이르는 사고 과정**이 잘 드러나 있어 삭제하지 않고 보존하고 있습니다.

- [**파비콘 자원 재요청으로 인한 성능 최적화**](./docs/favicon-cahcing.md): **파비콘 파일명 오타로 인해 발생한 요청 이상 현상**을 분석한 기록 문서입니다. 실제 원인은 **단순한 오타**였지만, 원인을 인지하지 못한 상태로 문제를 추적하는 과정에서 **개발자 도구 기반 네트워크 분석 방법**과 **원인 가설을 검증해 나가는 판단 흐름**이 잘 드러나 있어 참고 목적의 기록으로 보존했습니다.

- [**동일한 데이터 재요청 문제 분석 및 IndexedDB 캐싱 도입 과정**](./docs/time-zone-db-list-request-caching.md): **Vercel 서버리스 함수 도입 이전**, **`Cache-Control` 부재로 인해 동일 API 응답이 반복 요청되던 구조적 문제**를 분석하고, 이를 완화하기 위해 **IndexedDB 기반 캐싱 전략을 설계･적용한 과정**을 정리한 문서입니다. 이후 **서버리스 함수 도입으로 캐싱 전략이 수정**되었지만, **상황에 맞는 해결 전략을 선택하는 문제 해결 과정**이 잘 나타나 있어 과정 기록으로서의 의미가 있다고 판단하여 그대로 유지했습니다.