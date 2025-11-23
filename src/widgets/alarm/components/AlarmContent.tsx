import style from "./style.module.scss";

interface Props {
  alarmList: object[]
}

export default function AlarmContent({ alarmList }: Props) {
  return (
    <main className={`${style["layout"]} ${alarmList.length === 0 ? style["layout-empty"] : ""}`}>
      {
        alarmList.length === 0
          ? <span>No Alarm</span>
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
