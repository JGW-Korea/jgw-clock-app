import style from "../styles/worldTimeListItem.module.scss"

type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}

interface Props {
  item: WordTimeListType
}

export default function WorldTimeListItem({ item }: Props) {
  return (
    <li className={style["list-item"]}>
      <article>
        <div>
          <p>Today, {item.offset}</p>
          <h3>{item.name}</h3>
        </div>
        <p>
          PM
          <time>{item.offset}</time>
        </p>
      </article>
    </li>
  );
}
