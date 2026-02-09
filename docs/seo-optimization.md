![SEO Thumbnail](./images/seo-thumbnail.jpg)

> ☝️ 이 문서는 Clock 서비스의 SEO(Search Engine Optimization) 위해 HTML 문서의 메타데이터 정의하고, Google Search Console 및 Naver Search Advisor에 등록한 과정을 정리한 문서입니다.

<br />

## I. SEO(Search Engine Optimization)란?

Google, Bing, 네이버 등의 검색 엔진에서 특정 사이트를 검색할 경우, 검색 결과(Search Result)는 **광고 검색 결과(Paid Search Result)** 와 **자연 검색 결과(Organic Search Result)** 두 가지로 구분됩니다.

<br />

![구글 검색 엔진 결과](./images/google-search-results.webp)

<br />

이때 **광고 검색 결과(Paid Search Result)** 의 경우, 해당 **검색 엔진에 일정 비용을 지불함으로써 검색 결과 최상단에 사이트를 노출**시킬 수 있다는 장점이 있습니다. 그러나 **사용자 입장에서는 광고라는 인식으로 인해 거부감을 느낄 수 있어, 상대적으로 높은 접속률을 확보하지 못하는 경우도 존재**합니다.

반면 **자연 검색 결과(Organic Search Result)** 는 **사용자가 작성한 콘텐츠와의 연관성을 기반으로 검색 엔진에 노출되며, 광고 검색 결과보다 더 높은 클릭률을 확보**할 가능성이 높습니다. 다만, 동일하거나 유사한 콘텐츠를 보유한 사이트가 매우 많기 때문에 각 검색 엔진은 자체 크롤링 및 평가 기준을 통해 사이트별 점수를 산정하고, 이를 기반으로 노출 순위를 결정합니다. 따라서 **수집 및 평가 점수가 높지 않은 경우 사이트 노출 우선순위가 낮아져 사용자가 해당 사이트를 확보하지 못할 수도 있습니다.**

실제로 [**BACKLINKO**](https://backlinko.com/google-ctr-stats)에서 Google 검색 결과 약 **400만 건의 클릭률(CTR)을 분석한 통계**에 따르면, 아래 그림과 같이 **자연 검색 결과 1위 사이트의 전체 클릭률이 가장 높으며, 이후 순위부터는 클릭률이 급격히 감소**하는 경향을 확인할 수 있습니다.

<br />

![구글 자연 검색 결과 클릭율 통계](./images/google-organic-ctr.webp)

<br />

이처럼 광고에 대한 거부감을 유발하지 않으면서도 **자연 검색 결과 내 노출 우선순위를 높이기 위한 일련의 과정**을 **SEO(Search Engine Optimization)** 라고 합니다.

물론 **SEO를 통해 자연 검색 결과의 순위를 높이기 위해서**는 단순히 개발 영역을 넘어 **마케팅**, **브랜딩** 등 다양한 영역에 대한 이해도 함께 요구됩니다.

왜냐하면 SEO 최적화 과정에서 개발자는 **웹 렌더링 방식(CSR, SSR, SSG 등)에 따른 렌더링 기법 선택**, **HTML 문서의 메타데이터 구성**, **웹 표준 및 접근성 준수** 등과 같은 **기술적 영역을 중심**으로 **검색 엔진이 페이지를 원활하게 크롤링하고 이해할 수 있도록 만드는 역할을 수행**하기 때문입니다.

즉 개발 영역에서도 SEO에 영향을 줄 수 있는 요소들을 개선할 수는 있지만, **검색 순위는 단순히 문서 구조나 메타데이터와 같은 기술적 요소만으로 결정되지 않습니다.** 동일하거나 유사한 서비스를 제공하는 **경쟁 사이트가 많을 경우**, 해당 사이트들이 **보유한 백링크 규모**, **브랜드 신뢰도**, **사용자 반응 지표**, **콘텐츠 품질** 등 **다양한 외부 요인들이 함께 반영되어 검색 결과 노출 순위에 영향을 미치게 됩니다.**

이로 인해, 본 문서에서는 **개발자 도구인 Lighthouse**의 **SEO 점수를 개선**하기 위해 **수행한 과정에 한정해 내용을 작성**했습니다.

<br />

## II. SEO를 위한 HTML 문서 메타데이터 작성

개발 영역에서 Lighthouse의 SEO 점수를 개선하기 위해 수행할 수 있는 **가장 기초적인 방법**은 **HTML 문서의 메타데이터 정보를 작성**하는 것입니다. 이는 **검색 엔진 크롤러**가 **정보를 수집할 때 문서의 내용을 파악하는 데 도움을 주기 때문**입니다.

이로 인해, 먼저 **메타데이터 정보를 작성하지 않았을 경우**의 **Lighthouse SEO 점수**를 살펴보겠습니다.

<br />

![메타데이터 작성 X - Lighthouse](./images/lighthouse-meta-tag-no-write.png)

<br />

HTML 문서에 메타데이터 정보를 작성하지 않았을 경우 **Lighthouse SEO 점수가 73점으로 측정**되는 것을 확인할 수 있습니다.

또한 **Lighthouse를 이용하면 점수를 향상시키기 위한 힌트를 제공**하는데, 위 이미지의 빨간 블록으로 하이라이팅된 영역을 보면 **"Document doesn't have a `<title>` element"**, **"Document does not have a meta description"** 라고 표시된 것을 확인할 수 있습니다.

즉 **문서의 제목과 내용을 파악할 수 있는 메타데이터가 존재하지 않기 때문에** Lighthouse SEO 점수의 **감점 요인이 되었다는 것을 확인**할 수 있습니다. 이로 인해 **다음과 같이 HTML 문서의 제목과 메타데이터 정보를 추가한 후 점수를 다시 확인**해보겠습니다.

<br />

```html
<!doctype html>
<html lang="ko">
  <head>
    <!-- HTML 문서 메타데이터 정의 -->
    <title>JGW Clock</title>
    <meta name="description" content="JGW Clock은 iOS 시계 앱을 클론 코딩한 프로젝트로, 세계 시간, 알람, 타이머, 스톱워치 기능을 제공합니다." />
    <meta name="author" content="Jo Gye Won" />
    <meta name="keywords" content="시계, clock, Clock, ios, 세계 시계, world clock, World clock, 알람, alarm, Alarm, 타이머, timer, Timer, 스톱워치, stopwatch, Stopwatch, jgw, JGW, 조계원, Jo Gye Won, Gye Won Jo" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

![메타데이터 작성 O - Lighthouse](./images/lighthouse-meta-tag-write.png)

<br />

HTML 문서에 제목과 내용을 파악할 수 있는 메타데이터를 작성하면 **Lighthouse SEO 점수가 73점에서 91점으로 상승**하는 것을 확인할 수 있습니다. 즉 **검색 엔진 크롤러**가 **정보를 수집할 때 문서의 내용을 파악할 수 있는 정보만 명시**하더라도 **Lighthouse SEO 점수가 크게 향상되는 것을 확인**할 수 있습니다.

그러면 이제 이전 결과에서는 표시되지 않았던 **오픈 그래프(Open Graph)** 와 **트위터 카드(Twitter Card)** 라는 메타데이터 정보를 추가한 후, **Lighthouse SEO 점수 결과를 다시 살펴보겠습니다.**

<br />

```html
<!doctype html>
<html lang="ko">
  <head>
    <!-- HTML 문서 메타데이터 정의 -->
    
    <!-- Open Graph 메타데이터 정의 -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="JGW Clock" />
    <meta property="og:site_name" content="JGW Clock" />
    <meta property="og:description" content="JGW Clock은 iOS 시계 앱을 클론 코딩한 프로젝트로, 세계 시간, 알람, 타이머, 스톱워치 기능을 제공합니다." />
    <meta property="og:image" content="https://jgw-clock-app.vercel.app/thumbnail.jpg" />
    <meta property="og:url" content="https://jgw-clock-app.vercel.app/" />
    
    <!-- Twitter Card 메타데이터 정의 -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@jgw_vito" />
    <meta name="twitter:title" content="JGW Clock" />
    <meta name="twitter:description" content="JGW Clock은 iOS 시계 앱을 클론 코딩한 프로젝트로, 세계 시간, 알람, 타이머, 스톱워치 기능을 제공합니다." />
    <meta name="twitter:url" content="https://jgw-clock-app.vercel.app/" />
    <meta name="twitter:image" content="https://jgw-clock-app.vercel.app/thumbnail.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

![Open Graph, Twitter Card 작성 - Lighthouse](./images/lighthouse-seo-open-graph.png)

<br />

오픈 그래프(Open Graph)와 트위터 카드(Twitter Card) 메타데이터를 작성한 경우, **Lighthouse SEO 점수**가 **이전 결과와 동일하게 91점으로 유지**되는 것을 확인할 수 있습니다.

**이와 같은 결과가 나타나는 이유**는 오픈 그래프와 트위터 카드 메타데이터 정보가 **Lighthouse SEO 점수 산정 기준에 포함되는 항목이 아니기 때문**입니다. **오픈 그래프**는 문서의 내용을 검색 엔진이 이해하기 위한 메타데이터라기보다, **SNS에 사이트를 공유할 때 단순 URL 형태가 아닌 카드 형태의 링크 미리보기를 제공하기 위한 메타데이터**이기 때문입니다.

그렇다면 왜 **많은 블로그 포스트에서 오픈 그래프와 트위터 카드 메타데이터 작성을 SEO와 연관 지어 설명**하는지에 대해 생각해볼 필요가 있습니다.

개인적인 관점에서는 앞서 [｢I. SEO(Search Engine Optimization)란?｣](#i-seosearch-engine-optimization란) 마지막 단락에서 설명한 것처럼, **검색 결과 노출 우선순위**는 **기술적 요소 외에도 다양한 외부 요인의 영향을 받기 때문**이라고 볼 수 있습니다.

그렇기 때문에 **결국에는 많은 사용자를 확보**해야 합니다. 그렇게 하기 위해서는 **다양한 백링크(외부 사이트에서 우리 서비스로 이동할 수 있는 링크)를 확보**하거나, **사용자의 클릭율(CTR)을 확보**해야 합니다.

하지만 **백링크**는 **사용자가 서비스를 이용하고 공유하는 과정에서 형성**되기 때문에 마케팅에 대한 전문 지식이 필요할 수 있습니다. 반면 **클릭율(CTR)을 확보**하기 위해서도 다양한 요인이 있겠지만, **결국 사용자가 "클릭하고 싶다"는 동기가 생겨야 합니다.**

예를 들어 **충분히 알려진 서비스가 아닌 경우**, 단순 URL만 공유되면 사이트에 대한 **신뢰 형성이 어렵고 보안 측면에서 경계심을 유발**할 수 있습니다. 반면 **카드 형태의 미리보기**는 **시각적 정보와 요약 정보를 함께 제공**하기 때문에 **사용자의 주목도를 높이는 데 도움**을 줄 수 있습니다.

<br />

![Open Graph 적용 결과 차이](./images/open-graph-effect.png)

<br />

즉 **오픈 그래프(Open Graph) 또는 트위터 카드(Twitter Card) 적용 여부**는 Lighthouse SEO 점수 반영에는 영향이 없더라도 **링크 공유 시 사용자 주목도 및 클릭 유도 측면**에서 **긍정적인 영향을 줄 수 있기 때문에 Clock 프로젝트에서는 적용**하게 되었습니다.