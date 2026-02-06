// ----------------------------------
// Time Zone DB API 타입 정의
// ----------------------------------

// Time Zone List API - 각 Data 항목 타입 구성
export type TimeZoneListDataType = {
  countryCode: string;
  countryName: string;
  gmtOffset: number;
  timestamp: number;
  zoneName: string;
}

// Time Zone List API 타입 구성
export interface TimeZoneListType {
  [key: string]: unknown;
  data: {
    status: "OK" | "FAILED";
    message: string;
    zones: TimeZoneListDataType[]
  }
}

// ----------------------------------
// 가공된 World Time 상태 데이터
// ----------------------------------
export type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}