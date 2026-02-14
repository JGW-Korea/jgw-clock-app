![Google Lighthouse Thumbnail](./images/google-lighthouse-thumbnail.jpeg)

> ☝️ 이 문서는 프로젝트 개발 완료 이후 일부 성능 최적화를 적용한 뒤, 배포 서버의 Clock 서비스를 대상으로 Google 개발자 도구에서 제공하는 Lighthouse를 활용하여 전체 보고서 점수를 100점으로 개선한 과정을 설명한 문서입니다.

<br />

## I. Google Lighthouse란?

Google에서 제작한 Chrome 개발자 도구에서는 Lighthouse라는 분석 도구를 제공합니다. Lighthouse는 Navigation, Timespan, Snapshot과 같은 다양한 측정 모드를 제공하지만, 일반적으로는 **Navigation 모드를 통해 페이지 최초 로드 시점의 전체 보고서를 생성하는 용도**로 가장 많이 활용됩니다.

왜냐하면 Timespan과 Snapshot 모드는 **일부 카테고리를 선택할 수 없는 제한**이 있으며, 보다 **정밀한 성능 분석이 필요한 경우**에는 Chrome 개발자 도구의 **Performance, Memory 패널을 통해 세부 측정을 수행**하는 것이 더 적절하기 때문입니다.

반면 **Navigation 모드**는 **페이지 최초 로드 시 Performance, Accessibility, Best Practices, SEO 등 전체 카테고리에 대한 종합 보고서를 생성**해주기 때문에, **FCP(First Contentful Paint)와 같은 로딩 성능 지표**뿐만 아니라 접근성, 웹 표준, SEO 등 **웹 개발 원칙을 준수하며 개발**이 이루어졌는지도 **함께 확인**할 수 있습니다.

<br />

> Google Lighthouse에 자세한 내용은 제 노션의 [｢개발자 도구 | Lighthouse｣](https://gye-won.notion.site/Lighthouse-2b488bd9c3fa80e19dcfcc12df891c2e?pvs=74)에서 확인하실 수 있습니다.

<br />

하지만 주의해야 될 점은 **Google Lighthouse 보고서가 100% 정확한 결과를 제공하는 것은 아니라는 점**입니다. 해당 출처(Origin)에 저장된 쿠키, 캐시 정보와 사용자의 방문 기록, 확장 프로그램 등과 같은 **외부 요인의 영향을 받을 수 있습니다.** 또한 이러한 외부 요인을 제외하더라도 **보고서 결과는 어디까지나 정량적 기준에 따라 산출**됩니다.

예를 들어 SEO 우선순위를 높이기 위해서는 [｢Lighthouse SEO 점수 개선 및 Google Search Console 사이트 등록｣](./seo-optimization.md) 문서에서 확인할 수 있듯이, 개발 관점만으로 달성할 수 있는 영역이 아닙니다. 보유한 백링크 규모, 브랜드 신뢰도 등 **마케팅･브랜딩 영역과의 협업이 함께 이루어져야 실제 검색 노출 우선순위를 높일 수 있습니다.** 하지만 Google Lighthouse는 **HTML 문서의 메타데이터 구성, `robots.txt` 파일 존재 여부** 등 **개발 관점의 요소를 중심으로만 점수를 산정**합니다.

이처럼 Lighthouse 결과는 절대적 지표가 아니며, 이러한 한계를 이해한 상태에서 활용할 필요가 있습니다. 실제 운영 중인 대규모 서비스의 경우 프로젝트 규모와 구조가 복잡하기 때문에, Lighthouse와 같은 정량적 지표보다 **실제 사용자에게 제공되는 런타임 성능을 더욱 중요하게 고려**합니다. 이로 인해 Lighthouse 점수를 측정하더라도 **모든 항목에서 100점을 달성한 사례는 드문 편**입니다.

<br />

![Toss Invest Lighthouse Result](./images/toss-invest-lighthouse-result.png)

![Naver Lighthouse Result](./images/naver-lighthouse-result.png)

<br />

다만 현재 Clock 서비스와 같이 실제 운영 서비스가 아닌 포트폴리오 성격의 프로젝트에서는 이러한 **정량적 지표를 개선하는 과정 자체가 중요한 학습 요소**가 된다고 생각합니다. 따라서 해당 문서에서는 **Lighthouse 전체 측정 지표를 100점 기준으로 개선한 과정**을 작성했습니다.

<br />

## II. Clock 사이트 Lighthouse 결과

Lighthouse 측정은 **프로젝트 개발 완료 이후 일부 성능 최적화를 적용**한 뒤, Vercel을 통해 **배포한 Clock 사이트를 대상**으로 **진행**했습니다.

또한 Google Lighthouse는 앞서 [｢Google Lighthouse란?｣](#i-google-lighthouse란) 목차에서 설명했듯이 **다양한 외부 요인이 반영된 정량적 결과 보고서를 제공**합니다. 이에 따라 **Google Chrome 시크릿 모드를 통해 외부 요인을 최대한 배제한 환경에서 측정을 진행**했습니다.

<br />

![Clock Lighthouse 개선 이전 결과](./images/clock-optimization-befor-lighthouse-result.png)

<br />

위 사진에서 확인할 수 있듯이 **Lighthouse 개선 이전 결과**는 **모든 항목이 90~100점 범위로 측정**되어 예상보다 양호한 점수로 나타났습니다.

> Lighthouse SEO 점수를 100점으로 개선한 과정은 [｢Lighthouse SEO 점수 개선 및 Google Search Console 사이트 등록｣](./seo-optimization.md) 문서에서 확인할 수 있습니다.

하지만 Performnace와 Accessibility 점수가 100점이 아닌 90점대로 유지되는 원인을 살펴보기 전에, Vercel을 통해 **배포한 사이트 환경**에서 **Lighthouse 결과를 측정하는 이유에 대해 먼저 설명**한 뒤, **각 점수가 90점대로 유지되는 원인을 이어서 살펴보겠습니다.**

<br />

### A. 배포한 사이트 환경에서 Lighthosue 결과 측정 이유

Node.js의 등장은 프론트엔드 개발 환경에 큰 변화를 가져왔습니다. 그중 하나가 바로 **모듈 시스템(Module System)의 등장**입니다. 본래 JavaScript는 자체적인 모듈 시스템을 제공하지 않았습니다. 하지만 Node.js는 브라우저 외부 환경에서 JavaScript 코드를 해석할 수 있도록 설계된 런타임 환경입니다.

이로 인해 JavaScript를 활용한 서버 사이드 개발이 가능해졌습니다. 다만 기존 JavaScript는 모듈 시스템을 제공하지 않았기 때문에, **Node.js 런타임 환경에서는 자체적으로 CommonJS 모듈 시스템을 제공**하여 **모듈 기반 프로젝트를 구성**할 수 있도록 지원했습니다.

<br />

![CommonJS Module System](./images/commonjs-module-system.webp)

<br />

이후 프론트엔드 개발 규모가 점차 커지면서, 하나의 HTML 문서 실행 컨텍스트 내에서 동작하던 JavaScript 구조는 **"전역 변수 오염"과 "의존성 관리의 복잡성" 문제를 야기**하게 되었고, 이에 따라 **브라우저 환경에서도 모듈 시스템의 필요성이 점차 커지게 되었습니다.**

이 과정에서 브라우저 환경의 **비동기 로딩을 지원하는 AMD**, 그리고 **CommonJS와 AMD를 모두 지원하는 UMD** 모듈 시스템이 등장했습니다. 다만 이들은 JavaScript 표준이 아닌 **패키지 형태**였기 때문에 ((버전 변화에 따른 사용 방식 차이, 그리고 장기 지원에 대한 불확실성이라는 한계가 존재))했습니다.

결국 ES6 표준안에서 **ESModule(ESM) 방식이 공식 모듈 시스템으로 채택**되면서, **브라우저 환경에서도 표준 기반 모듈 시스템을 사용**할 수 있게 되었습니다. 그러나 모듈이 증가한다는 것은 곧 **하나의 페이지에서 로드해야 할 JavaScript 파일 수가 늘어난다는 의미**이기도 합니다.

<br />

![ESModule Module System](./images/esm-module-system.webp)

<br />

또한 **UI/UX 및 디자인 요소의 중요성이 커지면서**, CSS, 폰트, 이미지 등 **다양한 정적 자원의 수가 함께 증가**하게 되었습니다. 그 결과 **프로젝트 규모가 커질수록 다수의 JavaScript, CSS, 폰트, 이미지 파일 요청이 발생**하게 되었고, DX(Developer Experience)는 향상된 반면 **초기 로딩 성능 저하로 UX(User Experience)가 감소하는 문제**가 발생했습니다.

이러한 문제를 해결하기 인해 빌드 과정에서 다수의 파일을 하나로 묶어주는 **번들링 도구(Webpack, Parcel, ESBuild, Rollup 등)가 등장**하게 되었습니다. 번들링 도구는 단순 파일 결합을 넘어 압축, 난독화, 트리 셰이킹 등의 **최적화 과정을 수행하여 파일의 크기를 감소시키는 역할도 수행**합니다.

이로 인해 Node.js 기반 개발 서버 환경에서 Lighthouse 결과를 측정할 경우, 다음 이미지와 같이 **번들링이 수행되지 않은 상태**에서 **다수의 자원을 네트워크로 로드한 뒤 렌더링이 이루어지기 때문에 Performance 결과가 상대적으로 낮게 측정**됩니다.

<br />

![Dev Server Network Result](./images/dev-server-network-result.png)

![Dev Server Lighthouse Result](./images/dev-server-lighthouse-result.png)

<br />

따라서 Lighthouse 결과를 측정할 때에는 개발 서버 환경이 아닌, 빌드 및 최적화가 완료된 **실제 사용자 이용 환경을 기준으로 측정하는 것이 정량적 지표를 보다 현실적으로 반영**할 수 있습니다. 이러한 이유로 배포된 사이트 환경에서 Lighthouse 측정을 진행했습니다.

<br />

![Product Server Network Result](./images/product-server-network-result.png)

![Product Server Lighthouse Result](./images/product-server-lighthouse-result.png)

<br />

### B. Lighthouse Performance 점수 94점 측정 원인

![Clock Lighthouse Performance Summary Result](./images/clock-lighthouse-performance-summary-result.png)

<br />

먼저 Lighthouse의 Performance 요약 결과를 살펴보면 **여러 개의 측정 지표**가 있습니다. 해당 지표들의 의미는 다음과 같습니다.

- **First Contentful Paint**: 최초 로딩 시 **첫 번째 콘텐츠가 화면에 표시되는 시점**을 의미합니다. (🟡 결과: 2.4s)
- **Largest Contentful Paint**: 최초 로딩 시 **주요 콘텐츠가 화면에 표시되는 시점**을 의미합니다. (🟢 결과: 2.5s)
- **Total Blocking Time**: FCP 이후 JavaScript 실행 등으로 인해 **메인 스레드가 차단되어 사용자 입력에 즉시 반응하지 못한 누적 시간**을 의미합니다. (🟢 결과: 0ms)
- **Cumulative Layout Shift**: **페이지 로딩 과정에서 발생한 레이아웃 이동의 누적 횟수**를 의미합니다. (🟢 결과: 0)
- **Speed Index**: 페이지 콘텐츠가 **시각적으로 표시되는 속도를 종합적으로 평가한 지표**를 의미합니다. (🟢 결과: 2.4s)

<br />

![Clock Lighthouse Performance Summary Result](./images/clock-lighthouse-performance-list-result.png)

<br />

다음으로 Lighthouse의 Performance 감점 요인 리스트를 살펴보면, **다음과 같은 항목이 감점 요인으로 반영**된 것을 확인할 수 있습니다.

- Render blocking requests
- Network dependency tree
- Reduce unused JavaScript

다만 리스트 결과만으로는 정확한 감점 원인을 파악하기 어렵기 때문에, **각 감점 항목의 탭을 활성화하여 세부 원인을 살펴보겠습니다.**

<br />

**① Render blocking requests**

![Clock Lighthouse Performance Render blocking requests](./images/clock-lighthouse-performance-render-blocking-requests.png)

<br />

"Render blocking requests"를 번역하면 **"렌더링 흐름을 차단하는 네트워크 요청 자원이 존재한다."** 는 의미입니다.

이를 이해하고 탭을 활성화하여 세부 원인을 살펴보면, **vercel.app에서 전달받은 `/assets/index.xxx.css` 번들 CSS 파일**과 **JSDelivr CDN에서 제공되는 `reset-css@5.0.2/reset.min.css`** 이 **초기 렌더링 과정에서 렌더링 흐름을 지연시키는 요인으로 반영**된 것을 확인할 수 있습니다.

또한 세부 원인 우측에 **FCP**, **LCP**, **Unscored**라는 **Chip UI가 표시**되는 것을 확인할 수 있으며, 각 항목의 의미는 다음과 같습니다.

- **FCP**: Lighthouse Performnace 지표 중 **FCP(First Contentful Paint)에 영향을 줄 수 있음**을 의미합니다.
- **LCP**: Lighthouse Performnace 지표 중 **LCP(Largest Contentful Paint)에 영향을 줄 수 있음**을 의미합니다.
- **Unscored**: 해당 항목은 Lighthouse 보고서에 포함되지만, **전체 점수 산정에는 직접 반영되지 않음**을 의미합니다.

<br />

**② Network dependency tree**

![Clock Lighthouse Performance Network dependency tree](./images/clock-lighthouse-performance-network-dependency-tree.png)

<br />

"Network dependency tree"를 번역하면 **"네트워크 요청 간 의존 관계 구조를 나타낸다."** 라는 의미입니다.

이를 이해하고 탭을 활성화하여 **경고(노란색)로 표시된 항목**을 확인해보면, JGW Clock 페이지 최초 접속 시 **브라우저가 웹 서버에 HTML 문서를 요청**한 뒤, 해당 문서에 연결된 **스크립트 파일을 JavaScript 엔진이 해석하는 과정**에서 **`GET /timezone/list` API 요청이 발생**하는 것을 확인할 수 있습니다. 또한 **해당 API 요청의 응답이 완료되기까지**의 **전체 소요 시간이 약 733ms로 측정**된 것을 확인할 수 있습니다.

또한 세부 원인 우측에 **LCP**, **Unscored**라는 **Chip UI가 표시**되는 것을 확인할 수 있으며, 각 항목의 의미는 다음과 같습니다.

- **LCP**: Lighthouse Performnace 지표 중 **LCP(Largest Contentful Paint)에 영향을 줄 수 있음**을 의미합니다.
- **Unscored**: 해당 항목은 Lighthouse 보고서에 포함되지만, **전체 점수 산정에는 직접 반영되지 않음**을 의미합니다.

<br />

**③ Reduce unused JavaScript**

![Clock Lighthouse Performance Reduce unused JavaScript](./images/clock-lighthouse-performance-reduce-unused-JavaScript.png)

<br />

"Reduce unused JavaScript"를 번역하면 **"사용되지 않는 JavaScript 코드가 존재한다."** 라는 의미입니다.

이를 이해하고 탭을 활성화하여 세부 원인을 살펴보면, **`/assets/index-xxx.js` 번들 파일**에서 **사용되지 않는 JavaScript 코드가 포함되어 있어 불필요한 네트워크 전송이 발생**하고 있음을 확인할 수 있습니다. 따라서 **사용되지 않는 코드를 제거**하거나, **필요 시점까지 스크립트 로딩을 지연(defer)** 시켜 **불필요한 네트워크 사용량을 줄일 것을 권장**하는 항목입니다.

또한 세부 원인 우측에 **FCP**, **LCP**, **Unscored**라는 **Chip UI가 표시**되는 것을 확인할 수 있으며, 각 항목의 의미는 다음과 같습니다.

- **FCP**: Lighthouse Performnace 지표 중 **FCP(First Contentful Paint)에 영향을 줄 수 있음**을 의미합니다.
- **LCP**: Lighthouse Performnace 지표 중 **LCP(Largest Contentful Paint)에 영향을 줄 수 있음**을 의미합니다.
- **Unscored**: 해당 항목은 Lighthouse 보고서에 포함되지만, **전체 점수 산정에는 직접 반영되지 않음**을 의미합니다.

<br />

### C. Lighthouse Accessibility 점수 93점 측정 원인

![Clock Lighthouse Accessibility Result](./images/clock-lighthouse-accessibility-result.png)

<br />

Lighthouse의 Accessibility 감점 요인 리스트를 살펴보면, **"Buttons do not have an accessible name"** 항목 하나만 **감점 요인으로 반영**된 것을 확인할 수 있습니다.

다만 리스트 제목만으로는 정확한 감점 원인을 파악하기 어렵기 때문에, 해당 **감점 항목의 탭을 활성화하여 세부 원인을 살펴보겠습니다.**

<br />

**① Buttons do not have an accessible name**

![Clock Lighthouse Accessibility Buttons do not have an accessible name](./images/clock-lighthouse-accessibility-buttons-do-not-have-an-accessible-name.png)

<br />

"Buttons do not have an accessible name"를 번역하면 **"버튼 요소에 접근 가능한 이름(Accessible Name)이 존재하지 않는다"** 는 의미입니다.

이를 이해하고 탭을 활성화하여 세부 원인을 살펴보면, **`button._header-button_1g6qn_8.undefined.liquid-glass.fast` 클래스를 가진 `<button>` 요소**가 **스크린 리더**에서 단순히 **"button"으로만 인식**될 수 있기 때문에, 해당 **버튼의 역할을 명확히 전달할 수 있는 접근성 이름을 제공**해야 한다는 것을 확인할 수 있습니다.

<br />

## III. Lighthouse Performance 성능 개선

먼저 Lighthouse Performance 성능 개선을 진행하기에 앞서, [｢Lighthouse Performance 점수 94점 측정 원인｣](#b-lighthouse-performance-점수-94점-측정-원인)에서 확인한 **감점 요인 리스트를 간단히 다시 살펴보겠습니다.**

- vercel.app과 JSDelivr CDN에서 전달받은 CSS 파일로 인해 **초기 렌더링 과정에서 렌더링 흐름이 지연** _(Render blocking requests)_
- `GET /timezone/list` **API 요청 응답이 완료되기까지**의 **전체 소요 시간이 약 733ms로 측정** _(Network dependency tree)_
- `index-xxx.js` 번들 파일에 사용되지 않는 JavaScript 코드가 포함되어 **불필요한 네트워크 전송 발생** _(Reduce unused JavaScript)_

하지만 여기서 중요한 점은, 앞서 확인해듯이 **해당 감점 요인 리스트는 모두 Unscored 항목**이라는 것입니다. 즉, 이 항목들은 **Lighthouse 전체 점수 산정에 반영되지 않기 때문에 Performance 점수가 100점에서 93점으로 감점된 직접적인 원인이 되지는 않습니다.**

따라서 Lighthouse Performance 결과가 100점이 아닌 **93점으로 측정된 원인을 파악할 필요**가 있습니다. 이를 확인하기 위해 **Performance 요약 결과를 다시 한 번 살펴보겠습니다.**

<br />

![Clock Lighthouse Performance Summary Result](./images/clock-lighthouse-performance-summary-result.png)

<br />

Performance 요약 결과를 살펴보면 여러 측정 지표 중 **First Contentful Paint만 🟡로 표시**되는 것을 확인할 수 있습니다.

즉, 앞서 확인한 감점 요인 리스트가 100점에서 93점으로 감점된 직접적인 원인이라기보다는, **FCP 시점이 Lighthouse 점수 산정 기준에서 약 50~89점 구간으로 계산**되고 있기 때문에 **감점 요인으로 반영되었음을 의미**합니다. 따라서 **Performance 점수를 93점에서 100점으로 개선하기 위해서**는 **현재 FCP 결과인 2.4s 수치를 일정 수준 단축**할 필요가 있습니다.

다만 감점 요인 리스트의 각 항목 탭을 활성화하여 세부 원인을 확인해보면, **Network dependency tree는 LCP와 Unscored 항목에 해당**하므로 **현재 상황에서 점수 감점의 직접적인 원인으로 보기는 어렵습니다.**

결과적으로 FCP 항목에 영향을 주는 **Render blocking requests** 또는 **Reduce unused JavaScript**가 **직접적인 감점 원인임을 유추**할 수 있었습니다. 따라서 FCP 시점을 개선하기 위해 **개발자 도구 Performance 패널을 활용**하여 **FCP 이전 구간을 측정**해보겠습니다.

<br />

![Performance Panel Result](./images/lighthouse-performance-fcp-performance-result.png)

<br />

개발자 도구 Performance 패널을 활용하여 FCP 이전 구간을 측정해보면, **Network 항목에서 4건의 요청이 발생**했으며 **약 1.24 시점에 FCP가 측정**된 것을 확인할 수 있습니다.

이 결과만 놓고 보면 **CSS 파일 응답 이후 CSSOM을 구축하는 과정에서 실질적인 렌더링 블로킹이 발생**하고 있다는 점을 직접적인 원인으로 판단할 수도 있고, **FCP 직전 구간에서 다수의 함수 호출이 발생**하고 있기 때문에 해당 구간 역시 주요 원인으로 해석할 수 있습니다.

**개인적으로는 렌더링 흐름에 직접적인 영향을 주는 CSS 렌더링 블로킹 구간**을 **주요 원인**으로 보고 있기 때문에 해당 항목부터 먼저 확인해보겠습니다. 만약 이 구간이 **주요 원인으로 확인될 경우, Reduce unused JavaScript 항목은 본 문서에서 다루지 않을 수도 있습니다.**

<br />

### A. Render blocking requests

개인적으로는 Render blocking request가 **FCP 측정 시점을 지연시키는 주요 원인**으로 보고 있다고 설명했습니다. 먼저 해당 감점 요인을 주요 원인으로 본 이유를 설명하기 위해 **브라우저 동작 및 렌더링 과정**을 살펴보겠습니다.

<br />

![브라우저 렌더링 과정](./images/browser-rendering.webp)

> 브라우저 동작･렌더링 과정에 대해 보다 자세한 내용은, 제 기술 블로그의 [Notion: 브라우저 동작 원리](https://gye-won.notion.site/Browser-Workflow-2ae88bd9c3fa80b8a33dc4b869c180ec?pvs=74) 포스트를 참고해 주시기 바랍니다.

<br />

많은 프론트엔드 개발자는 **브라우저의 동작 및 렌더링 과정을 이해한 상태에서 프로젝트를 진행**합니다. 브라우저 동작 및 렌더링 과정을 간단히 정리하면 다음과 같습니다.

<br />

1. 사용자가 URL에 최초 접속하면, 브라우저 구성 요소 중 사용자 인터페이스(UI)는 이를 감지하고 브라우저 엔진(UI와 렌더링 엔진 사이에서 동작을 중재하는 역할)에 전달합니다. 이후 브라우저 엔진은 해당 요청을 렌더링 엔진에 전달합니다.
1. URL을 전달받은 렌더링 엔진은 브라우저의 통신 모듈에 요청을 전달하고, 통신 모듈은 DNS 조회 및 TCP/IP 연결 과정을 거쳐 웹 서버로부터 HTML, CSS, JavaScript 등의 정적 자원을 전달받아 다시 렌더링 엔진에 전달합니다.
1. 렌더링 엔진은 전달받은 HTML과 CSS를 각각 DOM과 CSSOM으로 변환한 뒤 이를 결합하여 Render Tree를 생성합니다. 이후 요소의 크기와 위치를 계산하는 Layout 단계를 수행하고, 색상 및 그림자 등 시각적 속성을 픽셀 단위로 계산하는 Paint 작업을 수행합니다. 마지막으로 결과 레이어를 결합하는 Composite 단계를 거쳐 UI 백엔드로 전달합니다.
1. UI 백엔드는 Render Tree 기반 계산 결과를 바탕으로 GPU 및 OS 그래픽 시스템과 연동하여 실제 화면을 그리는 작업을 수행하며, 최종적으로 브라우저 뷰포트에 렌더링 결과가 출력됩니다.

<br />

렌더링 과정을 보면 알 수 있듯이, HTML과 CSS는 **각각 DOM과 CSSOM으로 변환된 뒤 이를 결합하여 Render Tree를 생성**하고, 이를 기반으로 **최종적으로 사용자 화면에 URL에 맞는 페이지가 출력**됩니다.

한편 JavaScript는 일반적으로 DOM을 조작하기 위한 용도로 많이 활용됩니다. 하지만 **DOM이 생성되기 이전에 JavaScript를 통해 DOM을 조작하려 하는 경우, 아직 생성되지 않은 요소에 접근하게 되므로 오류가 발생**할 수 있습니다. 이러한 이유로 최근에는 **스크립트 로드 지연 방식인 `async` 또는 `defer` 속성을 활용**하는 방식이 널리 사용됩니다.

다만 React, Vue, Angular와 같은 최신 SPA 프레임워크의 경우, 실제 DOM을 직접 조작하기보다 **JavaScript 메모리 상에서 추상화된 Virtual DOM(또는 Incremental DOM 등) 구조를 활용**합니다. 이는 **빈 HTML 문서를 전달**받은 뒤, 해당 **추상화 구조를 기반으로 실제 DOM을 생성 및 갱신**하는 방식으로 **렌더링을 수행**하게 됩니다.

여기서 중요한 점은 **JavaScript 실행 시점**입니다. 브라우저는 **HTML 문서를 파싱하여 DOM Tree를 생성하는 과정**에서 **`<script>` 태그를 만나면 스크립트를 실행**합니다. 마찬가지로 ((`<link>` 태그를 만나면 CSS 파일을 로드하고 이를 기반으로 CSSOM을 구축))하게 됩니다.

두 방식의 차이점은 처리 방식에 있습니다. `<script>` 태그는 `async`, `defer` 등을 통해 **비동기 실행 방식으로 전환**할 수 있지만, **CSS는 CSSOM 구축이 완료되어야 Render Tree를 생성**할 수 있기 때문에 렌더링 흐름 상에서 **동기적으로 처리**됩니다.

만약 **CSSOM 구축이 완료되지 않은 상태에서 Render Tree 결합**이 이루어진다면 **스타일 정보가 누락된 상태로 Layout -> Paint -> Composite 단계가 진행**될 수 있고, **추가 스타일이 반영되면서 Reflow 및 Repaint가 반복적으로 발생**하여 런타음 성능 저하로 이어질 수 있습니다.

실제로 이와 **비슷한 사례로 CSS-in-JS 방식의 스타일 모듈 구조**로 들 수 있다고 생각합니다. 이는 JavaScript를 통해 스타일을 모듈화하는 방식이며, React 환경에서 활용되는 CSS-in-JS 패키지는 컴포넌트를 구축하는 코드와 유사한 형태로 작성할 수 있다는 점에서 많은 인기를 끌었습니다.

다만 **런타임 이후 JavaScript를 통해 스타일을 재구성하게 되므로 런타임 성능 저하가 발생**하게 됩니다. 이러한 이유로 최근에는 **점차 사용 빈도가 감소하는 추세로 변화**하고 있으며, React의 CSS-in-JS 대표 패키지인 **Styled-Component 역시 후원 종료와 더불어 릴리즈 업데이트 간격이 길어지면서 개발자들 사이에서는 사실상 지원이 중단된 것처럼 인식**되기도 합니다.

이처럼 CSSOM 구축 지연으로 인한 Render blocking requests와, React 렌더링 과정에서 발생하는 다수의 함수 호출(Reduce unused JavaScript 관련 맥락)은 모두 FCP 지연 요인이 될 수 있습니다. 다만 Render Tree 결합을 위해 **CSSOM이 선행적으로 구축되어야 한다는 점**에서, 개인적으로는 CSS 렌더링 블로킹 구간을 **주요 원인으로 판단**했습니다.