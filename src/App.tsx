import { Route, Routes } from "react-router";
import { Clock, Stopwatch, Timer, World } from "./pages";
import { Layout } from "./app/index";
import "./App.scss"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Clock />}  />
        <Route path="/world" element={<World />}  />
        <Route path="/stopwatch" element={<Stopwatch />}  />
        <Route path="/timer" element={<Timer />}  />  
      </Route>
    </Routes>
  );
}
