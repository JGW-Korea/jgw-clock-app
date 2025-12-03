import { AMOUNT } from "../../consts";

export default function MinutesColumn() {
  return (
    <div className="control control--minutes">
      <ul className="controller controller--minutes">
        {Array.from({ length: AMOUNT + 1 }).map((_, idx) => (
          <li key={idx}>{idx === AMOUNT ? 0 : idx}</li>
        ))}
      </ul>

      <div className="wheel wheel--minutes">
        {Array.from({ length: AMOUNT }).map((_, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {idx === AMOUNT ? "00" : idx.toString().padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className="track-holder">
        <div className="track track--minutes">
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
