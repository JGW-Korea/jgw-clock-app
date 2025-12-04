// import { TimePicker } from "../../../../features/time-picker";
import BottomSheet from "../../../../shared/bottom-sheet";

interface Props {
  show: boolean;
  onClick: () => void;
}

export default function AlarmBottomSheet({ show, onClick }: Props) {
  return (
    <BottomSheet show={show} onClick={onClick}>
      <div>
        {/* <TimePicker /> */}
      </div>
    </BottomSheet>
  );
}
