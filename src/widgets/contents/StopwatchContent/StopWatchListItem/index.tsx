
import { ListItem } from "@shared/ui";
import { StopWatchListItemContainer, type StopWatchListItemContainerType } from "../../../../entities/list-item-container/ui";

/**
 * Stopwatch 내부에서만 사용될 ListItem 컴포넌트
*/
export default function StopWatchListItem(props: StopWatchListItemContainerType) {
  return (
    <ListItem padding={3}>
      <StopWatchListItemContainer {...props} />
    </ListItem>
  );
}
