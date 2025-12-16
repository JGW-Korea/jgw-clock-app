import { AlarmListItemContainer } from "../../../../../entities/list-item-container";
import { SwipeToDelete } from "../../../../../features/swipe-to-delete";
import type { AlarmData } from "../../../../../shared/context/types";

interface Props extends AlarmData {
  activeRef: React.RefObject<HTMLLIElement | null>;
  editMode: { click: boolean; swipe: boolean };
  onDeleteListItem: (id: number) => void;
  onEditModeActive: (type?: "click" | "swipe") => void;
  onToggleActiveAlarm: (id: number) => void;
}

/**
 * Alarm 내부에서만 사용될 ListItem 컴포넌트
*/
export default function AlarmListItem({ activeRef, editMode, onDeleteListItem, onEditModeActive, onToggleActiveAlarm, ...alarm }: Props) {
  return (
    <SwipeToDelete activeRef={activeRef} id={alarm.id} editMode={editMode} onEditModeActive={onEditModeActive} onDeleteListItem={onDeleteListItem}>
      <AlarmListItemContainer
        editMode={editMode}
        onDeleteListItem={onDeleteListItem}
        onEditModeActive={onEditModeActive}
        onToggleActiveAlarm={onToggleActiveAlarm}
        {...alarm}
      />
    </SwipeToDelete>
  );
}
