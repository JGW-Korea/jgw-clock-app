import ListItem from "./ListItem";
import style from "./index.module.scss";

type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}

interface Props {
  worldTimeList: WordTimeListType[];
  editMode: boolean;
  onDelete: (key: string) => void;
}

export default function WorldContent({ worldTimeList, editMode, onDelete }: Props) {
  return (
    <main className={`${style["layout"]} ${worldTimeList.length === 0 ? style["layout-empty"] : ""}`}>
      {
        worldTimeList.length === 0
          ? <span>No World Clocks</span>
          : (
              <ul style={{ width: "100%" }}>
                {worldTimeList.map((item) => (
                  <ListItem
                    key={item.to}
                    item={item}
                    editMode={editMode}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            )
      }
    </main>
  );
}