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

예를 들어 SEO 우선순위를 높이기 위해서는 [｢Lighthouse SEO 점수 개선 및 Google Search Console 사이트 등록｣](./seo-optimization.md) 문서에서 확인할 수 있듯이, 개발 관점만으로 달성할 수 있는 영역이 아닙니다. 보유한 백링크 규모, 브랜드 신뢰도 등** 마케팅･브랜딩 영역과의 협업이 함께 이루어져야 실제 검색 노출 우선순위를 높일 수 있습니다.** 하지만 Google Lighthouse는 **HTML 문서의 메타데이터 구성, `robots.txt` 파일 존재 여부** 등 **개발 관점의 요소를 중심으로만 점수를 산정**합니다.

이처럼 Lighthouse 결과는 절대적 지표가 아니며, 이러한 한계를 이해한 상태에서 활용할 필요가 있습니다. 실제 운영 중인 대규모 서비스의 경우 프로젝트 규모와 구조가 복잡하기 때문에, Lighthouse와 같은 정량적 지표보다 **실제 사용자에게 제공되는 런타임 성능을 더욱 중요하게 고려**합니다. 이로 인해 Lighthouse 점수를 측정하더라도 **모든 항목에서 100점을 달성한 사례는 드문 편**입니다.

<br />

![Toss Invest Lighthouse Result](./images/toss-invest-lighthouse-result.png)

![Naver Lighthouse Result](./images/naver-lighthouse-result.png)

<br />

다만 현재 Clock 서비스와 같이 실제 운영 서비스가 아닌 포트폴리오 성격의 프로젝트에서는 이러한 **정량적 지표를 개선하는 과정 자체가 중요한 학습 요소**가 된다고 생각합니다. 따라서 해당 문서에서는 **Lighthouse 전체 측정 지표를 100점 기준으로 개선한 과정**을 작성했습니다.

<br />

## II. 