import { ClockProvider } from "./provider";
import { AppRouter } from "./routers";
import "./styles/global.style.scss";

/**
 * 가상 DOM(Virtual DOM)의 최상위 가상 요소(Virtual Root Element) 컴포넌트
 * 
*/
export default function App() {
  return (
    <ClockProvider>
      <AppRouter />
    </ClockProvider>
  );
}
