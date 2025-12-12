import { useContext } from "react";
import { ClockContext } from "../../../../shared/context";
import styles from "./index.module.scss"
import { AlarmListItemContainer } from "../../../../entities/list-item-container";

export default function AlarmContent() {
  const { alarmList } = useContext(ClockContext)!;

  return (
    <main className={`${styles["layout"]} ${alarmList.length === 0 ? styles["layout-empty"] : ""}`}>
      {
        alarmList.length === 0
          ? <span>No Alarm List</span>
          : (
            <ul className={styles["layout-list"]}>
              {alarmList.map((alarm) => (
                <AlarmListItemContainer
                  key={alarm.id}
                  {...alarm}
                />
              ))}
            </ul>
          )
      }
    </main>
  );
}
