![FCP Thumbnail](./images/fcp_first_contentful_paint.webp)

> ☝️ 이 문서에서는 Lighthouse Performance 감점 요인 중 JavaScript로 인한 Reduce unused JavaScript를 개선하기 위한 과정을 정리했습니다.

<br />

## I. Reduce unused JavaScript 항목으로 인해 FCP 지연이 발생하는 원인

[｢Google Lighthouse 개선 | Lighthouse Performance 성능 개선｣](./google-lighthouse-upgrade.md/#iii-lighthouse-performance-성능-개선) 문서에서 Lighthouse Performance 감점 요인 중, **Reduce unused JavaScript 항목**이 **FCP 측정 시점을 지연시키는 주요 원인 중 하나**라고 설명했습니다.

먼저 이전 [｢Google Lighthouse 개선 | Lighthouse Performance 점수 94점 측정 원인｣](./google-lighthouse-upgrade.md/#b-lighthouse-performance-점수-94점-측정-원인) 문서에서는 **Reduce unused JavaScript를 발생시키는 `.js` 파일의 종류를 확인**했지만, **해당 문서에서는 다루지 않았기 때문에 어떤 자원으로 인해 사용되지 않는 JavaScript 로직이 포함되어 있는지 다시 확인**해보겠습니다.

<br />

![Clock Lighthouse Performance Reduce unused JavaScript](./images/clock-lighthouse-performance-reduce-unused-JavaScript.png)

<br />

위 이미지를 통해 사용되지 않는 JavaScript가 포함된 파일은 **번들링된 JavaScript 파일 단 하나**라는 것을 확인할 수 있습니다. 즉 **번들링 결과물에 최초 로드 시점에서 실제로 사용되지 않는 코드가 함께 포함**되어 있기 때문에, 해당 항목이 **감점 요인으로 작용**한다는 것을 알 수 있습니다.

그렇다면 여러 개의 JavaScript 파일이 **하나의 번들 결과물로 구성**되었을 때, 개발자 도구 Performance 패널을 통해 **FCP 측정 이전 구간을 확인**해보겠습니다.

<br />

![FCP 측정 이전 Performance 결과](./images/reduce-unused-javascript-fcp-before-results.png)

<br />

Performance 결과를 확인해보면, 난독화로 인해 정확히 어떤 함수들이 호출되는지는 식별하기 어렵지만, **FCP 측정 시점 바로 이전 구간**에서 스크린샷 이미지에 모두 담기지 않을 만큼 **매우 많은 함수들이 호출된 이후에 최초 로딩 이후 첫 번째 콘텐츠가 표시**되고 있음을 확인할 수 있습니다.

사실 난독화로 인해 정확히 어떤 함수들인지는 식별하기 어렵지만, **FCP는 최초 로딩 이후 첫 번째 콘텐츠가 화면에 표시되는 시점을 의미**합니다. 즉 여기서 중요한 표현은 **"최초 로딩 이후"** 라는 점입니다. 이 표현이 중요한 이유는 **React가 SPA + CSR 기반으로 동작하는 라이브러리**이기 때문입니다. 이를 정확히 이해하기 위해서는 **SPA 기반 웹 애플리케이션에서 화면이 출력되는 동작 과정을 이해**할 필요가 있으므로, 해당 과정을 간단히 살펴보겠습니다.

> React의 Virtual DOM 기반 SPA + CSR 웹 애플리케이션 동작 과정을 기준으로 설명합니다.

<br />

![SPA Rendering](./images/single-page-application-rendering.png)

<br />

일반적으로 SPA 기반 웹 애플리케이션은 서버로부터 **HTML 문서 하나**와, **화면 구성을 위한 `<link>`, `<script>` 태그에 연결된 모든 정적 자원**을 **최초에 함께 요청**하게 됩니다.

이후 브라우저는 전달받은 HTML 문서와 CSS를 기반으로 **DOM과 CSSOM을 각각 구축하고, 이를 결합하여 Render Tree를 구성**합니다. 하지만 전달받은 HTML 문서에는 **`<div id="root"></div>`만 존재하기 때문에 초기에는 사용자에게 하얀 화면(White Screen)이 노출**됩니다.

이때 **`<script>` 태그에 연결된 JavaScript 로직이 실행**되면서, 메모리 상에서 JavaScript 객체 형태로 관리되는 실제 DOM을 추상화한 **Virtual DOM을 구축**하게 됩니다. 이 과정에서 **React로 작성된 컴포넌트 로직이 `React.createElement()` 호출을 통해 Virtual Element를 생성하고, 이를 결합하여 하나의 Virtual DOM을 구성**하게 됩니다.

이후 구축된 Virtual DOM을 HTML 문서에서 전달받은 **대상 요소(`<div id="root" />`)에 반영하여 실제 DOM을 재구성**하게 되며, **다시 Render Tree를 생성한 뒤 최종적으로 사용자 화면에 UI가 표시**됩니다.

<br />

![SPA White screen after rendering](./images/spa-white-screen-after-rendering.png)

<br />

이로 인해 최초 접속 시 화면 생성을 위한 자원을 모두 요청하고, Virtual DOM을 구축하기 전까지 하얀 화면이 노출되며, Virtual DOM 생성을 위한 다양한 함수 호출로 인해 **초기 렌더링이 지연되는 단점이 존재**합니다. 반면 Virtual DOM 구축 이후에는 **DOM 변경이 발생하더라도 재조정(Reconciliation) 과정을 통해 변경된 요소만 갱신**되며 **페이지 전체가 다시 로드되지 않기 때문에, 모바일 퍼스트(Mobile-First) 전략에 유리**하다는 장점이 있습니다.

즉 Clock 웹 애플리케이션과 같은 React 기반 프로젝트에서 **FCP 측정 시점 직전 구간에 매우 많은 함수 호출이 발생한 이유**는, 최초 로딩 이후 **Virtual DOM을 구축하기 위해 `React.createElement()`가 반복 호출되며 Virtual Element를 생성하는 과정을 거치기 때문**입니다.

<br />

![SPA Virtual DOM many function calls](./images/spa-virtual-dom-many-function-calls.png)

<br />

렌더링 측면에서는 명확한 장단점이 존재하지만, 현재 **Reduce unused JavaScript 관점**에서 보면 연결된 **모든 정적 자원을 최초에 요청하게 되므로 다수의 네트워크 요청이 발생**하고, 이는 **Virtual DOM 구축 시점을 지연시키는 동시에 불필요한 JavaScript 로직 실행을 유발**하게 됩니다.

이때 **최초 Virtual DOM 구축 자체는 현재 URL에 매칭된 라우트에 대해서만 수행**되지만, **URL 변경 시에는 기존에 전달받은 JavaScript 파일을 기반으로 해당 라우트에 맞는 Virtual DOM을 다시 구축**하게 됩니다. 즉 **현재 시점에 필요하지 않은 JavaScript 파일까지 함께 전달받게 되는 구조**입니다.

또한 **외부 패키지를 사용하는 경우**, 현재 화면에서 직접 사용되지 않더라도 **다른 JavaScript 모듈에서 해당 패키지를 참조**하고 있다면 **해당 모듈 파일이 함께 전달되므로 Reduce unused JavaScript 문제가 더욱 커지게 됩니다.**

<br />

![SPA Many requests javascript resources](./images/spa-many-requests-javascript-resources.png)

<br />

즉 React와 같은 SPA + CSR 조합의 웹 애플리케이션에서는 **구조적인 한계**로 인해 Reduce unused JavaScript로 인해 발생하는 **FCP 측정 시점을 단축시키는 데에는 명확한 한계가 존재**합니다.

이를 개선하기 위해서는 **`React.lazy()`를 통해 해당 컴포넌트가 실제로 화면에 노출되는 시점에 관련 파일을 로드하도록 구성**하거나, **SSR 렌더링 방식으로 전환하여 현재 시점에 필요한 HTML 문서와 CSS, JavaScript 정적 자원만을 전달받는 구조로 변경**할 필요가 있습니다.

그렇기 때문에 본 문서에서는 **구조적 한계가 무엇인지** 짚어보고, 그럼에도 불구하고 **FCP 시점을 단축시켜 Lighthouse Performance 점수를 100점으로 개선한 과정**을 다뤄보겠습니다.

<br />

## II. SPA + CSR 환경에서 Reduce unused JavaScript로 인한 FCP 측정 시점 단축의 구조적 한계

앞서 [｢Reduce unused JavaScript 항목으로 인해 FCP 지연이 발생하는 원인｣](#i-reduce-unused-javascript-항목으로-인해-fcp-지연이-발생하는-원인) 목차에서 React 기반의 SPA + CSR 환경에서는 **모든 정적 자원을 최초에 요청**하게 되므로, **현재 시점에 필요하지 않은 JavaScript 파일까지 함께 전달받는 구조**가 된다고 설명했습니다.

이로 인해 **다수의 네트워크 요청이 발생**하며, **응답을 받기 전까지 Virtual DOM 구축 시점이 지연**된다고 했습니다. 또한 **불필요한 JavaScript 실행까지 함께 발생**한다고 설명했습니다.

하지만 다수의 네트워크 요청이 발생하는 문제는 **번들링(Bundling)을 통해 일정 부분 완화**할 수 있습니다. 여러 개의 JavaScript 파일을 **하나의 번들 파일로 생성하여 단일 네트워크 요청 구조로 전환**할 수 있기 때문입니다. 또한 Vite는 빌드 단계에서 번들 결과물의 안전성을 높이기 위해 ESBuild보다 느리지만 안정적인 Rollup을 사용하여 난독화, 트리셰이킹, 압축 등의 과정을 거쳐 **최적화된 번들 결과물을 생성**합니다.

<br />

![Bundler](./images/bundler.png)

<br />

이로 인해 실제로 개발 서버(Dev Server)가 아닌 **배포 서버(Production Server)에 접속**하면, **개발 서버와 달리 하나의 번들 파일만 전달받는 구조임을 확인**할 수 있습니다.

<br />

![Product Server Network Results](./images/product-server-network-result.png)

<br />

하지만 SPA + CSR 환경에서는 **여러 개의 자원을 개별적으로 전달받는 구조**이든, **하나의 파일로 번들링된 자원을 전달받는 구조**이든 **"현재 시점"에 필요하지 않더라도 모든 자원을 요청하는 구조라는 점은 동일**합니다. 이에 대해 보다 정확히 확인하기 위해, 앞서 개발 서버에서 최초 접속 시 여러 개의 자원을 전달받는 구조임을 확인했으므로 **`rollup-plugin-visualizer` 패키지를 설치하여 JavaScript 번들링 결과물의 구조를 확인**해보겠습니다.

<br />

```md
09:19:47.161 | dist/index.html                              2.27 kB │ gzip:   0.87 kB
09:19:47.162 | dist/assets/SF_Pro-Bold-7QsjyyjH.woff2      98.32 kB
09:19:47.162 | dist/assets/SF_Pro-Regular-D7lx-8SM.woff2  102.66 kB
09:19:47.162 | dist/assets/SF_Pro-Light-CWkfg6lM.woff2    113.46 kB
09:19:47.163 | dist/assets/index-TXEuhWPf.css              23.48 kB │ gzip:   4.76 kB
09:19:47.163 | dist/assets/index-D32C65n_.js              592.54 kB │ gzip: 204.36 kB

⚠️ Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
...
```

> 위 코드 블록은 번들 결과를 분리하기 이전의 Deployment 로그를 보기 쉽게 Markdown 형식으로 정리한 내용입니다. 실제 Deployment 결과는 [여기](./images/no-chunk-bundle-result-visualizer-deployment-logs.png)에서 확인할 수 있습니다.

<br />

![No Chunk Bundle Result Visualizer](./images/no-chunk-bundle-result-visualizer.png)

<br />

번들링 결과물의 구조를 확인해보면 **`index-D32C65n_.js` 번들 파일 내부**에는 프로젝트 과정에서 작성한 **모든 JavaScript 로직**과 더불어, **사용 중인 패키지** 등 **모든 JavaScript 모듈이 함께 포함된 구조**임을 확인할 수 있습니다.

즉 **하나의 번들 자원을 전달**받더라도, 해당 파일 내부에는 **모든 JavaScript 로직이 포함되어 있어 최초 접속 시점에 필요하지 않은 로직 역시 함께 존재**하게 됩니다.

Vite에서는 번들 자원을 **여러 개의 작은 조각(Chunk)으로 분리할 수 있는 기능을 제공**합니다. 그렇다면 이 번들 결과물을 작은 조각으로 나눌 경우, 최초 접속 시점에 필요하지 않은 로직을 분리할 수 있는지 확인하기 위해 Vite 빌드 설정을 다음과 같이 수정을 해보겠습니다.

<br />

```tsx
// vite.config.ts 번들 결과 작은 조각으로 분리
// https://vite.dev/config/
export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if(id.includes("react") || id.includes("scheduler")) { // React 관련 로직은 메인 번들에 포함
            return;
          }
          if(id.includes("gsap")) { // GSAP 패키지는 용량이 크기 때문에 별도 Chunk로 분리
            return "vendor-gsap";
          }
          if(id.includes("node_modules") || id.includes(".yarn")) { // 기타 패키지는 별도 Chunk로 분리
            return "vendor-libs";
          }
        }
      }
    },
  }
});
```

<br />

```md
00:55:12.696 | dist/index.html                              2.43 kB │ gzip:   0.92 kB
00:55:12.696 | dist/assets/SF_Pro-Bold-7QsjyyjH.woff2      98.32 kB
00:55:12.697 | dist/assets/SF_Pro-Regular-D7lx-8SM.woff2  102.66 kB
00:55:12.702 | dist/assets/SF_Pro-Light-CWkfg6lM.woff2    113.46 kB
00:55:12.702 | dist/assets/index-TXEuhWPf.css              23.48 kB │ gzip:   4.76 kB
00:55:12.702 | dist/assets/vendor-gsap-BBM_9RY7.js        111.88 kB │ gzip:  42.98 kB   # Chunk 단위로 분리한 GSAP 패키지 번들 자원
00:55:12.703 | dist/assets/vendor-libs-DxHqpy7U.js        167.99 kB │ gzip:  57.93 kB   # Chunk 단위로 분리한 기타 패키지 번들 자원
00:55:12.703 | dist/assets/index-BCq25VZB.js              311.16 kB │ gzip: 101.94 kB   # 메인 번들 자원
...
```

> 위 코드 블록은 번들 결과를 분리하기 이후의 Deployment 로그를 보기 쉽게 Markdown 형식으로 정리한 내용입니다. 실제 Deployment 결과는 [여기](./images/no-chunk-bundle-result-visualizer-deployment-logs.png)에서 확인할 수 있습니다.

<br />

![Bundle Result Chunk Visualizer](./images/bundle-result-chunk-visualizer.png)

<br />

이와 같이 번들 자원을 **여러 개의 작은 조각(Chunk)으로 분리한 뒤, 배포 서버로 이동하여 개발자 도구 Network 탭에서 실제 요청 구조**를 확인해보겠습니다.

<br />

![Bundle Result Chunk Visualizer after Network](./images/bundle-result-chunk-visualizer-after-network.png)

<br />

Network 탭에서 결과를 확인해보면 **번들 자원을 여러 개의 작은 조각(Chunk)으로 분리**하더라도, SPA 구조에서는 **최초 접속 시 모든 자원을 함께 요청**하게 되므로 **메인 번들 자원뿐만 아니라 분리된 Chunk 자원들까지 동시에 요청**되고 있음을 확인할 수 있습니다.

보다 더 자세한 결과를 확인하기 위해 **개발자 도구 Performance 패널을 통해 최초 접속 과정에서 어떤 일이 발생**하는 살펴보겠습니다.

<br />

![Bundle Result Chunk Visualizer after Performance](./images/bundle-result-chunk-visualizer-after-performance.png)

<br />

Performance 탭에서 결과를 확인해보면, 앞서 개발 서버에서 다수의 네트워크 요청이 발생했던 과정과 유사하게 **메인 번들 결과물과 더불어 분리된 Chunk 자원들 역시 동일한 시점에 네트워크 요청이 발생**하며, **모든 응답을 받은 이후 Virtual DOM을 구축하기 위한 다양한 함수가 호출**되고 있음을 확인할 수 있습니다.

또한 여러 차례 언급했듯이 Virtual DOM 구축 과정 자체는 현재 URL에 매칭된 라우트에 대해서만 수행되지만, **전달받은 JavaScript 로직은 실행을 위한 준비 상태까지 진행**된다고 했습니다. 그렇기 때문에 Performance 결과에서 **빨간색으로 하이라이팅된 영역**을 확인해보면 **`vendor-gsap`으로 분리한 Chunk 내부의 `GSAP.registerPlugin()` 함수가 호출**되는 것을 확인할 수 있습니다.

즉 JavaScript 번들 결과물을 **여러 개의 작은 조각(Chunk) 단위로 분리**하더라도, **SPA + CSR 구조에서는 최초 접속 시 필요한 모든 정적 자원을 서버에 요청**하게 되며 동시에 **JavaScript 로직 실행을 위한 준비 과정까지 수행**됩니다. 결과적으로 **현재 시점에 사용되지 않는 JavaScript 모듈이 포함되는 구조**이기 때문에 **Reduce unused JavaScript 문제를 명확히 해결하기 어려운 구조적 한계가 존재**합니다.

<br />

## III. 그럼에도 FCP 시점을 단축시키는 방법

