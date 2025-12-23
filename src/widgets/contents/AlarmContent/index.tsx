import { useContext, useRef } from "react";
import styles from "./index.module.scss"
import AlarmListItem from "./AlarmListItem";
import { AlarmContext } from "@entities/alarm";

interface Props {
  editMode: { click: boolean; swipe: boolean };
  onEditModeActive: (type?: "click" | "swipe") => void;
}

export default function AlarmContent({ editMode, onEditModeActive }: Props) {
  const { alarmList, handleDeleteAlarm, handleToggleActiveAlarm } = useContext(AlarmContext)!;
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
                  editMode={editMode}
                  activeRef={activeRef}
                  onDeleteListItem={handleDeleteAlarm}
                  onEditModeActive={onEditModeActive}
                  onToggleActiveAlarm={handleToggleActiveAlarm}
                  {...alarm}
                />
              ))}
            </ul>
          )
      }
    </main>
  );
}
