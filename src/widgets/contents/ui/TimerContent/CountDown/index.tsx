interface Props {
  styles: CSSModuleClasses;
}

export default function CountDown({ styles }: Props) {
  return (
    <div className={`${styles["time-wrapper"]}`}>
      <div className={`${styles["time-count-down"]}`}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const isActive = i < 60 * 0;
            return (
              <line
                key={i}
                x1="50"
                y1="2"    // 원의 가장 바깥쪽 (위치)
                x2="50"
                y2="6"    // 2에서 6까지, 길이를 겨우 '4'로 짧게 제한 (길이 축소)
                strokeWidth="1.5" // 두께를 얇게 (뭉툭함 해결)
                strokeLinecap="square" 
                stroke={isActive ? "#FF9500" : "#333"}
                transform={`rotate(${i * 6}, 50 50)`}
              />
            );
          })}
        </svg>
      </div>
      
      <time dateTime="" >
        <span>00</span>
        :
        <span>00</span>
        :
        <span>00</span>
      </time>
    </div>
  );
}
