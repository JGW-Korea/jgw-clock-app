import axios from "axios";

export type ListTimeZone = {
  countryCode: string;
  countryName: string;
  gmtOffset: number;
  timestamp: number;
  zoneName: string;
}

interface ListTimeZoneResponse {
  status: "OK" | "FAILED";
  message: string;
  zones: ListTimeZone[];
}

/**
 * TimeZoneDB에서 지원하는 모든 시간대를 요청하는 API 로직
 * - 요청 로직만 구성하고, 예외 처리는 함수를 호출하는 구간에서 처리를 한다.
*/
export default async function getListTimeZone() {
  const response = await axios.get<ListTimeZoneResponse>("/api/timezone/list");
  return response;
}