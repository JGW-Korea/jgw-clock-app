import styles from "./index.module.scss";

interface Props {
  editMode: { click: boolean; swipe: boolean };
  id: string;
  day: string;
  offset: number;
  city: string;
  hour: number;
  minutes: number;
  meridiem: string;
  onDeleteListItem: (id: number | string, cb?: () => void) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
  // onToggleActiveAlarm: (id: number) => void;
}

export default function WorldListItemContainer({ editMode, id, day, offset, city, hour, minutes, meridiem, onDeleteListItem, onEditModeActive }: Props) {
  return (
    <article className={`${styles["world-list-item"]} ${editMode.click ? styles["edit-mode"] : ""}`}>
      <button className={`${styles["world-list-item__delete-btn"]}`} onClick={() => onDeleteListItem(id, onEditModeActive)} />
      
      <div className={`${styles["world-list-item__content"]}`}>
        <div className={`${styles["world-list-item__content-city"]}`}>
          <p>{day}, {offset}hour</p>
          <h3>{city}</h3>
        </div>

        <time dateTime={`${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`} className={`${styles["world-list-item__content-time"]} ${editMode.click ? styles["hidden"] : ""}`}>
          <span>{`${hour}:${String(minutes).padStart(2, "0")}`}</span>
          {meridiem}
        </time>
      </div>
    </article>
  );
}
