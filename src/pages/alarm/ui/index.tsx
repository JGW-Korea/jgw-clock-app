import { useHeaderEditSheetControls } from "@shared/model";
import { AlarmBottomSheet } from "@widgets/bottom-sheet";
import { AlarmContent } from "@widgets/contents";
import { AlarmHeader } from "@widgets/headers";

export default function AlarmPage() {
  const { controlState, handleOpenBottomSheet, handleCloseBottomSheet, handleEditModeActive } = useHeaderEditSheetControls();

  return (
    <>
      {/* Alarm Route 전용 Header 컴포넌트 */}
      <AlarmHeader editMode={controlState.editMode} onClickEditModeActive={handleEditModeActive} onClickOpenSheet={handleOpenBottomSheet} />
      
      {/* Alarm Route 전용 Content 컴포넌트 */}
      <AlarmContent editMode={controlState.editMode} onEditModeActive={handleEditModeActive} />

      {/* Alarm Route 전용 Bottom Sheet 컴포넌트 */}
      <AlarmBottomSheet isOpen={controlState.sheetOpen} onClose={handleCloseBottomSheet}/>
    </>
  );
}
