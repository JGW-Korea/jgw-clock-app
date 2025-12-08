import { TimePicker } from "../../../../features/time-picker";
import { BottomSheet } from "../../../../shared/bottom-sheet";
import { ALARM_WEEKDAYS } from "../../consts";
import Check from "../../../../shared/assets/icons/check.svg?react";
import styles from "./index.module.scss";
import { useTimePickerDraggable } from "../../model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const selectedWeekdays = [1, 2, 5]; // 임시

export default function AlarmBottomSheet({ isOpen, onClose }: Props) {
  const { timePickerDraggable, handleTimePickerMouseLeave, handleTimePickerMouseOver } = useTimePickerDraggable();

  return (
    <BottomSheet disableDrag={timePickerDraggable} isOpen={isOpen} onClose={onClose} sheetTitle="Add Alarm" showRightButton={true} onRightButtonClick={() => console.log("Hello")} >
      <div className={`${styles["alarm-sheet-content"]}`}>
        <TimePicker onMouseOver={handleTimePickerMouseOver} onMouseLeave={handleTimePickerMouseLeave} />

        <ul className={`${styles["alarm-sheet-content__list"]}`}>
          {ALARM_WEEKDAYS.map((weekday) => (
            <li key={weekday.key}>
              {/* button 내부 자식 요소에 div 등의 */}
              <button>
                {weekday.label}

                {selectedWeekdays.includes(weekday.id) && (
                  <Check width={24} height={24} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
}
