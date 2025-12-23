import { ListItem } from "@shared/ui";
import { WorldSheetListItemContainer } from "../../../../../entities/list-item-container/ui";

interface Props {
  countryName: string;
  zoneName: string;
  onAppendTimeList: (name: string, to: string) => void;
}

export default function WorldSheetListItem({ countryName, zoneName, onAppendTimeList }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;
  
  return (
    <ListItem padding={0}>
      <WorldSheetListItemContainer
        label={name}
        zoneName={zoneName}
        onAppendTimeList={onAppendTimeList}
      />
    </ListItem>
  );
}
