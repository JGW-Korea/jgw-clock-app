import { useState } from "react";

/**
 * Alarm Route에서 활용할 Bottom Sheet 컨트롤 커스텀 훅 
 *
 * @returns Alarm Bottom Sheet 제어 객체
 * @property {controls.open} - Alarm Bottom Sheet 활성화 상태
 * @property {controls.handleOpenBottomSheet} - Alarm Bottom Sheet를 활성화 시키는 메서드
 * @property {controls.handleCloseBottomSheet} - Alarm Bottom Sheet를 비활성화 시키는 메서드
*/
export default function useAlarmBottomSheetControl() {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    handleOpenBottomSheet: () => setOpen(true),
    handleCloseBottomSheet: () => setOpen(true),
  }
}
