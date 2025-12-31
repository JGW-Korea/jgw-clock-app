import { ListItem } from "@shared/ui";
import type { WorldAppendHandler } from "../../model";

interface Props {
  countryName: string;
  zoneName: string;
  onClickAppendWorld: WorldAppendHandler;
}

export default function WorldBottomSheetListItem({ countryName, zoneName, onClickAppendWorld }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;
  
  return (
    <ListItem padding={0}>
      <button onClick={() => onClickAppendWorld(name, zoneName)}>
        {name}
      </button>
    </ListItem>
  );
}