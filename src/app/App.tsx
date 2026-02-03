import { Audio } from "@widgets/audio";
import AppProvider from "./provider";
import AppRouter from "./routers";
import "./styles/global.scss";
import "@shared/db";

/**
 * 가상 DOM(Virtual DOM)의 최상위 가상 요소(Virtual Root Element) 컴포넌트
*/
export default function App() {
  return (
    <AppProvider>
      <Audio />
      <AppRouter />
    </AppProvider>
  );
}
