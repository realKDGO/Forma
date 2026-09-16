import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Apple,
  Plus,
  Dumbbell,
  TrendingUp,
  Settings,
  WifiOff,
  Play,
} from "lucide-react";
import { useApp } from "../store/AppStore";
const nav = [
  ["/app/home", "Home", Home],
  ["/app/nutrition", "Nutrition", Apple],
  ["quick", "Quick Add", Plus],
  ["/app/workout", "Workout", Dumbbell],
  ["/app/progress", "Progress", TrendingUp],
];
export function Brand() {
  return (
    <div className="brand">
      <img
        className="brandmark"
        src="/icons/brand-logo.png"
        alt=""
        aria-hidden="true"
      />
      <span>Forma</span>
    </div>
  );
}
export default function Layout({ children, onQuick }) {
  const { state } = useApp();
  const go = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        {nav
          .filter((x) => x[0] !== "quick")
          .map(([p, l, I]) => (
            <NavLink key={p} to={p} className="nav-link">
              <I size={20} />
              {l}
            </NavLink>
          ))}
        <NavLink to="/app/settings" className="nav-link">
          <Settings size={20} />
          Settings
        </NavLink>
        {state.activeWorkout && (
          <button className="btn" onClick={() => go("/app/workout/active")}>
            <Play size={18} />
            Resume workout
          </button>
        )}
      </aside>
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <button
            className="btn icon secondary"
            aria-label="Settings"
            onClick={() => go("/app/settings")}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>
      {!navigator.onLine && (
        <div className="offline-status" role="status">
          <WifiOff size={15} style={{ verticalAlign: "middle" }} /> Offline.
          Changes stay on this device.
        </div>
      )}
      <main className="content">{children}</main>
      <nav className="nav-bottom" aria-label="Primary">
        {nav.map(([p, l, I]) =>
          p === "quick" ? (
            <button
              key={p}
              className="nav-link quick-nav"
              aria-label="Quick add"
              onClick={onQuick}
            >
              <I size={26} />
            </button>
          ) : (
            <NavLink key={p} to={p} className="nav-link">
              <I size={21} />
              <span>{l}</span>
            </NavLink>
          ),
        )}
      </nav>
    </div>
  );
}
