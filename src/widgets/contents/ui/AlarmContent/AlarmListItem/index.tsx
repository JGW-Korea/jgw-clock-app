import { AlarmListItemContainer } from "../../../../../entities/list-item-container";
import { SwipeToDelete } from "../../../../../features/swipe-to-delete";
import type { AlarmData } from "../../../../../shared/context/types";

interface Props extends AlarmData {
  activeRef: React.RefObject<HTMLLIElement | null>;
  onDeleteAlarm: (id: number) => void;
}

/**
 * Alarm 내부에서만 사용될 ListItem 컴포넌트
*/
export default function AlarmListItem({ activeRef, onDeleteAlarm, ...alarm }: Props) {
  return (
    <SwipeToDelete activeRef={activeRef} id={alarm.id} onDeleteAlarm={onDeleteAlarm}>
      <AlarmListItemContainer {...alarm}  />
    </SwipeToDelete>
  );
}
