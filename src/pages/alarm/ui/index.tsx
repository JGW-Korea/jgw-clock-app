import { AlarmHeader } from "../../../widgets/headers";
import AlarmBottomSheet from "../../../widgets/bottom-sheet/ui/AlarmBottomSheet";
import { useAlarmBottomSheetControl } from "../model";
import AlarmContent from "../../../widgets/contents/ui/AlarmContent";

export default function Alarm() {
  
  const { controlState, handleOpenBottomSheet, handleCloseBottomSheet, handleEditModeActive } = useAlarmBottomSheetControl();

  return (
    <>
      {/* Alarm Route 전용 Header 컴포넌트 */}
      <AlarmHeader editMode={controlState.editMode} onClickEditModeActive={handleEditModeActive} onClickOpenSheet={handleOpenBottomSheet} />
      
      {/* Alarm Route 전용 Content 컴포넌트 */}
      <AlarmContent />

      {/* Alarm Route 전용 Bottom Sheet 컴포넌트 */}
      <AlarmBottomSheet isOpen={controlState.sheetOpen} onClose={handleCloseBottomSheet}/>
    </>
  );
}
