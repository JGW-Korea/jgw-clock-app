import { useContext, useRef } from "react";
import { ClockContext } from "../../../../shared/context";
import styles from "./index.module.scss"
import AlarmListItem from "./AlarmListItem";

export default function AlarmContent() {
  const { alarmList, handleDeleteAlarm } = useContext(ClockContext)!;
  const activeRef = useRef<HTMLLIElement | null>(null);

  return (
    <main className={`${styles["layout"]} ${alarmList.length === 0 ? styles["layout-empty"] : ""}`}>
      {
        alarmList.length === 0
          ? <span>No Alarm List</span>
          : (
            <ul className={styles["layout-list"]}>
              {alarmList.map((alarm) => (
                <AlarmListItem
                  key={alarm.id}
                  activeRef={activeRef}
                  onDeleteAlarm={handleDeleteAlarm}
                  {...alarm}
                />
              ))}
            </ul>
          )
      }
    </main>
  );
}
