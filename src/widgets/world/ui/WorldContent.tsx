import WorldTimeListItem from "./components/WorldTimeListItem";
import style from "./style.module.scss";

type WordTimeListType = {
  name: string;
  from: string;
  to: string;
  offset: number;
}

interface Props {
  worldTimeList: WordTimeListType[]
}

export default function WorldContent({ worldTimeList }: Props) {
  return (
    <main className={`${style["layout"]} ${worldTimeList.length === 0 ? style["layout-empty"] : ""}`}>
      {
        worldTimeList.length === 0
          ? <span>No World Clocks</span>
          : (
              <ul style={{ width: "100%" }}>
                {worldTimeList.map((item) => (
                  <WorldTimeListItem
                    key={item.to}
                    item={item}
                  />
                ))}
              </ul>
            )
      }
    </main>
  );
}

{/* <li>
                    <article>
                      <div>
                        <p>오늘, <time>-7시간</time></p>
                        <h3>
                          가르보네
                        </h3>
                      </div>

                      <p>오후<time>4:17</time></p>
                    </article>
                  </li> */}