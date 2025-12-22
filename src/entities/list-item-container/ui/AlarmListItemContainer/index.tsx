import { ToggleSwitch } from "@shared/ui";
import type { AlarmData } from "../../../../shared/context/types";
import { formatSelectedWeekdays } from "../../model/AlarmListItem";
import styles from "./index.module.scss";

interface Props extends AlarmData {
  editMode: { click: boolean; swipe: boolean };
  onDeleteListItem: (id: string | number, type?: "swipe" | undefined, cb?: (() => void) | undefined) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
  onToggleActiveAlarm: (id: number) => void;
}

export default function AlarmListItemContainer({ hours, minutes, weekdays, editMode, id, active, onDeleteListItem, onEditModeActive, onToggleActiveAlarm }: Props) {
  return (
    <article className={`${styles["alarm-list-item"]} ${editMode.click ? styles["edit-mode"] : ""}`}>
      <button className={`${styles["alarm-list-item__delete-btn"]}`} onClick={() => onDeleteListItem(id, undefined, onEditModeActive)} />
      
      <div className={`${styles["alarm-list-item__content"]}`}>
        {/* 사용자가 설정한 시간과 활성화 상태를 보여주는 레이아웃 */}
        <div className={`${styles["alarm-list-item__content-header"]}`}>
          <time dateTime={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}>
            <span>{hours % 12 || 12}:{String(minutes).padStart(2, "0")}</span>
            {hours >= 12 ? "PM" : "AM"}
          </time>

          {/* 사용자가 선택한 요일을 표시하는 레이아웃 */}
          <p className={`${styles["alarm-list-item__content-meta"]}`}>
            {weekdays.length ? formatSelectedWeekdays(weekdays) : "None"}
          </p>
        </div>

        {/* 알림 활성화 Toggle Switch 컴포넌트 영역 */}
        <div className={`${styles["alarm-list-item__content-toggle"]} ${editMode.click ? styles["hidden"] : ""}`}>
          <ToggleSwitch id={id} active={active} onToggleActiveAlarm={onToggleActiveAlarm}  />
        </div>
      </div>
    </article>
  );
}
