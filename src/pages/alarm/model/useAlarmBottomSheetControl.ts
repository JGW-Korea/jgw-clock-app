import { useState } from "react";

/** Alarm Route에서 활용할 Bottom Sheet 컨트롤 커스텀 훅 */
export default function useAlarmBottomSheetControl() {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    handleOpenBottomSheet: () => setOpen(true),
    handleCloseBottomSheet: () => setOpen(true),
  }
}
