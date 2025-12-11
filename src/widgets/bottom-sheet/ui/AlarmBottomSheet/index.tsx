import { TimePicker } from "../../../../features/time-picker";
import { BottomSheet } from "../../../../shared/bottom-sheet";
import { ALARM_WEEKDAYS } from "../../consts";
import Check from "../../../../shared/assets/icons/check.svg?react";
import styles from "./index.module.scss";
import { useAlarmSchedule, useTimePickerDraggable } from "../../model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlarmBottomSheet({ isOpen, onClose }: Props) {
  const { alarmState, dispatch, handleTimeChange, handleToggleWeekday, handleAddAlarm } = useAlarmSchedule();
  const { timePickerDraggable, handleTimePickerMouseLeave, handleTimePickerMouseOver } = useTimePickerDraggable();

  const selectedWeekdays = alarmState.weekdays.map(el => el.numberValue); // 선택된 요일 -> alarmState에서 파생되는 상태

  return (
    <BottomSheet
      disableDrag={timePickerDraggable}
      isOpen={isOpen}
      onClose={() => {
        // onClose 이벤트 핸들러가 발동한다고 AlarmBottomSheet 컴포넌트 자체가 unmount가 되지는 않는다.
        // 이로 인해, alarmState를 초기화 시킨 다음에 BottomSheet를 비활성화를 시켜준다.
        dispatch({ type: "ALRARM_STATE_INIT" });
        onClose();
      }}
      sheetTitle="Add Alarm"
      showRightButton={true}
      onRightButtonClick={() => handleAddAlarm(alarmState, onClose)}
    >
      <div className={`${styles["alarm-sheet-content"]}`}>
        <TimePicker onPointerOver={handleTimePickerMouseOver} onPointerLeave={handleTimePickerMouseLeave} updateTimePicker={handleTimeChange} />

        <ul className={`${styles["alarm-sheet-content__weekdays"]}`}>
          {ALARM_WEEKDAYS.map((weekday) => (
            <li key={weekday.key} onClick={() => handleToggleWeekday(weekday.id, weekday.key)}>
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
