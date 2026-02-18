import { useWorldTimeList } from "@entities/world";
import { useBottomSheetControls } from "@features/bottom-sheet";
import { useListEditControls } from "@features/list-edit";
import WorldHeader from "@widgets/headers/WorldHeader";
// import { WorldBottomSheet } from "@widgets/bottom-sheet/WorldBottomSheet";
import { WorldContent } from "@widgets/contents/WorldContent";

export default function WorldPage() {
  const { editMode, handleEditModeActive } = useListEditControls();
  const { handleOpenBottomSheet, handleCloseBottomSheet } = useBottomSheetControls();
  const { worldTimeList, handleDelete } = useWorldTimeList(handleCloseBottomSheet, handleEditModeActive);

  return (
    <>
      <WorldHeader
        worldTimeList={worldTimeList}
        editMode={editMode}
        onClickEditModeActive={handleEditModeActive}
        onClickOpenSheet={handleOpenBottomSheet}
      />
      
      {/* 사용자가 추가한 세계 시간 리스트를 출력한다. */}
      <WorldContent
        worldTimeList={worldTimeList}
        editMode={editMode}
        onDelete={handleDelete}
        onEditModeActive={handleEditModeActive}
      />

      {/* <WorldBottomSheet
        isOpen={isOpen}
        onClose={handleCloseBottomSheet}
        onClickAppendWorld={handleAppendWorldTime}
      /> */}
    </>
  );
}
