interface Props {
  styles: CSSModuleClasses;
  hours: string;
  minutes: string;
  seconds: string;
  progress: number;
}

export default function TimerDisplay({ styles, hours, minutes, seconds, progress }: Props) {
  const activeTicks = Math.ceil(60 * progress);
  
  return (
    <div className={`${styles["time-wrapper"]}`}>
      <div className={`${styles["time-count-down"]}`}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          {Array.from({ length: 60 }).map((_, i) => {
            return (
              <line
                key={i}
                x1="50" y1="2" x2="50" y2="6"
                strokeWidth="1.5" // 두께를 얇게 (뭉툭함 해결)
                strokeLinecap="square" 
                stroke={i < activeTicks ? "#FF9500" : "#333"}
                transform={`rotate(${i * 6}, 50 50)`}
              />
            );
          })}
        </svg>
      </div>
      
      <time dateTime={`${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`} >
        <span>{hours.padStart(2, "0")}</span>
        :
        <span>{minutes.padStart(2, "0")}</span>
        :
        <span>{seconds.padStart(2, "0")}</span>
      </time>
    </div>
  );
}
