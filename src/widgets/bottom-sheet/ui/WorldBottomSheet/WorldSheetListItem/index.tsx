import { ListItem } from "../../../../../shared/list-item";

interface Props {
  countryName: string;
  zoneName: string;
  onAppendTimeList: (name: string, to: string) => void;
}

export default function WorldSheetListItem({ countryName, zoneName, onAppendTimeList }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;
  
  return (
    <ListItem padding={0}>
      <button onClick={() => onAppendTimeList(name, zoneName)}>
        {name}
      </button>
    </ListItem>
  );
}
