import Picker from "./Picker";
import PickerWheel from "./PickerWheel";
import useTimePickerAnimation from "../model/useTimePickerAnimation";
import { HOURS_LIST, HOURS_WHEEL, HOURS_TRACK, MERIDIEM_ITEMS, MINUTES_LIST, MINUTES_TRACK, MINUTES_WHEEL } from "../consts";

interface Props {
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  updateTimePicker: (isPM: boolean, hours: number, minutes: number) => void;
}

/**
 * Picker를 재사용하여 Meridiem / Hours / Minutes 선택 가능한 TimePicker 컴포넌트
*/
export default function TimePicker({ onPointerOver, onPointerLeave, updateTimePicker }: Props) {
  const { meridiemRef, hoursRef, minutesRef } = useTimePickerAnimation(updateTimePicker);

  return (
    <Picker onPointerOver={onPointerOver} onPointerLeave={onPointerLeave}>
      <PickerWheel ref={meridiemRef} list={MERIDIEM_ITEMS} wheel={MERIDIEM_ITEMS} track={MERIDIEM_ITEMS} className="meridiem" />
      <PickerWheel ref={hoursRef} list={HOURS_LIST} wheel={HOURS_WHEEL} track={HOURS_TRACK} className="hours" />
      <PickerWheel ref={minutesRef} list={MINUTES_LIST} wheel={MINUTES_WHEEL} track={MINUTES_TRACK} className="minutes" />
    </Picker>
  )
}