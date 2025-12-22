import { Layout } from "@app/layout";
import { Alarm, Stopwatch, Timer, World } from "@pages";
import { Route, Routes } from "react-router";

/**
 * History API를 이용한 클라이언트 사이드 라우팅 하위의 URL과 1:1 매칭을 해주는 라우트 그룹 컴포넌트
*/
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<World />}  />
        <Route path="/alarm" element={<Alarm />}  />
        <Route path="/stopwatch" element={<Stopwatch />}  />
        <Route path="/timer" element={<Timer />}  />  
      </Route>
    </Routes>
  );
}
