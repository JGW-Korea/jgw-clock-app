import { useWorldTimeList } from "@entities/world";
import { useHeaderEditSheetControls } from "@shared/model";
import { WorldBottomSheet } from "@widgets/bottom-sheet";
import { WorldContent } from "@widgets/contents";
import { WorldHeader } from "@widgets/headers";

export default function WorldPage() {
  const { controlState, handleOpenBottomSheet, handleCloseBottomSheet, handleEditModeActive } = useHeaderEditSheetControls();
  const { worldTimeList, handleAppendWorldTime, handleDelete } = useWorldTimeList(handleCloseBottomSheet, handleEditModeActive);

  return (
    <>
      <WorldHeader
        worldTimeList={worldTimeList}
        editMode={controlState.editMode}
        onClickEditModeActive={handleEditModeActive}
        onClickOpenSheet={handleOpenBottomSheet}
      />
      
      {/* 사용자가 추가한 세계 시간 리스트를 출력한다. */}
      <WorldContent
        worldTimeList={worldTimeList}
        editMode={controlState.editMode}
        onDelete={handleDelete}
        onEditModeActive={handleEditModeActive}
      />

      <WorldBottomSheet
        isOpen={controlState.sheetOpen}
        onClose={handleCloseBottomSheet}
        onAppendTimeList={handleAppendWorldTime}
      />
    </>
  );
}
