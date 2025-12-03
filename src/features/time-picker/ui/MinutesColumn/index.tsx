import { AMOUNT } from "../../consts";
import styles from "../index.module.scss";

export default function MinutesColumn() {
  return (
    <div className={`${styles["control"]} ${styles["control--minutes"]}`}>
      <ul className={`${styles["controller"]} ${styles["controller--minutes"]}`}>
        {Array.from({ length: AMOUNT + 1 }).map((_, idx) => (
          <li key={idx}>{idx === AMOUNT ? 0 : idx}</li>
        ))}
      </ul>

      <div className={`${styles["wheel"]} ${styles["wheel--minutes"]}`}>
        {Array.from({ length: AMOUNT }).map((_, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {idx === AMOUNT ? "00" : idx.toString().padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className={`${styles["track-holder"]}`}>
        <div className={`${styles["track"]} ${styles["track--minutes"]}`}>
          {
            Array.from({ length: AMOUNT + 1 })
              .map((_, idx) => idx === AMOUNT ? "00" : idx.toString().padStart(2, "0"))
              .join(" ")
          }
        </div>
      </div>
    </div>
  );
}
