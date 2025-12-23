import { WorldHeader } from "../../../widgets/headers";
import { useHeaderEditSheetControls } from "../../../shared/model";
import { useWorldTimeList } from "../../../entities/world";
import { WorldBottomSheet } from "@widgets/bottom-sheet";
import { WorldContent } from "@widgets/contents";

export default function World() {
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
