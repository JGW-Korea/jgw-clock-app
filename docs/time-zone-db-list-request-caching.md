![TimeZoneDB API](./images/time-zone-db-list-request-caching.jpg)

> ☝️ 이 문서는 World 라우트로 이동할 때마다 동일한 데이터를 반복적으로 요청하는 TimeZoneDB Open API 호출을 캐싱하여 개선한 과정을 설명한 문서입니다.

<br />

## I. TimeZoneDB Open API를 활용한 이유

Clock 프로젝트는 iOS 모바일 기기의 시계 앱을 클론 코딩한 프로젝트입니다. iOS 시계 앱의 세계 시간(World) 화면에서는 전 세계 도시 목록을 제공하며, 사용자가 특정 도시를 선택하면 해당 도시의 시간이 사용자의 앱에 추가되는 구조로 동작합니다.

![iOS World Append List Flow](./images/ios-clock-world-append-list.png)

현재 진행 중인 Clock 프로젝트에서도 iOS 시계 앱과 동일하게 전 세계 도시 목록을 제공하는 기능이 필요했습니다. 하지만 해당 프로젝트는 정적 웹 사이트(Static Web Site) 형태로 구성되어 있어, 별도의 웹 서버나 WAS를 구축하지 않고 개발을 진행했기 때문에, 서버에서 전 세계 도시 목록을 요청할 수는 없었습니다.

이로 인해, 전 세계 도시 데이터를 제공하는 Open API를 찾던 중, 다음 두 가지 무료 Open API를 확인할 수 있었습니다.

<br />

**[① World Time API](https://worldtimeapi.org/)**

World Time API는 Google에서 "전 세계 도시 목록 제공 API"를 검색하던 과정에서 확인하게 되었습니다. 해당 API는 인프런 질문인 ["세계 시간 API 서버 이슈로 대체할만한 API 아시는분 계신가요?"](https://www.inflearn.com/community/questions/1509722/%EC%84%B8%EA%B3%84-%EC%8B%9C%EA%B0%84-api-%EC%84%9C%EB%B2%84-%EC%9D%B4%EC%8A%88%EB%A1%9C-%EB%8C%80%EC%B2%B4%ED%95%A0%EB%A7%8C%ED%95%9C-api-%EC%95%84%EC%8B%9C%EB%8A%94%EB%B6%84-%EA%B3%84%EC%8B%A0%EA%B0%80%EC%9A%94?srsltid=AfmBOoqM610JCOXEK7n7aJqFp6D8ynFZ17RYlwXMafMDcDkk-HchflKf)을 통해 해당 API의 정보를 알게 되었습니다.

인프런 강의에서도 활용되는 무료 Open API라는 점에서, Clock 프로젝트에서도 가별게 활용할 수 있을 것이라 생각했습니다. 또한 해당 질문이 2025.02.02에 등록된 글이기 때문에, 질문에 작성된 서버 이슈 역시 이미 해결되었을 것으로 판단하여 별도의 대안 API를 추가로 탐색하지 않고 사용하기로 결정했습니다.

그러나 해당 API의 사용 방법을 확인하기 위해 공식 문서를 들어갔지만, World 라우트를 개발하던 2025.11월 시점에도 서버 이슈가 여전히 해결되지 않은 상태였습니다. 이로 인해, 결국 해당 API를 사용하지 못하기 때문에 다른 Open API를 찾아보게 되었습니다.

<br />

**[② Time Zone DB API](https://timezonedb.com/api)**

Google을 통해 다른 Open API를 찾기 전에, World Time API를 알게 된 질문 자체가 "세계 시간 API 서버 이슈로 대체할만한 API 아시는분 계신가요?"라는 제목으로 등록된 글이였기 때문에 해당 질문 게시물의 댓글을 먼저 확인하게 되었습니다.

댓글 중 인프런 사이트에서 자체적으로 운영하는 AI 기반 댓글 봇인 "인프런 AI 인턴"이 남긴 댓글을 확인할 수 있었고, 해당 댓글에서 World Time API를 대체할 수 있는 3가지 Open API를 안내하고 있었습니다.

그 중 [World Clock API](http://worldclockapi.com/)의 경우, 공식 문서에 사용 방법에 대한 설명 없이 단순히 요청 URL만 명시되어 있어 활용 방법을 정확히 파악하기 어려웠습니다.

또한 [Goggle Maps Time Zone API](https://developers.google.com/maps/documentation/timezone/overview?hl=ko)는 무료 크레딧 이후 유료로 제공되는 API였으며, 전체 도시 목록을 제공하는 방식이 아니라 특정 지리 정보에 대한 시간대만 반환하는 API였기 때문에 Clock 프로젝트에는 적절하지 않다고 판단했습니다.

이후 남은 하나인 Time Zone DB API의 공식 문서를 확인했는데, 제공되는 API 중 전체 시간대 목록을 가져올 수 있는 List Time Zone과 특정 도시의 시간대를 조회할 수 있는 Get Time Zone API을 제공하고 있었기 때문에 해당 API를 사용하는 것이 적절하다고 판단했습니다.

또한, 당시 API 로직을 개발하던 시점에는 Intl API에 대해 알지 못한 상태였기 때문에, 두 시간대의 차이를 계산해 주는 Convert Time Zone API가 제공된다는 점에서도 Time Zone DB API가 더욱 적절하다고 판단하여 해당 API를 사용하기로 결정했습니다.

<br />