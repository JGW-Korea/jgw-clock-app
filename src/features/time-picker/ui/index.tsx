import HoursColumn from "./HoursColumn";
import MeridiemColumn from "./MeridiemColumn";
import MinutesColumn from "./MinutesColumn";

export default function TimePicker() {
  return (
    <div className="time-picker">
      <HoursColumn />
      <MinutesColumn />
      <MeridiemColumn />
    </div>
  );
}
