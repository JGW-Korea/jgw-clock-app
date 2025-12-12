import type { AlarmData } from "../../../../shared/context/types";
import { formatSelectedWeekdays } from "../../model/AlarmListItem";
import styles from "./index.module.scss";

export default function AlarmListItemContainer({ hours, minutes, weekdays }: AlarmData) {
  return (
    <article className={`${styles["alarm-list-item"]}`}>
      {/* 사용자가 설정한 시간과 활성화 상태를 보여주는 레이아웃 */}
      <div className={`${styles["alarm-list-item__header"]}`}>
        <time dateTime={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}>
          <span>{hours % 12 || 12}:{String(minutes).padStart(2, "0")}</span>
          {hours >= 12 ? "PM" : "AM"}
        </time>

        {/* 알림 활성화 Toggle Switch 컴포넌트 영역 */}
      </div>

      {/* 사용자가 선택한 요일을 표시하는 레이아웃 */}
      <p className={`${styles["alarm-list-item__meta"]}`}>
        {weekdays.length ? formatSelectedWeekdays(weekdays) : "None"}
      </p>
    </article>
  );
}
