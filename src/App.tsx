import { Route, Routes } from "react-router";
import { World, Alarm, Stopwatch, Timer } from "./pages";
import { Layout } from "./app/layout";
import "./App.scss"
import { ClockProvider } from "./app/provider";


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
