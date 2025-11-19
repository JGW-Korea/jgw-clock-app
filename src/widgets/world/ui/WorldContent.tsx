import style from "./style.module.scss";

interface Props {
  list: object[]
}

export default function WorldContent({ list }: Props) {
  console.log(list.length)
  
  return (
    <main className={`${style["layout"]} ${list.length === 0 ? style["layout-empty"] : ""}`}>
      {
        list.length === 0
          ? <span>세계 시계 없음</span>
          : null
      }
    </main>
  );
}
