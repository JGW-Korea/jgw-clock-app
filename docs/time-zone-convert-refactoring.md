![Time Zone Convert Thumbnail](./images/timezone-thumbnail.png)

> ☝️ 이 문서는 세계 시간 추가 시, 사용자 시간대(from)와 대상 도시 시간대(to) 간의 시차를 Time Zone DB의 Convert Time Zone API를 통해 계산하던 기존 로직을, 단순 계산식 기반으로 리팩토링한 과정을 정리한 문서입니다.

<br />

## I. 리팩토링 이전의 Convert Time Zone API를 이용한 시차 계산 로직

기존에는 **세계 도시 목록**과, **사용자 시간대와 대상 도시 시간대 간의 시차를 계산**하기 위해 Time Zone DB에서 제공하는 **List Time Zone API**와 **Convert Time Zone API**를 활용했습니다.

**List Time Zone API의 경우** Clock 프로젝트에서는 **별도의 웹 서버와 WAS를 구축하지 않았기 때문에, 세계 도시 목록을 구성하기 위한 용도로 필수적으로 사용**해야 했습니다. 그러나 **사용자 시간대와 대상 도시 시간대 간의 시차를 계산하는 로직을 구현하던 당시**에는, **`Date` 객체를 이용해 시차 계산 로직을 직접 구현하는 방식은 정확한 시차를 계산하지 못할 것 같다고 생각**했습니다.

그렇기 때문에 직접 시차를 계산하기보다는, **외부 API를 활용하는 것이 더 정확한 계산을 수행**할 수 있다고 판단했습니다. 마침 현재 사용 중인 Time Zone DB에서 **두 시간대 간의 시차를 계산해 주는 Convert Time Zone API를 제공**하고 있었기 때문에, **해당 API를 기반으로 시차를 계산하는 방식이 보다 정확**할 것이라고 판단했습니다. 이에 따라 다음과 같이 Convert Time Zone API를 활용해 시차를 구하는 로직을 작성했습니다.

<br />

```tsx
// 기존 로직
const handleAppendWorldTime: WorldAppendHandler = async (from, to) => {
  const { data } = await axios.get(`http://api.timezonedb.com/v2.1/convert-time-zone?key=${import.meta.env.VITE_TIME_ZONE_API}&format=json&from=${Intl.DateTimeFormat().resolvedOptions().timeZone}&to=${to}`) as ConvertTimeZoneType;
  
  const newData: WordTimeListType = {
    name: from,
    from: data.fromZoneName,
    to: data.toZoneName,
    offset: data.offset
  }

  // 사용자가 등록한 세계 시계 리스트 정보를 포함하고 있는 상태를 업데이트하여, UI를 갱신한다. (UI 갱신용)
  setWorldTimeList((current) => {
    if(!current.length) { // 아무런 정보를 포함하고 있지 않는 경우
      localStorage.setItem("worldTime", JSON.stringify([newData]));
      return [newData];
    }

    // 하나 이상의 정보를 포함하고 있는 경우 -> 중복된 데이터는 추가하면 안되기 때문에 별도의 검증을 하여 추가한다.
    for(let prevData of current) {
      if(prevData.to === to) {
        return [
          ...current
        ];
      }
    }

    // 정보를 포함하고 있으면서, 중복된 나라가 없는 경우 이전 정보와 새로운 정보를 결합한 상태를 반환한다.
    localStorage.setItem("worldTime", JSON.stringify([...current, newData]));
    return [
      ...current,
      newData
    ];
  });

  handleCloseBottomSheet()
}
```

<br />

하지만 프로젝트 개발 완료 이후, 사용자가 선택한 도시와 사용자 도시 간의 **시차**를 **Convert Time Zone API에서 제공하는 `offset` 값을 기준으로 수동 계산**하여 **상태에 반영하던 로직**을 두 도시 간의 시간을 보다 **정확하게 반영하기 위해 Intl API 기반으로 리팩토링을 진행**했습니다.

> offset 값을 기준으로 수동 계산하여 상태에 반영하던 로직을 Intl API 기반으로 리팩토링한 내용은 [｢도시 시간 계산 로직 리팩토링 과정｣](./city-time-calculation-refactoring.md) 문서에서 자세하게 확인할 수 있습니다.

이를 반대로 생각하면, 리팩토링 과정에서 **두 도시 간의 시차를 Intl API를 통해 계산하고 있었다는 의미**가 됩니다. 따라서 기존에 **Local Storage와 상태(State)에 반영하기 이전**에 **Convert Time Zone API에 요청을 보내 두 도시 간의 시차를 구하는 방식**은 사용자의 **네트워크 환경에 따라 불필요한 렌더링 지연을 유발**할 수 있는 문제점을 야기할 뿐입니다.

실제로 네트워크 환경이 좋지 않은 경우 렌더링 지연 문제가 발생하는지 확인하기 위해, **"개발자 도구 > Performance" 패널**에서 **네트워크 성능을 3G로 제한하여 확인**해보겠습니다.

<br />

![Convert Time Zone API 지속기간(Duration) 결과](./images/convert-time-zone-api-network-duration.png)

<br />

위 이미지를 보면 알 수 있듯이 **Convert Time Zone API의 지속 기간(Duration)** 이 **약 2.04s 동안 유지**되는 것을 확인할 수 있습니다. 하지만 여기서 중요한 점은 **네트워크 요청이 async 함수를 통해 비동기로 동작**하고 있다는 것입니다.

이때 많은 개발자가 **오해하는 부분 중 하나**는 **비동기 작업을 동기처럼 처리하기 위해 await를 사용한다는 점**입니다. 이로 인해 **async/await 기반으로 수행되는 비동기 작업 자체가 동기 작업으로 변경되어 처리된다고 이해하고 로직을 작성**하기도 합니다.

하지만 await는 비동기 작업 자체를 동기 작업으로 변환하는 것이 아니라, **async 함수 내부 실행 흐름만 일시적으로 정지**시키고 **비동기 작업이 완료된 후에 다시 실행을 재개하도록 만드는 역할**을 합니다. 따라서 **async 함수 내부에서는 awiat 아래의 로직이 비동기 작업 완료 이후 실행**되지만, **async 함수 외부에 존재하는 동기 작업은 해당 비동기 작업의 완료 여부와 관계없이 먼저 수행**됩니다.

<br />

![Convert Time Zone API Result](./images/convert-time-zone-api-performance-result.png)

<br />

따라서 **async/await 기반 비동기 로직의 동작 원리를 고려**했을 때, 기존 **Convert Time Zone API에 요청을 보내 시차를 계산하는 구조**에서는 해당 요청의 **응답을 전달받기 전까지 상태(State)를 갱신하거나 Local Storage에 정보를 반영할 수 없습니다.**

<br />

![Convert Time Zone Async 비동기 함수 내부 testPerformance 함수 실행](./images/test-performance-function.png)

> 위 이미지는 async 함수의 동작 원리를 테스트하기 위해, Convert Time Zone API의 응답 결과를 전달받은 이후 10,000개의 원소를 가진 배열을 생성하는 testPerformance 함수가 호출되고 있는 결과입니다.

<br />

또한 **`handleAppendWorldTime` 비동기 함수**의 **마지막 시점에 Bottom Sheet를 비활성화하는 함수를 호출**하고 있기 때문에 **API 응답을 전달받기 전까지는 Bottom Sheet가 닫히지 않게 됩니다.**

<br />

[![Convert Time Zone API 응답 대기로 인해 Bottom Sheet 비활성화 시점이 지연되는 화면](./images/convert-time-list-bottom-sheet-disabled.png)](https://drive.google.com/file/d/1M6jkI90TcNBSUUpYCkJxd7zSSdm_cGCE/view?usp=sharing)

> Markdown은 비디오를 직접 삽입할 수 없기 때문에, 해당 이미지는 API 응답을 전달받기 전까지 Bottom Sheet가 닫히지 않는 과정을 캡처한 화면입니다. 이미지를 클릭하면 Google Drive에 업로도된 비디오 공유 URL로 이동할 수 있습니다.

<br />

이처럼 **Convert Time Zone API를 통해 시차를 계산하는 구조**에서는 **사용자의 네트워크 환경이 좋지 않을수록 응답 전달 시간이 더욱 지연**되고, **그만큼 상태 반영 및 UI 갱신 시점도 함께 늦어지게 됩니다.** 결과적으로 **사용자 입장에서는 렌더링이 지연되는 것처럼 인식될 수 있는 상황이 발생**하게 됩니다.

<br />

## II. Intl API 기반으로 두 도시 간의 시차 계산 로직 리팩토링

앞서 [｢I. 리팩토링 이전의 Convert Time Zone API를 이용한 시차 계산 로직｣](#i-리팩토링-이전의-convert-time-zone-api를-이용한-시차-계산-로직) 목차에서 **Convert Time Zone API를 통해 시차를 계산**할 경우, **네트워크 환경에 따라 렌더링이 지연**되는 것처럼 인식될 수 있는 문제 상황을 살펴보았습니다.

또한 해당 목차에서는 이와 같은 **네트워크 의존 구조의 문제를 해결하기 위한 방법도 간략하게 언급**했습니다. 기존에는 Convert Time Zone API에서 제공하는 **`offset` 값을 기준으로 시차를 수동 계산하여 화면에 반영했지만, 보다 정확한 시간 반영을 위해 Intl API 기반으로 리팩토링을 진행**했다는 내용이었습니다.

이 방식이 어떻게 문제를 해결하게 되는지 살펴보기 전에, 먼저 Convert Time Zone API를 호출하는 `handleAppendWorldTime` 함수에 **전달되는 매개변수**와 **응답 결과**를 **출력한 결과를 확인**해보겠습니다.

<br />

```tsx
// 세계 시계 추가 이벤트 리스너 
  const handleAppendWorldTime: WorldAppendHandler = async (targetCity, targetTimeZone) => {
    const { data } = await axios.get(`http://api.timezonedb.com/v2.1/convert-time-zone?key=${import.meta.env.VITE_TIME_ZONE_API}&format=json&from=${Intl.DateTimeFormat().resolvedOptions().timeZone}&to=${targetTimeZone}`);

    // 매개변수로 전달되는 값 출력
    console.log("targetCity:", targetCity);
    console.log("targetTimeZone:", targetTimeZone);

    console.log("data:", data); // Convert Time Zone API 응답 결과
    console.log("userTimeZone:", Intl.DateTimeFormat().resolvedOptions().timeZone); // 사용자 지역대

    // 새로운 상태 데이터
    const newData: WordTimeListType = {
      name: targetCity,
      from: data.fromZoneName,
      to: data.toZoneName,
      offset: data.offset
    }

    // 기존 로직 동일...
  }
```

```json
{
  // 매개변수로 전달되는 값
  "targetCity": "Algiers, Algeria",
  "targetTimeZone": "Africa/Algiers",
  
  // Convert Time Zone API 전체 응답 결과
  "data": {
    "status": "OK",
    "message": "",
    "fromZoneName": "Asia/Seoul",
    "fromAbbreviation": "KST",
    "fromTimestamp": 1770468611,
    "toZoneName": "Africa/Algiers",
    "toAbbreviation": "CET",
    "toTimestamp": 1770439811,
    "offset": -28800
  },
  
  // 사용자 지역대
  "userTimeZone": "Asia/Seoul",
}
```

> 위 결과는 `console`을 통해 출력된 값을 JSON 구조로 재구성하여 가독성 있게 표현한 것입니다. 실제 출력 결과는 [여기](./images/convert-time-zone-console-result.png)에서 확인할 수 있습니다.

<br />

출력 결과를 보면 알 수 있듯이, 사용자가 선택한 도시에 대한 **새로운 데이터를 정의할 때 필요한 값은 다음과 같습니다.**

- `name`: 화면에 표시될 사용자가 선택한 도시
- `from`: 사용자 시간대를 의미하는 지역대(Time Zone)
- `to`: 사용자가 선택한 지역대(Time Zone)
- `offset`: 사용자 지역과 선택한 지역 간 시차 값

하지만 코드를 보면 **`name`은 매개변수로 전달되는 `targetCity` 값을 그대로 사용**하고 있으며, **`from` 또한 Intl API를 통해 구성할 수 있음에도 Convert Time Zone API 요청 시 쿼리 매개변수에 Intl API 값을 전달한 뒤, 응답 결과의 `fromZoneName` 값을 다시 사용**하고 있습니다.

또한 **`to` 역시 매개변수로 전달되는 `targetTimeZone` 값을 사용할 수 있음에도, 응답 결과에 포함된 `toZoneName` 값을 사용**하고 있습니다. **실제로 Convert Time Zone API 응답 결과를 통해 직접적으로 활용되는 값은 `offset` 하나뿐**입니다.

그러나 앞서 설명한 것처럼 **두 도시 간 시차 게산**은 **이미 Intl API를 통해 네트워크 요청 없이 클라이언트 환경에서 계산하여 반영할 수 있는 상태**입니다.

만약 시차 계산에 필요한 **대상 지역대(Time Zone) 정보를 확보할 수 없다면 Convert Time Zone API 사용이 필요**하겠지만, 이 또한 세계 도시 목록을 조회하기 위해 사용된 **List Time Zone API에서 지역대 정보를 함께 제공**하고 있습니다. 따라서 해당 API를 통해 구성된 List 컴포넌트에서 클릭 이벤트가 발생할 경우, **비교 대상 지역대 정보를 확보**할 수 있으며 **사용자 지역대 또한 Intl API를 통해 구성**할 수 있습니다.

결과적으로 Convert Time Zone API에 의존하는 구조는 **비동기 네트워크 요청 특성상 네트워크 환경이 좋지 않을 경우 응답 지연이 발생**할 수 있으며, 이는 **UI 반영 시점 지연으로 이어질 수 있습니다.** 반면 **두 도시 간 시차**를 **Intl API 기반으로 클라이언트에서 직접 계산**하도록 리팩토링할 경우 **네트워크 의존성을 제거할 수 있으며, 해당 문제를 보다 단순한 구조로 해결**할 수 있습니다.

<br />

```tsx
const handleAppendWorldTime: WorldAppendHandler = async (targetCity, targetTimeZone) => {
  const now = new Date(); // 기준이 될 현재 시간을 구한다.
  
  const fromDate = new Date(now.toLocaleString("en-US")).getTime(); // timeZone 옵션을 지정을 안하면 자동으로 사용자 지역대로 시간을 계산한다.
  const toDate = new Date(now.toLocaleString("en-US", { timeZone: targetTimeZone })).getTime();

  const newData: WordTimeListType = {
    from: Intl.DateTimeFormat().resolvedOptions().timeZone,     // 사용자 도시
    name: targetCity,                                           // 선택한 도시의 전체 이름
    to: targetTimeZone,                                         // 선택한 도시의 Time Zone 이름
    offset: Math.round((toDate - fromDate) / (1000 * 60 * 60))  // 두 도시 간 시차(시(hours) 단위)
  }

  // 기존 로직 동일...
}
```

<br />

이처럼 현재 시간(now)을 먼저 구한 뒤, 해당 값을 기준으로 `Date` 인스턴스 메서드인 **`toLocaleString()`을 사용**하면 **Intl API 기반으로 특정 지역대(Time Zone)의 시간을 구성**할 수 있습니다.

이때 날짜 포맷을 **`en-US` 방식으로 지정한 이유는 `Date` 객체가 안정적으로 해석할 수 있는 날짜 문자열 포맷을 보장하기 위함**입니다. 또한 **옵션을 지정하지 않을 경우 기본값으로 사용자의 지역대를 기준으로 시간이 구성되며, `timeZone` 옵션을 명시하면 해당 지역대 기준의 시간을 가져올 수 있습니다.**

이렇게 **생성된 두 지역대의 시간을 각각 밀리초 단위로 변환한 뒤 그 차이를 계산**하면, **네트워크 요청 없이도 클라이언트 환경에서 두 지역 간 시차(offset)를 계산**할 수 있습니다. 따라서 시차 계산 과정이 더 이상 **네트워크 응답에 의존하지 않고 로컬 계산 로직에 의해 처리되도록 개선**됩니다.

<br />

[![Convert Time Zone Refactoring Performance 결과](./images/convert-time-zone-refactoring-performance.png)](https://drive.google.com/file/d/1u0DgtJ0ycr_k_9gok7V8yR-VPoqsv1Kc/view?usp=sharing)

> Markdown은 비디오를 직접 삽입할 수 없기 때문에, 해당 이미지는 네트워크 요청 없이 클라이언트 환경에서 두 지역 간 시차(offset)를 계산하도록 리팩토링한 이후, 네트워크 성능을 3G로 제한한 상태에서 Bottom Sheet가 닫히는 과정을 캡처한 화면입니다. 이미지를 클릭하면 Google Drive에 업로드된 비디오 공유 URL로 이동할 수 있습니다.

<br />

영상을 보면 알 수 있듯이, 시차 계산을 위한 네트워크 요청이 제거되었기 때문에 **이전과 동일하게 네트워크 성능을 3G로 제한한 상태**에서 **세계 도시 시간을 추가하더라도 네트워크 환경에 따른 UI 반영 지연 문제가 발생하지 않는 것을 확인**할 수 있습니다.