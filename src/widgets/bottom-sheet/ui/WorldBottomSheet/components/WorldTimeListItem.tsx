import style from "../styles/worldTimeListItem.module.scss";

interface Props {
  countryName: string;
  zoneName: string;
}

export default function WorldTimeListItem({ countryName, zoneName }: Props) {
  return (
    <li className={style["list-item"]}>
      <button>
        {zoneName.split("/").at(-1)?.replaceAll("_", " ")}, {countryName}
      </button>
    </li>
  );
}
