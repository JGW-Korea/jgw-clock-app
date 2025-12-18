import { useEffect, useState } from "react";
import { SwipeToDelete } from "../../../../../features/swipe-to-delete";
import styles from "./index.module.scss";
import type { WordTimeListType } from "../../../../../entities/world";

interface Props {
  activeRef: React.RefObject<HTMLLIElement | null>;
  world: WordTimeListType;
  editMode: { click: boolean; swipe: boolean };
  onDeleteListItem: (id: number | string, type?: "swipe", cb?: () => void) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
}

export default function WorldListItem({ activeRef, world, editMode, onDeleteListItem, onEditModeActive }: Props) {
  const [day, setDay] = useState<string>("");
  const [target, setTarget] = useState<"PM" | "AM">("PM");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const getLocalDateString = (timeZone: string) => {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    }
    
    const compare = (from: string, to: string) => {
      if(from === to) return "Today";

      const a = from.split("-").map(Number).reduce((a, b) => a + b);
      const b = to.split("-").map(Number).reduce((a, b) => a + b);
      if(a < b) return "Tomorrow";
      else {
        return "Yesterday";
      }
    }

    const [from, to] = [getLocalDateString(world.from), getLocalDateString(world.to)];
    setDay(compare(from, to));

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const target = new Date(utc + world.offset * 1000);
    
    const hours = target.getHours();
    const minutes = target.getMinutes();

    const isPM = hours >= 12;
    setTarget(isPM ? "PM" : "AM");

    setTime(`${hours % 12 || 12}:${String(minutes).padStart(2, "0")}`);
  }, []);

  return (
    <SwipeToDelete activeRef={activeRef} id={world.to} editMode={editMode} padding={4} onEditModeActive={onEditModeActive} onDeleteListItem={onDeleteListItem}>
      <article className={`${styles["world-list-item"]} ${editMode.click ? styles["edit-mode"] : ""}`}>
        <button className={`${styles["world-list-item__delete-btn"]}`} onClick={() => onDeleteListItem(world.to, undefined, onEditModeActive)} />
        
        <div className={`${styles["world-list-item__content"]}`}>
          <div className={`${styles["world-list-item__content-city"]}`}>
            <p>{day}, {Math.floor(world.offset / 3600)}hour</p>
            <h3>{world.name}</h3>
          </div>

          <time dateTime={`${time.split(":")[0].padStart(2, "0")}:${time.split(":")[1]}`} className={`${styles["world-list-item__content-time"]} ${editMode.click ? styles["hidden"] : ""}`}>
            <span>{`${time.split(":")[0]}:${time.split(":")[1]}`}</span>
            {target}
          </time>
        </div>
      </article>
    </SwipeToDelete>
  );
}