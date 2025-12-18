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

    const updateTime = () => {
      const now = new Date();
      // 1. 해당 지역 시간 계산 (기존 로직)
      const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const targetDate = new Date(utc + world.offset * 1000);
      
      // 2. AM/PM 및 시간 업데이트
      const hours = targetDate.getHours();
      const minutes = targetDate.getMinutes();
      setTarget(hours >= 12 ? "PM" : "AM");
      setTime(`${hours % 12 || 12}:${String(minutes).padStart(2, "0")}`);

      // 3. 날짜 비교 업데이트 (기존 compare 로직 재사용)
      const fromDateStr = getLocalDateString(world.from);
      const toDateStr = getLocalDateString(world.to);
      setDay(compare(fromDateStr, toDateStr));
    };

    updateTime(); // 초기 실행

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;
    
    const timeoutId = setTimeout(() => {
      updateTime();
      const intervalId = setInterval(updateTime, 1000 * 60);
      (window as any)._worldTimeInterval = intervalId;
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if((window as any)._worldTimeInterval) {
        clearInterval((window as any)._worldTimeInterval);
      }
    }
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