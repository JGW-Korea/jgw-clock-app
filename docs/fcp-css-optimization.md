![FCP Thumbnail](./images/First-contentful-paint.jpg)

> ☝️ 이 문서에서는 Lighthouse Performance 감점 요인 중 CSS로 인한 Render blocking requests 항목을 주요 원인으로 판단한 근거와, 이를 개선하기 위한 과정을 정리했습니다.

<br />

## I. Render blocking requests 항목이 FCP 지연의 주요 원인이라고 판단한 이유

[｢Google Lighthouse 개선 | Lighthouse Performance 성능 개선｣](./google-lighthouse-upgrade.md/#iii-lighthouse-performance-성능-개선) 문서에서 Lighthouse Performance 감정 요인 중, 개인적으로 CSS로 인한 **Render blocking requests 항목**이 **FCP 측정 시점을 지연시키는 주요 원인**으로 보고 있다고 설명했습니다.

먼저 해당 감점 요인을 주요 원인으로 본 이유를 설명하기에 앞서 **브라우저 동작 및 렌더링 과정**을 살펴보겠습니다.

<br />

![브라우저 렌더링 과정](./images/browser-rendering.webp)

> 브라우저 동작･렌더링 과정에 대해 보다 자세한 내용은, 제 기술 블로그의 [｢Notion: 브라우저 동작 원리｣](https://gye-won.notion.site/Browser-Workflow-2ae88bd9c3fa80b8a33dc4b869c180ec?pvs=74) 포스트를 참고해 주시기 바랍니다.

<br />

많은 프론트엔드 개발자는 **브라우저의 동작 및 렌더링 과정을 이해한 상태에서 프로젝트를 진행**합니다. 브라우저 동작 및 렌더링 과정을 간단히 정리하면 다음과 같습니다.

<br />

1. 사용자가 URL에 최초 접속하면, 브라우저 구성 요소 중 사용자 인터페이스(UI)는 이를 감지하고 브라우저 엔진(UI와 렌더링 엔진 사이에서 동작을 중재하는 역할)에 전달합니다. 이후 브라우저 엔진은 해당 요청을 렌더링 엔진에 전달합니다.
1. URL을 전달받은 렌더링 엔진은 브라우저의 통신 모듈에 요청을 전달하고, 통신 모듈은 DNS 조회 및 TCP/IP 연결 과정을 거쳐 웹 서버로부터 HTML, CSS, JavaScript 등의 정적 자원을 전달받아 다시 렌더링 엔진에 전달합니다.
1. 렌더링 엔진은 전달받은 HTML과 CSS를 각각 DOM과 CSSOM으로 변환한 뒤 이를 결합하여 Render Tree를 생성합니다. 이후 요소의 크기와 위치를 계산하는 Layout 단계를 수행하고, 색상 및 그림자 등 시각적 속성을 픽셀 단위로 계산하는 Paint 작업을 수행합니다. 마지막으로 결과 레이어를 결합하는 Composite 단계를 거쳐 UI 백엔드로 전달합니다.
1. UI 백엔드는 Render Tree 기반 계산 결과를 바탕으로 GPU 및 OS 그래픽 시스템과 연동하여 실제 화면을 그리는 작업을 수행하며, 최종적으로 브라우저 뷰포트에 렌더링 결과가 출력됩니다.

<br />

브라우저 렌더링 과정을 보면 알 수 있듯이, HTML과 CSS는 **각각 DOM과 CSSOM으로 변환된 뒤 이를 결합하여 Render Tree를 생성**하고, 이를 기반으로 **최종적으로 사용자 화면에 URL에 맞는 페이지가 출력**됩니다.

즉 URL에 맞는 페이지를 화면에 출력하기 위해서는 DOM과 CSSOM을 결합한 **Render Tree 기반으로 모든 계산이 끝마친 결과물이 필요**합니다. 그렇기 때문에 DOM과 CSSOM을 구축하는 과정은 **실행 흐름이 보장되는 동기 방식으로 진행**됩니다.

조금 더 정확히 설명하면, 브라우저가 DOM을 해석하는 과정에 `<link>` 태그를 만나면 연결된 CSS 파일을 로드하고 **CSSOM을 동기적으로 구축**하게 됩니다. 이 과정에서 **DOM 파싱이 일시적으로 차단되며 렌더링 흐름이 지연**됩니다.

다만 CSSOM 구축으로 인해 렌더링 흐름이 지연된다고 해서 무조건 부정적으로만 볼 수는 없습니다. 만약 **CSSOM 구축이 비동기로 진행**되어 **완료되지 않은 상태에서 Render Tree 결합**이 이루어진다면 **스타일 정보가 누락된 상태로 Layout -> Paint -> Composite 단계가 진행되어 화면이 출력**될 수 있습니다.

이후 **누락된 스타일이 추가 반영**되면 브라우저는 **최종 계산된 스타일 값이 변경되었음을 감지하고 Reflow 및 Repaint 과정을 반복 수행**하게 됩니다. 결국 추가 연산이 지속적으로 발생하면서 **런타임 성능 저하**로 이어질 수 있습니다.

따라서 브라우저는 HTML 파싱 과정에서 CSSOM 구축을 동기적으로 완료한 이후 **DOM 파싱이 종료되면 Render Tree로 결합하고 화면을 출력**합니다. 이렇게 하면 이후 **추가 스타일 재계산이 최소화되어 성능 저하를 방지**할 수 있습니다.

물론 브라우저가 처리해야 할 **CSS 파일 수가 많거나 각 파일의 크기가 크다면 CSSOM 구축에 소요되는 시간 역시 증가**합니다. 이는 **최초 로딩 시 첫 번째 콘텐츠가 화면에 표시되는 시점(FCP)이 지연될 수 있는 원인**이 됩니다.

또한 Clock 서비스는 React 기반 SPA 애플리케이션이기 때문에 초기에는 빈 HTML 문서를 전달받고, `defer`로 인해 DOM 파싱이 완료된 이후  JavaScript 로직이 수행됩니다. 따라서 **최초 전달받은 HTML을 DOM으로 구축하는 과정**과, 이후 **Virtual DOM이 생성되어 실제 DOM에 반영되는 과정**이 **함께 발생**하게 됩니다.

이 과정 역시 결과적으로 **최초 로딩 시 콘텐츠가 화면에 표시되는 구간에 포함되기 때문에 FCP 지연의 원인**이 될 수 있습니다. 그렇기 때문에 Render blocking requests 항목을 **주요 원인으로 판단한 근거가 충분하지 않다고 느껴질 수 있어**, 개발자 도구 Performance 패널을 통해 **FCP 이전 구간을 보다 구체적으로 확인**해보겠습니다.

<br />

![Performance Panel Result Function calls](./images/lighthouse-performance-fcp-performance-function-calls-result.png)

<br />

Performance 결과를 보면 알 수 있듯이, 정확한 내용은 모르더라도 Network 탭의 **`index.xxx.css` 번들 CSS 파일의 작업이 끝난 이후**에 **다수의 함수 호출이 발생**하는 것을 볼 수 있습니다.

<br />

![Performance Panel Result Detail](./images/lighthouse-performance-fcp-performance-detail-result.png)

<br />

또한 해당 함수 호출 이후 **Frames 탭에서 초록색 구간이 표시**되는데, 이는 **실제 화면을 그리기까지 소요되는 시간 구간**이기 때문에 Virtual DOM을 구축한 이후 실제 DOM에 반영되는 과정으로 추정할 수 있습니다. 다만 Frames 구간을 확인해보면 **약 20.5ms 이후 바로 `/world` 페이지가 출력**되는 것을 확인할 수 있습니다.

<br />

![Performance Panel CSS Bundle Parsing Result](./images/lighthouse-performance-fcp-performance-css-bundle-parsing-result.png)

<br />

반면 Network 탭에서 **`index.xxx.css` 구간**을 확인해보면 **약 490.08ms 동안 지속되는 것을 확인**할 수 있습니다. 이 구간이 의미하는 바는 **Render Tree 결합을 위해 필요한 CSS 파일을 받아오는 과정**과, **응답 이후 CSSOM을 구축하는 데 소요되는 시간**을 포함한 구간을 나타냅니다.

따라서 Lighthouse Performance 감점 요인 중 Render blocking requests와 Reduce unused JavaScript 항목 **모두 FCP 지연 요인이 될 수는 있지만,** Reduce unused JavaScript 항목에 비해 **Render blocking requests 항목**이 **더 큰 지연을 발생시키는 원인으로 동작**하고 있기 때문에 **FCP 지연의 주요 원인이라고 판단**했습니다.

<br />

## II. 