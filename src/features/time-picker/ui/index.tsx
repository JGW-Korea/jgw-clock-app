import { Picker, PickerWheel } from "../../../shared/picker";
import { HOURS_LIST, HOURS_WHEEL, MERIDIEM_ITEMS, MINUTES_LIST, MINUTES_WHEEL } from "../consts";

export default function TimePicker() {
  return (
    <Picker>
      <PickerWheel list={MERIDIEM_ITEMS} wheel={MERIDIEM_ITEMS} />
      <PickerWheel list={HOURS_LIST} wheel={HOURS_WHEEL} />
      <PickerWheel list={MINUTES_LIST} wheel={MINUTES_WHEEL} />
    </Picker>
  )
}