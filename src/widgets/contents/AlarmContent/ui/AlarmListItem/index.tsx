import type { AlarmData } from "@entities/alarm";
import { SwipeToDelete } from "@features/swipe-to-delete";
import ToggleSwitch from "@shared/ui/ToggleSwitch";
import { formatSelectedWeekdays } from "../../model";
import type { EditMode } from "@features/list-edit";

interface Props extends AlarmData {
  styles: CSSModuleClasses;
  activeRef: React.RefObject<HTMLLIElement | null>;
  editMode: { click: boolean; swipe: boolean };
  onDeleteListItem: (id: string | number, type?: "swipe" | undefined, cb?: ((type: keyof EditMode) => void) | undefined) => void;
  onEditModeActive: (type: keyof EditMode) => void;
  onToggleActiveAlarm: (id: number) => void;
}

/**
 * Alarm 내부에서만 사용될 ListItem 컴포넌트
*/
export default function AlarmListItem({
  id,
  styles,
  activeRef,
  editMode,
  active,
  hours,
  minutes,
  weekdays,
  onDeleteListItem,
  onEditModeActive,
  onToggleActiveAlarm
}: Props) {
  return (
    <SwipeToDelete activeRef={activeRef} id={id} editMode={editMode} onEditModeActive={onEditModeActive} onDeleteListItem={onDeleteListItem}>
      <article className={`${styles["layout-list-item"]} ${editMode.click ? styles["edit-mode"] : ""}`}>
        <button className={`${styles["layout-list-item__delete-btn"]}`} onClick={() => onDeleteListItem(id, undefined, onEditModeActive)} />
        
        <div className={`${styles["layout-list-item__content"]}`}>
          {/* 사용자가 설정한 시간과 활성화 상태를 보여주는 레이아웃 */}
          <div className={`${styles["layout-list-item__content-header"]}`}>
            <time dateTime={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}>
              <span>{hours % 12 || 12}:{String(minutes).padStart(2, "0")}</span>
              {hours >= 12 ? "PM" : "AM"}
            </time>

            {/* 사용자가 선택한 요일을 표시하는 레이아웃 */}
            <p className={`${styles["layout-list-item__content-meta"]}`}>
              {weekdays.length ? formatSelectedWeekdays(weekdays) : "None"}
            </p>
          </div>

          {/* 알림 활성화 Toggle Switch 컴포넌트 영역 */}
          <div className={`${styles["layout-list-item__content-toggle"]} ${editMode.click ? styles["hidden"] : ""}`}>
            <ToggleSwitch id={id} active={active} onToggleActiveAlarm={onToggleActiveAlarm}  />
          </div>
        </div>
      </article>
    </SwipeToDelete>
  );
}
