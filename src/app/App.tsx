import { Route, Routes } from "react-router";
import { World, Alarm, Stopwatch, Timer } from "@pages";
import { Layout } from "./layout";
import { ClockProvider } from "./provider";
import "./styles/global.style.scss";

export default function App() {
  return (
    <ClockProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<World />}  />
          <Route path="/world" element={<Alarm />}  />
          <Route path="/stopwatch" element={<Stopwatch />}  />
          <Route path="/timer" element={<Timer />}  />  
        </Route>
      </Routes>
    </ClockProvider>
  );
}
