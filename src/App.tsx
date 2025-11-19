import { Route, Routes } from "react-router";
import { World, Alarm, Stopwatch, Timer } from "./pages";
import { Layout } from "./app/index";
import "./App.scss"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<World />}  />
        <Route path="/world" element={<Alarm />}  />
        <Route path="/stopwatch" element={<Stopwatch />}  />
        <Route path="/timer" element={<Timer />}  />  
      </Route>
    </Routes>
  );
}
