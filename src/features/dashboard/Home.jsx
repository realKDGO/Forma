import { useNavigate } from "react-router-dom";
import { Plus, Scale, Dumbbell, ArrowUpRight } from "lucide-react";
import { useApp } from "../../store/AppStore";
import { totalsForDate } from "../../utils/calculations";
import { ProgressBar } from "../../components/UI";
export default function Home() {
  const { state } = useApp();
  const go = useNavigate();
  const today = new Date().toISOString().slice(0, 10),
    t = totalsForDate(state, today),
    g = state.goal,
    remaining = Math.round(g.calories - t.calories),
    w = state.weights.at(-1)?.weightKg;
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </p>
          <h1>Hi, {state.profile?.name?.split(" ")[0] || "there"}</h1>
        </div>
      </div>
      <section className="card grid">
        <div className="metric">
          <div>
            <span className="muted">Calories consumed</span>
            <div>
              <strong>{Math.round(t.calories)}</strong> / {g.calories} kcal
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="muted">Remaining</span>
            <div>
              <strong>{Math.abs(remaining)}</strong>{" "}
              {remaining < 0 ? "over" : "left"}
            </div>
          </div>
        </div>
        <div className="progress">
          <span
            style={{
              width: `${Math.min(100, (t.calories / g.calories) * 100)}%`,
            }}
          />
        </div>
        <small className="muted">
          {remaining > 0
            ? "Below today’s target"
            : remaining === 0
              ? "At today’s target"
              : "Above today’s target"}
        </small>
      </section>
      <div className="grid cols-2">
        <section className="card grid">
          <h2>Macros</h2>
          <ProgressBar label="Protein" value={t.protein} target={g.protein} />
          <ProgressBar
            label="Carbs"
            value={t.carbohydrates}
            target={g.carbohydrates}
          />
          <ProgressBar label="Fat" value={t.fat} target={g.fat} />
          <ProgressBar label="Fiber" value={t.fiber} target={g.fiber} />
        </section>
        <section className="card grid">
          <div className="page-head">
            <h2>Weight</h2>
            <Scale size={20} />
          </div>
          <div className="metric">
            <strong>{w ?? "—"} kg</strong>
            <span className="muted">Target {g.targetWeightKg} kg</span>
          </div>
          <button
            className="btn secondary"
            onClick={() => go("/app/progress/weight")}
          >
            View trend <ArrowUpRight size={18} />
          </button>
        </section>
      </div>
      <section className="card grid">
        <div className="page-head">
          <div>
            <p className="eyebrow">Today’s training</p>
            <h2>{state.routines[0]?.name || "No workout planned"}</h2>
          </div>
          <Dumbbell />
        </div>
        <p className="muted">
          {state.routines[0]?.description ||
            "Create a routine or start an empty workout."}
        </p>
        <button className="btn" onClick={() => go("/app/workout")}>
          Open workout
        </button>
      </section>
      <section className="card">
        <h2>Quick actions</h2>
        <div className="grid cols-3" style={{ marginTop: 12 }}>
          <button
            className="btn secondary"
            onClick={() => go("/app/nutrition/search")}
          >
            <Plus />
            Food
          </button>
          <button
            className="btn secondary"
            onClick={() => go("/app/progress/weight")}
          >
            <Scale />
            Weight
          </button>
          <button className="btn secondary" onClick={() => go("/app/workout")}>
            <Dumbbell />
            Workout
          </button>
        </div>
      </section>
    </div>
  );
}
