import { Picker, PickerWheel } from "../../../shared/picker";
import { HOURS_LIST, HOURS_WHEEL, HOURS_TRACK, MERIDIEM_ITEMS, MINUTES_LIST, MINUTES_TRACK, MINUTES_WHEEL } from "../consts";

export default function TimePicker() {
  return (
    <Picker>
      <PickerWheel list={MERIDIEM_ITEMS} wheel={MERIDIEM_ITEMS} track={MERIDIEM_ITEMS} className="meridiem" />
      <PickerWheel list={HOURS_LIST} wheel={HOURS_WHEEL} track={HOURS_TRACK} className="hours" />
      <PickerWheel list={MINUTES_LIST} wheel={MINUTES_WHEEL} track={MINUTES_TRACK} className="minutes" />
    </Picker>
  )
}