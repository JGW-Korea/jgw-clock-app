import { AlarmListItemContainer } from "../../../../../entities/list-item-container";
import { SwipeToDelete } from "../../../../../features/swipe-to-delete";
import type { AlarmData } from "../../../../../shared/context/types";

interface Props extends AlarmData {
  activeRef: React.RefObject<HTMLLIElement | null>;
  editMode: boolean;
  onDeleteAlarm: (id: number) => void;
  onEditModeActive: () => void;
}

/**
 * Alarm 내부에서만 사용될 ListItem 컴포넌트
*/
export default function AlarmListItem({ activeRef, editMode, onDeleteAlarm, onEditModeActive, ...alarm }: Props) {
  return (
    <SwipeToDelete activeRef={activeRef} id={alarm.id} onDeleteAlarm={onDeleteAlarm}>
      <AlarmListItemContainer editMode={editMode} onDeleteAlarm={onDeleteAlarm} onEditModeActive={onEditModeActive} {...alarm}  />
    </SwipeToDelete>
  );
}
