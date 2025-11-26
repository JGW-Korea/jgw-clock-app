import BottomSheetBackground from "./components/BottomSheetBackground";
import BottomSheetContainer from "./components/BottomSheetContainer";

export interface Props {
  show: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ show = false, onClick, children }: Props) {
  return (
    <>
      <BottomSheetBackground show={show} onBackgroundClick={onClick} />
      <BottomSheetContainer show={show}>
        {children}
      </BottomSheetContainer>
    </>
  )
}