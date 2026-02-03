import { useEffect, useState } from "react";
import { getListTimeZone, type ListTimeZone } from "../api";
import { AxiosError } from "axios";
import { getCacheStorage, setCacheStorage } from "@shared/db/cacheStorage";

/**
 * World Bottom Sheet 컴포넌트 마운트 시 사이드 이펙트(Side-Effect) 발생시키기는 커스텀 훅
 * - 컴포넌트가 렌더링 이후 Time Zone DB API를 호출한다.
 * - 이후 worldTimeListData 상태를 갱신하여 리렌더링을 발생시켜 사용자 화면에 반영시킨다.
*/
export default function useWorldTimeFetch() {
  const [worldTimeListData, setWorldTimeListData] = useState<ListTimeZone[]>([]);

  // 최초 렌더링(마운트) 시 한 번만 API를 호출하면 되기 때문에 의존성 배열을 비워둔다.
  useEffect(() => {
    const fetchListTimeZone = async () => {
      try {
        const cached = await getCacheStorage<ListTimeZone[]>("listTimeZone"); // IndexedDB에 listTimeZone 데이터 조회 요청을 발생시킨다.

        // List Time Zone 캐시 데이터가 존재하지 않거나, 캐시 기간이 만료된 경우
        if(cached === undefined || cached.expires < Date.now()) {
          const response = await getListTimeZone();

          // TimeZoneDB 요청이 실패한 경우 -> TimeZoneDB에서 설정한 message 값으로 에러문을 출력한다.
          if(response.data.status === "FAILED") {
            throw new Error(response.data.message);
          }

          await setCacheStorage("listTimeZone", response.data.zones);
        
          setWorldTimeListData(response.data.zones); // 응답 결과를 바탕으로 상태를 갱신시켜 준다.
          return;
        }

        setWorldTimeListData(cached.data); // List Time Zone 캐시 데이터가 존재하는 경우
      } catch(error) {
        // Axios 에러가 발생한 경우
        if(error instanceof AxiosError) {
          switch(error.code) {
            case "ERR_NETWORK": {
              console.error("Axios 요청에서 Network Error가 발생했습니다.", error);
            }
          }
        }

        console.error(error);
      }
    }

    fetchListTimeZone();
  }, []);

  return { worldTimeListData };
}
