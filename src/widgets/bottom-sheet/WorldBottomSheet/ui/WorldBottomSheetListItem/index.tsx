import { ListItem } from "@shared/ui";

interface Props {
  countryName: string;
  zoneName: string;
  onAppendTimeList: (from: string, to: string) => void;
}

export default function WorldBottomSheetListItem({ countryName, zoneName, onAppendTimeList }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;
  
  return (
    <ListItem padding={0}>
      <button onClick={() => onAppendTimeList(name, zoneName)}>
        {name}
      </button>
    </ListItem>
  );
}