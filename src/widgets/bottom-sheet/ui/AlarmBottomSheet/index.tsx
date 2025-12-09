import { TimePicker } from "../../../../features/time-picker";
import { BottomSheet } from "../../../../shared/bottom-sheet";
import { ALARM_WEEKDAYS } from "../../consts";
import Check from "../../../../shared/assets/icons/check.svg?react";
import styles from "./index.module.scss";
import { useTimePickerDraggable } from "../../model";

interface Props {
  isOpen: boolean;
  selectedWeekdays: number[];
  onClose: () => void;
  onChangeTimePicker: (isPMState: boolean, hours: number, minutes: number) => void;
  onToggleWeekday: (weekdayId: number) => void;
}

export default function AlarmBottomSheet({ isOpen, selectedWeekdays, onClose, onChangeTimePicker, onToggleWeekday }: Props) {
  const { timePickerDraggable, handleTimePickerMouseLeave, handleTimePickerMouseOver } = useTimePickerDraggable();

  return (
    <BottomSheet disableDrag={timePickerDraggable} isOpen={isOpen} onClose={onClose} sheetTitle="Add Alarm" showRightButton={true} onRightButtonClick={() => console.log("Hello")} >
      <div className={`${styles["alarm-sheet-content"]}`}>
        <TimePicker onMouseOver={handleTimePickerMouseOver} onMouseLeave={handleTimePickerMouseLeave} updateTimePicker={onChangeTimePicker} />

        <ul className={`${styles["alarm-sheet-content__list"]}`}>
          {ALARM_WEEKDAYS.map((weekday) => (
            <li key={weekday.key} onClick={() => onToggleWeekday(weekday.id)}>
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
