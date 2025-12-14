interface Props {
  className: string;
  children: React.ReactElement;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
}

/**
 * SwiperToDelete 내부의 실제 메인 컨테이너를 담당하는 컴포넌트
*/
export default function SwipeToDeleteContainer({ className, children, ...events }: Props) {
  return (
    <div className={className} {...events}>
      {children}
    </div>
  );
}
