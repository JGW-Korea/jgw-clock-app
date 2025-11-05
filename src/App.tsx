import { Route, Routes } from "react-router";
import { Clock, Stopwatch, Timer, World } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route index path="/" element={<Clock />}  />
      <Route index path="/world" element={<World />}  />
      <Route index path="/stopwatch" element={<Stopwatch />}  />
      <Route index path="/timer" element={<Timer />}  />
    </Routes>
  );
}
