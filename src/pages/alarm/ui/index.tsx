import { useBottomSheetControls } from "@features/bottom-sheet";
import { useListEditControls } from "@features/list-edit";
import AlarmHeader from "@widgets/headers/AlarmHeader";
import { AlarmContent } from "@widgets/contents/AlarmContent";
import { AlarmBottomSheet } from "@widgets/bottom-sheet/AlarmBottomSheet";

export default function AlarmPage() {
  const { editMode, handleEditModeActive } = useListEditControls();
  const { isOpen, handleOpenBottomSheet, handleCloseBottomSheet } = useBottomSheetControls();

  return (
    <>
      {/* Alarm Route 전용 Header 컴포넌트 */}
      <AlarmHeader editMode={editMode} onClickEditModeActive={handleEditModeActive} onClickOpenSheet={handleOpenBottomSheet} />
      
      {/* Alarm Route 전용 Content 컴포넌트 */}
      <AlarmContent editMode={editMode} onEditModeActive={handleEditModeActive} />

      {/* Alarm Route 전용 Bottom Sheet 컴포넌트 */}
      <AlarmBottomSheet isOpen={isOpen} onClose={handleCloseBottomSheet}/>
    </>
  );
}
