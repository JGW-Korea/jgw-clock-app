import type { AlarmData } from "../../../../shared/context/types";
import { ToggleSwitch } from "../../../../shared/toggle-switch";
import { formatSelectedWeekdays } from "../../model/AlarmListItem";
import styles from "./index.module.scss";

interface Props extends AlarmData {
  editMode: boolean;
  onDeleteAlarm: (id: number, cb?: () => void) => void;
  onEditModeActive: () => void;
  onToggleActiveAlarm: (id: number) => void;
}

export default function AlarmListItemContainer({ hours, minutes, weekdays, editMode, id, active, onDeleteAlarm, onEditModeActive, onToggleActiveAlarm }: Props) {
  return (
    <article className={`${styles["alarm-list-item"]} ${editMode ? styles["edit-mode"] : ""}`}>
      <button className={`${styles["alarm-list-item__delete-btn"]}`} onClick={() => onDeleteAlarm(id, onEditModeActive)} />
      
      <div className={`${styles["alarm-list-item__content"]}`}>
        {/* 사용자가 설정한 시간과 활성화 상태를 보여주는 레이아웃 */}
        <div className={`${styles["alarm-list-item__content-header"]}`}>
          <time dateTime={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}>
            <span>{hours % 12 || 12}:{String(minutes).padStart(2, "0")}</span>
            {hours >= 12 ? "PM" : "AM"}
          </time>

          {/* 알림 활성화 Toggle Switch 컴포넌트 영역 */}
          <div className={`${styles["alarm-list-item__content-toggle"]} ${editMode ? styles["hidden"] : ""}`}>
            <ToggleSwitch id={id} active={active} onToggleActiveAlarm={onToggleActiveAlarm}  />
          </div>
        </div>

        {/* 사용자가 선택한 요일을 표시하는 레이아웃 */}
        <p className={`${styles["alarm-list-item__content-meta"]}`}>
          {weekdays.length ? formatSelectedWeekdays(weekdays) : "None"}
        </p>
      </div>
    </article>
  );
}
