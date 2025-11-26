import style from "../styles/worldTimeListItem.module.scss";

interface Props {
  countryName: string;
  zoneName: string;
  onAppendTimeList: (name: string, to: string) => void;
}

export default function WorldTimeListItem({ countryName, zoneName, onAppendTimeList }: Props) {
  const name = zoneName.split("/").at(-1)?.replaceAll("_", " ") + ", " + countryName;
  
  return (
    <li className={style["list-item"]}>
      <button onClick={() => onAppendTimeList(name, zoneName)}>
        {name}
      </button>
    </li>
  );
}
