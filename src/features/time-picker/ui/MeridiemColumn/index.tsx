export default function MeridiemColumn() {
  const items = ["AM", "PM"];
  
  return (
    <div className="control control--meridiem">
      <ul className="controller controller--meridiem">
        {items.map((time, idx) => (
          <li key={idx}>{time}</li>
        ))}
      </ul>

      <div className="wheel wheel--meridiem">
        {items.map((time, idx) => (
          <div key={idx} style={{ "--index": idx } as React.CSSProperties}>
            {time}
          </div>
        ))}
      </div>

      <div className="track-holder">
        <div className="track track--meridiem">
          AM PM
        </div>
      </div>
    </div>
  );
}
