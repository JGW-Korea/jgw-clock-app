import style from "./style.module.scss";

interface Props {
  worldTimeList: object[]
}

export default function WorldContent({ worldTimeList }: Props) {
  return (
    <main className={`${style["layout"]} ${worldTimeList.length === 0 ? style["layout-empty"] : ""}`}>
      {
        worldTimeList.length === 0
          ? <span>세계 시계 없음</span>
          : (
              <ul>
                <li>
                    <article>
                      <div>
                        <p>오늘, <time>-7시간</time></p>
                        <h3>
                          가르보네
                        </h3>
                      </div>

                      <p>오후<time>4:17</time></p>
                    </article>
                  </li>
              </ul>
            )
      }
    </main>
  );
}
