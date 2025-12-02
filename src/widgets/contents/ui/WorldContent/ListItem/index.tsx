import { useEffect, useState } from "react";
import style from "./index.module.scss";

type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}

interface Props {
  item: WordTimeListType;
  editMode: boolean;
  onDelete: (key: string) => void;
}

export default function ListItem({ item, editMode, onDelete }: Props) {
  const [day, setDay] = useState<string>("");
  const [target, setTarget] = useState<"PM" | "AM">();
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

    const [from, to] = [getLocalDateString(item.from), getLocalDateString(item.to)];
    setDay(compare(from, to));

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const target = new Date(utc + item.offset * 1000);
    
    const hours = target.getHours();
    const minutes = target.getMinutes();

    const isPM = hours >= 12;
    setTarget(isPM ? "PM" : "AM");

    setTime(`${hours % 12 || 12}:${String(minutes).padStart(2, "0")}`);

  }, []);

  return (
    <li className={style["list-item"]}>
      <article>
        <div className={style["list-item__city"]} style={{ transform: editMode ? "translateX(0)" : `translateX(-${3 * 4 + 20}px)` }}>
          <button onClick={() => onDelete(item.to)} />
          <div>
            <p>{day}, {Math.floor(item.offset / 3600)}hour</p>
            <h3>{item.name}</h3>
          </div>
        </div>

        {!editMode && (
          <p className={style["list-item__time"]}>
            {target}
            <time>{time}</time>
          </p>
        )}
      </article>
    </li>
  );
}
