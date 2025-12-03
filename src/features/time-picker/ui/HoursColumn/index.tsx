import { AMOUNT } from "../../consts";
import styles from "../index.module.scss";

export default function HoursColumn() {
  return (
    <div className={`${styles["control"]} ${styles["control--hours"]}`}>
      <ul className={`${styles["controller"]} ${styles["controller--hours"]}`}>
        {Array.from({ length: AMOUNT + 1 }).map((_, idx) => (
          <li key={idx}>{idx % 12 || 12}</li>
        ))}
      </ul>

      <div className={`${styles["wheel"]} ${styles["wheel--hours"]}`}>
        {Array.from({ length: AMOUNT }).map((_, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {String(idx % 12 || 12).padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className={`${styles["track-holder"]}`}>
        <div className={`${styles["track"]} ${styles["track--hours"]}`}>
          {
            Array.from({ length: AMOUNT + 1 })
              .map((_, idx) => String(idx % 12 || 12).padStart(2, "0"))
              .join(" ")
          }
        </div>
      </div>
    </div>
  );
}
