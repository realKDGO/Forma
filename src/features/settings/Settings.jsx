import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Monitor, Database, Info, LogOut } from "lucide-react";
import { useApp } from "../../store/AppStore";
import { Modal } from "../../components/UI";
import { authService } from "../../services/authService";
export default function Settings() {
  const { state, update, reset, notify } = useApp();
  const go = useNavigate();
  const [logout, setLogout] = useState(false);
  const theme = state.settings.theme;
  const apply = (t) => {
    update({ ...state, settings: { ...state.settings, theme: t } });
    notify("Appearance updated");
  };
  useEffect(() => {
    const dark =
      theme === "dark" ||
      (theme === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [theme]);
  const signout = async () => {
    await authService.logout();
    update({ ...state, session: { authenticated: false, onboarded: false, userId: null } });
    go("/login");
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Preferences and local data</p>
          <h1>Settings</h1>
        </div>
      </div>
      <section className="card grid">
        <h2>Profile</h2>
        <p>{state.profile.name}</p>
        <p className="muted">
          Goal: {state.goal.goalType.toLowerCase()} · {state.goal.calories}{" "}
          kcal/day
        </p>
      </section>
      <section className="card grid">
        <h2>Appearance</h2>
        <div className="grid cols-3">
          {[
            ["light", "Light", Sun],
            ["dark", "Dark", Moon],
            ["system", "System", Monitor],
          ].map(([v, l, I]) => (
            <button
              key={v}
              className={`option ${theme === v ? "selected" : ""}`}
              onClick={() => apply(v)}
            >
              <I size={20} />
              <br />
              <strong>{l}</strong>
            </button>
          ))}
        </div>
      </section>
      <section className="card grid">
        <h2>Units</h2>
        <select
          className="select"
          value={state.settings.units}
          onChange={(e) =>
            update({
              ...state,
              settings: { ...state.settings, units: e.target.value },
            })
          }
        >
          <option value="metric">Metric (kg, cm)</option>
          <option value="imperial">Imperial (lb, ft/in)</option>
        </select>
      </section>
      <section className="card grid">
        <div className="page-head">
          <h2>Offline data</h2>
          <Database />
        </div>
        <p className="muted">
          Profile, diary entries, foods, weight, routines, and workouts are
          stored on this device for the frontend release.
        </p>
        {import.meta.env.DEV && (
          <div className="grid cols-2">
            <button
              className="btn secondary"
              onClick={async () => {
                await reset("demo");
                notify("Demo data restored");
              }}
            >
              Seed demo data
            </button>
            <button
              className="btn secondary"
              onClick={async () => {
                await reset("empty");
                location.href = "/register";
              }}
            >
              Test empty account
            </button>
          </div>
        )}
      </section>
      <section className="card grid">
        <div className="page-head">
          <h2>About Forma</h2>
          <Info />
        </div>
        <p>Forma 0.1.0</p>
        <p className="muted">Nutrition. Training. Progress.</p>
        <h3>Open-source licenses</h3>
        <p className="muted">
          Workout Guide code is MIT licensed. Exercise visual assets are CC
          BY-SA 4.0 and include Everkinetic-derived artwork. Forma uses React,
          Vite, Lucide, Recharts, Tailwind CSS, and idb under their respective
          licenses.
        </p>
        <a
          href="https://github.com/bryllim/workout-guide"
          target="_blank"
          rel="noreferrer"
        >
          Workout Guide attribution and licenses
        </a>
      </section>
      <button className="btn danger" onClick={() => setLogout(true)}>
        <LogOut />
        Log out
      </button>
      {logout && (
        <Modal
          title="Log out of Forma?"
          onClose={() => setLogout(false)}
          actions={
            <>
              <button
                className="btn secondary"
                onClick={() => setLogout(false)}
              >
                Cancel
              </button>
              <button className="btn danger" onClick={signout}>
                Log out
              </button>
            </>
          }
        >
          <p>Your locally saved data will remain on this device.</p>
        </Modal>
      )}
    </div>
  );
}
