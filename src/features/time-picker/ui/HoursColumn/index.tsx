import { AMOUNT } from "../../consts";

export default function HoursColumn() {
  return (
    <div className="control control--hours">
      <ul className="controller controller--hours">
        {Array.from({ length: AMOUNT + 1 }).map((_, idx) => (
          <li key={idx}>{idx % 12 || 12}</li>
        ))}
      </ul>

      <div className="wheel wheel--hours">
        {Array.from({ length: AMOUNT }).map((_, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {String(idx % 12 || 12).padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className="track-holder">
        <div className="track track--hours">
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
