import { useState } from "react";

/**
 * Bottom Sheet 활성화 제어를 위한 커스텀 훅
*/
export default function useBottomSheetControls() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return {
    isOpen,
    handleOpenBottomSheet: () => setIsOpen(true),
    handleCloseBottomSheet: () => setIsOpen(false),
  }
}
