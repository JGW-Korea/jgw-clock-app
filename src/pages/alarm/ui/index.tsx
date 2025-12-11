import { AlarmHeader } from "../../../widgets/headers";
import AlarmBottomSheet from "../../../widgets/bottom-sheet/ui/AlarmBottomSheet";
import { useAlarmConfiguration, useAlarmBottomSheetControl } from "../model";

export default function Alarm() {
  const { open, handleOpenBottomSheet, handleCloseBottomSheet } = useAlarmBottomSheetControl();
  const { state, handleTimeChange, handleToggleWeekday } = useAlarmConfiguration();

  return (
    <>
      {/* Alarm Route 전용 Header 컴포넌트 */}
      <AlarmHeader alarmList={[{ dummey: "" }]} onClick={handleOpenBottomSheet} />
      
      {/* Alarm Route 전용 Content 컴포넌트 */}
      <div style={{ fontSize: "10rem", color: "#FAFAFA" }}>
        <h2>hours: {state.hours}</h2>
        <h2>minutes: {state.minutes}</h2>
        <h2>weekdays: {state.weekdays.join(", ")}</h2>
      </div>

      {/* Alarm Route 전용 Bottom Sheet 컴포넌트 */}
      <AlarmBottomSheet
        isOpen={open}
        selectedWeekdays={state.weekdays.map(el => el.id)}
        onClose={handleCloseBottomSheet}
        onChangeTimePicker={handleTimeChange}
        onToggleWeekday={handleToggleWeekday}
      />
    </>
  );
}
