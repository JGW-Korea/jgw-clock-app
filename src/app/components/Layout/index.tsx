import { Outlet } from "react-router";
import "./index.style.scss"

export default function Layout() {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
}
