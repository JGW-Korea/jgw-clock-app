import styles from "../index.module.scss";

export default function MeridiemColumn() {
  const items = ["AM", "PM"];
  
  return (
    <div className={`${styles["control"]} ${styles["control--meridiem"]}`}>
      <ul className={`${styles["controller"]} ${styles["controller--meridiem"]}`}>
        {items.map((time, idx) => (
          <li key={idx}>{time}</li>
        ))}
      </ul>

      <div className={`${styles["wheel"]} ${styles["wheel--meridiem"]}`}>
        {items.map((time, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {time}
          </div>
        ))}
      </div>

      <div className={`${styles["track-holder"]}`}>
        <div className={`${styles["track"]} ${styles["track--meridiem"]}`}>
          AM PM
        </div>
      </div>
    </div>
  );
}
