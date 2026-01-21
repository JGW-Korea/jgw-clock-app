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

## II. 현재 전체 시간대 목록 요청 API 로직의 문제점

Clock 프로젝트에서는 World Route에서 독립적으로 존재하는 World Bottom Sheet 컴포넌트가 렌더링 될 때, `useEffect`를 통해 Time Zone DB API에서 제공하는 전체 시간대 목록을 가져오는 API 로직을 작성했습니다.

```tsx
export default function useWorldTimeFetch() {
  const [worldTimeListData, setWorldTimeListData] = useState<ListTimeZone[]>([]);
  
  useEffect(() => {
    const fetchListTimeZone = async () => {
      try {
        const resposne = await getListTimeZone();

        // TimeZoneDB 요청이 실패한 경우 -> TimeZoneDB에서 설정한 message 값으로 에러문을 출력한다.
        if(response.data.status === "FAILED") {
          throw new Error(resposne.data.message);
        }

        // TimeZoneDB 요청이 성공적일 경우 -> 상태를 갱신하여 리렌더링을 발생시켜 사용자 화면에 리스트 목록을 나타낸다.
        setWorldTimeListData(response.data.zones);
      } catch(error) {
        // ...
      }
    }

    fetchListTimeZone();
  }, []);
}
```

하지만 현재 로직에는 문제가 존재합니다. 바로 페이지가 `/world`로 이동할 때마다 해당 `useEffect` 내부 로직이 실행되면서, 이미 한 번 받아온 데이터임에도 불구하고 동일한 데이터를 갱신하기 위한 재요청이 반복적으로 발생한다는 점입니다.

![Time Zone DB List First Request](./images/time-zone-list-api-first-request.png)

> _위 이미지는 "최초 요청" 시 개발자 도구 > 네트워크 탭의 Fetch/XHR만 필터링 한 결과입니다._

<br />

![Time Zone DB List First Request after](./images/time-zone-list-api-first-request-after.png)

> _위 이미지는 최초 요청 이후 `/world` 페이지로 이동할 때마다 개발자 도구 > 네트워크 탭의 Fetch/XHR만 필터링 한 결과입니다._

<br />

동일한 데이터를 요청하기 위한 재요청이 반복적으로 발샐할 경우, 불필요한 네트워크 자원을 소모하게 될 뿐만 아니라, 응답을 제공하는 서버가 원인을 알 수 없는 오류로 인해 응답을 반환하지 못하는 상황이 발생했을 때 적절한 예외 처리가 되어 있지 않다면 런타임 에러로 이어질 수 있는 등 다음과 같이 여러 가지 문제가 발생할 수 있습니다.

<br />

**① HTTP 버전이 낮은 경우**

브라우저는 HTTP 프로토콜을 통해 서버와 통신을 주고받게 되며, HTTP 프로토콜은 기본적으로 비연결성(Non-Connection)이라는 특징을 가지고 있습니다.

비연결성을 간단히 설명하면, 클라이언트와 서버 간의 요청-응답 과정에서 TCP/IP 연결을 수립한 뒤 HTTP 요청을 전송하고, 서버가 이에 대한 응답을 반환하면 해당 TCP/IP 연결을 종료하는 방식입니다.

이를 보완하기 위해 HTTP/1.1부터는 지속적 연결(Persistent Connection)을 도입하여, TCP/IP 연결을 가능한 오랫동안 유지하고 해당 연결이 유지되는 동안 발생하는 HTTP 요청에 대해서는 연결을 끊지 않고 하나의 TCP/IP 연결 내에서 요청-응답 과정을 처리하도록 개선되었습니다.

하지만 HTTP/1.0까지는 이러한 방식이 적용되지 않았기 때문에, 만약 Time Zone DB API가 내부 서버를 HTTP/1.0 기반으로 구축하고 있었다면 매 요청마다 "TCP/IP 연결 수립 -> HTTP 요청 -> HTTP 응답 반환" 과정을 반복하는 구조를 가졌을 것입니다.

또한 비연결성 특징과 더불어, HTTP/1.1까지는 요청-응답을 FIFO(First-In-First-Out) 방식으로 처리했기 때문에 앞선 요청의 처리 시간이 지연될 경우, 그 이후에 발생한 요청들까지 함께 지연되는 HOL Blocking(Head-of-Line Blocking) 문제가 존재했습니다.

비록 리팩토링 이후에는 이러한 방식으로 동작하지 않지만, 기존 로직에서는 사용자 화면에 출력된 전체 시간대 목록 중 특정 항목을 클릭하면 Time Zone DB API에서 제공하는 Convert Time Zone API를 통해 시간 변환 요청을 수행하고 있었습니다.

이때 전체 시간대 목록을 가져오는 List Time Zone API 요청이 아직 완료되지 않은 상태에서 Convert Time Zone API 요청이 발생했가면, Bottom Sheet가 비활성화되었더라도 사용자 화면은 Convert Time Zone API의 응답이 도착하지 않은 상태로 유지되었을 것이며, 그 결과 사용자는 원인을 알 수 없는 상황에서 다시 요청을 시도하는 문제가 발생했을 가능성도 있습니다.

<br />

**② 유료 서비스 Open API를 사용하는 경우**

Clock 프로젝트에서 Time Zone DB API와 같은 무료 Open API가 아니라, Google Maps Time Zone API와 같은 유료 Open API를 사용하고 해당 API의 응답 헤더에 캐시 정책이 설정되어 있지 않았다면, 동일한 데이터에 대한 반복적인 재요청으로 인해 상당한 비용이 발생했을 것입니다.

유로 Open API 경우, API 요청 건당 비용을 부과하거나, 네트워크 요청이 인해 발생한 트래픽의 크기를 기준으로 해당 서비스에서 사용된 자원의 양만큼 비용을 부과하는 방식이 일반적입니다. 이 중 트래픽 기반 과금 방식의 경우에는 실제 사용자가 많지 않다면 비용 발생이 크지 않을 수도 있습니다.

그러나 API 요청 건당 비용을 부과하는 방식이었다면, 제가 문서를 작성하거나 배포된 사이트에서 테스트를 진행하는 과정에서도 실제 서비스 이용자가 아닌 개발자임에도 불구하고 API 요청이 발생할 때마다 비용이 청구되었을 것입니다.

<br />

**③ 사용자가 사용 중인 네트워크가 느린 경우**

일반적으로 서비스를 개발하는 개발자의 네트워크 환경은 비교적 성능이 좋은 경우가 많습니다. 이로 인해 개발 과정에서 네트워크 성능으로 인한 문제를 직접 체감하기는 쉽지 않습니다.

특히 네트워크 요청 중에서도 브라우저 화면을 구성하기 위한 HTML, CSS, JavaScript와 달리 일반적인 데이터 요청은 상대적으로 응답 크기가 작기 때문에, 개발자의 로컬 환경에서는 빠르게 응답이 도착하는 경우가 많습니다. 또한 이러한 요청은 Skeleton UI나 Loading Spinner와 같은 시각적 처리로 가려지기 때문에 개발자는 네트워크 지연을 더욱 자각하지 못할 수 있습니다.

하지만 개발자의 환경이 아닌, 실제 사용자의 관점에서 네트워크 성능이 좋지 않은 상황을 가정해 보면 List Time Zone API 요청은 현재 개발 환경보다 훨씬 느린 속도로 응답을 받을 수밖에 없습니다. 이를 확인하기 위해 Clock 서비스에서 동일한 요청에 대해 네트워크 속도를 다르게 설정하여 응답 속도를 비교해 보겠습니다.

![Time Zone DB API Default network](./images/time-zone-db-request-default-network.png)

> _최초 요청 시, 네트워크 속도를 제어하지 않았을 때의 개발자 도구 > 네트워크 탭 결과_

<br />

![Time Zone DB API 3G network](./images/time-zone-db-request-3g-network.png)

> _최초 요청 시, 3G로 네트워크 속도를 제어했을 때의 개발자 도구 > 네트워크 탭 결과_

응답 속도를 비교해 보면, 네트워크 속도를 제어하지 않았을 때는 약 466ms 만에 응답을 받아오는 것을 확인할 수 있습니다. 반면 3G로 네트워크 속도를 제어했을 경우에는 약 2.17s 이후에 응답을 받아오는 것을 확인할 수 있습니다.

이와 같은 상황에서 `/world` 페이지로 이동할 때마다 동일한 List Time Zone API 재요청이 반복적으로 발생한다면, 네트워크 성능이 좋지 않은 사용자의 환경에서는 매번 느린 응답을 기다려야 하는 상황이 발생하게 됩니다.

![Time Zone DB API Many request 3G network](./images/time-zone-db-many-request-3g-network.png)

> _재요청이 발생할 때마다 네트워크 속도를 3G로 제어했을 때의 개발자 도구 > 네트워크 탭 결과_

<br />

여기서 중요한 점은, 최초 요청 시에는 단순히 응답 시간 수치보다 사용자가 체감하는 대기 시간이 더 길게 느껴질 수 있다는 점입니다. 일반적인 데이터 요청은 브라우저가 렌더링을 위한 HTML, CSS, JavaScript 자원을 모두 수신한 이후에 해당 요청 로직이 포함된 JavaScript가 실행되기 때문입니다.

또한 현재 비교한 응답 속도는 제 컴퓨터 환경에서 네트워크 속도만 제어했음에도 불구하고, 응답 시간이 약 5배 이상 느려졌다는 점을 보여줍니다. 즉, 서비스를 사용하는 사용자의 컴퓨터 성능이 제 환경보다 낮거나, 브라우저에서 확장 플러그인 등 외부 요인을 많이 실행하고 있거나 다른 브라우저를 사용하는 경우에는 응답 시간이 5배보다 더 느려질 수 있습니다.

결과적으로 이러한 반복적인 재요청 구조는 네트워크 환경이 열악한 사용자에게 매우 불리한 사용자 경험을 제공하게 되며, 응답 지연으로 인한 사용자 경험(UX) 저하는 서비스 이탈로 이어질 가능성을 높이게 됩니다.

<br />

**④ 적절한 예외 처리를 하지 않았을 경우**

개발자가 적절한 예외 처리를 수행하지 않았더라도, 그 결과가 화면에 직접적인 영향을 주지 않는 경우에는 사용자가 에러 발생 여부를 인지한지 못한 채 넘어갈 수 있습니다. 이게 정확히 무슨 소리인지 알아보기 위해 기존 API 로직을 다음과 같이 수정해보겠습니다.

```tsx
export default function useWorldTimeFetch() {
  const [worldTimeListData, setWorldTimeListData] = useState<ListTimeZone[]>([]);
  
  useEffect(() => {
    const fetchListTimeZone = async () => {
      const resposne = await getListTimeZone();

      // TimeZoneDB 요청이 성공적일 경우 -> 상태를 갱신하여 리렌더링을 발생시켜 사용자 화면에 리스트 목록을 나타낸다.
      setWorldTimeListData(response.data.zones);
    }

    fetchListTimeZone();
  }, []);
}
```

```tsx
// 컴포넌트 로직
export default function WorldBottomSheet({ isOpen, onClose, onClickAppendWorld }: Props) {
  const { worldTimeListData } = useWorldTimeFetch();
  
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} sheetTitle="Choose a City">
      <ul className={`${styles["world-sheet-content"]}`}>
        {worldTimeListData.map(({ countryName, zoneName }) => {
          return (
            <WorldSheetListItem
              key={zoneName}
              countryName={countryName}
              zoneName={zoneName}
              onClickAppendWorld={onClickAppendWorld}
            />
          );
        })}
      </ul>
    </BottomSheet>
  )
}
```

위와 같이 로직을 수정한 이후 "429 Too Many Request "에러가 발생하더라도, 런타임 오류가 발생하지 않기 때문에 화면에는 에러 메시지나 경고 없이 Bottom Sheet 내부의 리스트가 비어 있는 상태로만 보이게 됩니다.

![Too many request error](./images/time-zone-list-api-too-many-request-error.png)

이러한 현상이 발생하는 이유는 Fetch API, XHR, Axios 등을 통해 네트워크 요청을 보냈을 때 요청이 실패하더라도, 브라우저가 해당 실패를 사용자 화면에 직접적인 영향을 주지 않는 상황으로 판단하면 에러를 화면에 출력하지 않기 때문입니다.

왜냐하면 결국 브라우저는 현재 페이지를 정상적으로 표시하는 것뿐만 아니라, 확장 프로그램, 외부 리소스 로드 등 다양한 외부 요인에 대해서도 동시에 처리합니다. 이 모든 상황에서 에러를 화면에 노출하게 되면 정상적인 소프트웨어 사용이 어려워질 수 있기 때문에 브라우저는 기본적으로 이러한 외부 요인으로 발생한 에러는 화면에 표시하지 않는 방향으로 동작합니다.

그 결과, 현재와 같이 네트워크 에러가 발생했더라도 해당 상태 값의 초기값이 빈 배열이며, JavaScritp 내장 객체(Built-in Object)인 배열에서 제공하는 메서드를 정상적으로 사용하고 있기 때문에 브라우저는 개발자 도구에는 에러 정보를 출력하지만 렌더링 결과에는 영향을 주지 않는 상태가 됩니다.

하지만 이 방식이 문제가 되는 이유는, 최근에는 API 요청과 같이 로딩이 발생하는 경우 Skeleton UI나 Loading Spinner와 같은 로딩 화면을 제공하는 것이 일반적인데, 로딩이 종료된 이후에도 아무런 리스트가 표시되지 않으면 개발자가 아닌 일반 사용자는 원인을 알 수 없는 오류로 인식하게 되고, 이는 결국 서비스 사용자 이탈로 이어질 수 있기 때문입니다.

<br />

> ⭐️ 지금 상황과 반대로 네트워크 요청 등으로 인해 오류가 발생했을 때 이 오류가 직접적인 렌더링 결과에 영향을 주는 경우에는 사용자 화면에는 빈 화면 또는 에러 결과문이 나타날 수도 있습니다.

<br />

## III. 반복적으로 재요청되는 API 로직 문제점을 해결하기 위한 방법 -> 캐싱

