import { AlarmListItemContainer } from "../../../../../entities/list-item-container";
import { SwipeToDelete } from "../../../../../features/swipe-to-delete";
import type { AlarmData } from "../../../../../shared/context/types";

/**
 * Alarm 내부에서만 사용될 ListItem 컴포넌트
*/
export default function AlarmListItem({ ...alarm }: AlarmData) {
  return (
    <SwipeToDelete>
      <AlarmListItemContainer {...alarm}  />
    </SwipeToDelete>
  );
}
