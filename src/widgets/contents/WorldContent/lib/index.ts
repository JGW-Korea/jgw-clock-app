import type { WordTimeListType } from "@entities/world";
import type { TimeStatus } from "../model";

const getLocalDate = (timeZone: string, now: Date) => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    dateStyle: "short",
    timeStyle: "short",
    hour12: true
  }).formatToParts(now).filter(format => format.type !== "literal");
}

function getFullYear(targetDate: Intl.DateTimeFormatPart[]) {
  return targetDate
    .filter((element) => ["year", "month", "day"].includes(element.type))
    .map(data => data.value)
    .join("-");
}

function getFindIntlDateTimeFormatValue(date: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return date.find((element) => element.type === type)!.value as string
}

function fullYearCompare(from: string, to: string): "Today" | "Tomorrow" | "Yesterday" {
  if(from === to) return "Today";

  const a = from.split("-").map(Number).reduce((prev, curr) => prev + curr);
  const b = to.split("-").map(Number).reduce((prev, curr) => prev + curr);
  
  if(a < b) return "Tomorrow";
  else {
    return "Yesterday"
  }
}

/**
 * 화면에 반영할 시간대를 갱신하기 위한 보조 함수
 * 
 * @param {WordTimeListType} world - 사용자가 설정한 도시 정보
 * @param {React.Dispatch<React.SetStateAction<TimeStatus>>} world - 사용자가 설정한 도시 정보
*/
export function updateTime(world: WordTimeListType, setState: React.Dispatch<React.SetStateAction<TimeStatus>>) {
  const now = new Date(); // Intl 기준점이 될 현재 사용자의 시간대를 가지고 온다.
  
  const from = getLocalDate(world.from, now); // 사용자 시간대
  const to = getLocalDate(world.to, now);     // 선택한 도시의 시간대

  // 상태를 갱신한다.
  setState({
    day: fullYearCompare(getFullYear(from), getFullYear(to)),
    target: getFindIntlDateTimeFormatValue(to, "dayPeriod").replaceAll(".", "").toUpperCase() as "AM" | "PM",
    time: `${getFindIntlDateTimeFormatValue(to, "hour")}:${getFindIntlDateTimeFormatValue(to, "minute")}`
  });
}