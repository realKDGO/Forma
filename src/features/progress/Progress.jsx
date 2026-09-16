import { useMemo, useState } from "react";
import { useApp } from "../../store/AppStore";
import { totalsForDate, calculateEstimated1RM } from "../../utils/calculations";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Empty } from "../../components/UI";
const ranges = { 7: 7, 30: 30, 90: 90, 180: 180, 365: 365, All: 99999 };
export function ProgressHome() {
  const { state } = useApp();
  const current = state.weights.at(-1)?.weightKg,
    start = state.weights[0]?.weightKg;
  const logged = new Set(state.foodLogs.map((x) => x.date)).size;
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Your recorded data</p>
          <h1>Progress</h1>
        </div>
      </div>
      <div className="grid cols-2">
        <section className="card">
          <h2>Weight</h2>
          <div className="metric">
            <strong>{current ?? "—"} kg</strong>
            <span>
              {current && start
                ? `${(current - start).toFixed(1)} kg change`
                : "No trend"}
            </span>
          </div>
        </section>
        <section className="card">
          <h2>Nutrition</h2>
          <div className="metric">
            <strong>{logged}</strong>
            <span>days logged</span>
          </div>
        </section>
        <section className="card">
          <h2>Workout consistency</h2>
          <div className="metric">
            <strong>{state.workouts.length}</strong>
            <span>completed</span>
          </div>
        </section>
        <section className="card">
          <h2>Strength</h2>
          <div className="metric">
            <strong>{state.workouts.flatMap((w) => w.exercises).length}</strong>
            <span>exercise records</span>
          </div>
        </section>
      </div>
      <WeightProgress />
      <NutritionProgress />
      <StrengthProgress />
    </div>
  );
}
export function WeightProgress() {
  const { state, update, notify } = useApp();
  const [range, setRange] = useState(30);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const data = state.weights.filter(
    (w) => (Date.now() - new Date(w.date)) / 86400000 <= ranges[range],
  );
  const add = (e) => {
    e.preventDefault();
    if (!weight) return;
    const date = new Date().toISOString().slice(0, 10);
    update({
      ...state,
      weights: [
        ...state.weights,
        {
          id: crypto.randomUUID(),
          weightKg: +weight,
          date,
          note,
          createdAt: new Date().toISOString(),
          syncStatus: "PENDING",
        },
      ],
      profile: { ...state.profile, currentWeightKg: +weight },
    });
    setWeight("");
    setNote("");
    notify("Weight saved");
  };
  return (
    <section className="card grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Body weight</p>
          <h2>Weight trend</h2>
        </div>
        <strong>{state.weights.at(-1)?.weightKg ?? "—"} kg</strong>
      </div>
      <div className="chip-row">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            className={`chip ${String(range) === r ? "active" : ""}`}
            onClick={() => setRange(isNaN(r) ? r : +r)}
          >
            {r === "90"
              ? "3M"
              : r === "180"
                ? "6M"
                : r === "365"
                  ? "1Y"
                  : r === "30"
                    ? "30D"
                    : r === "7"
                      ? "7D"
                      : r}
          </button>
        ))}
      </div>
      {data.length ? (
        <div style={{ height: 220 }} aria-label="Weight chart">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} width={35} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weightKg"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty title="No weight entries" text="Log weight to see a trend." />
      )}
      <form className="grid cols-3" onSubmit={add}>
        <label className="field">
          New weight (kg)
          <input
            className="input"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <label className="field">
          Note (optional)
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button className="btn" style={{ alignSelf: "end" }}>
          Save weight
        </button>
      </form>
    </section>
  );
}
export function NutritionProgress() {
  const { state } = useApp();
  const days = [...new Set(state.foodLogs.map((x) => x.date))]
    .sort()
    .slice(-14);
  const data = days.map((date) => ({
    date,
    calories: Math.round(totalsForDate(state, date).calories),
    target: state.goal.calories,
  }));
  const avg = data.length
    ? Math.round(data.reduce((a, x) => a + x.calories, 0) / data.length)
    : 0;
  return (
    <section className="card grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Logged days</p>
          <h2>Nutrition</h2>
        </div>
        <strong>{avg} kcal average</strong>
      </div>
      {data.length ? (
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis width={40} />
              <Tooltip />
              <Bar
                dataKey="calories"
                fill="var(--primary)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty
          title="No nutrition history"
          text="Log meals to see adherence."
        />
      )}
    </section>
  );
}
export function StrengthProgress() {
  const { state } = useApp();
  const names = [
    ...new Set(state.workouts.flatMap((w) => w.exercises.map((e) => e.name))),
  ];
  const [selected, setSelected] = useState(names[0] || "");
  const data = useMemo(
    () =>
      state.workouts
        .map((w) => {
          const e = w.exercises.find((x) => x.name === selected),
            best = e
              ? Math.max(
                  0,
                  ...e.sets
                    .filter((s) => s.completed)
                    .map((s) => calculateEstimated1RM(+s.weight, +s.reps)),
                )
              : 0;
          return {
            date: w.finishedAt?.slice(0, 10),
            estimated1RM: Math.round(best),
          };
        })
        .filter((x) => x.estimated1RM)
        .reverse(),
    [state.workouts, selected],
  );
  return (
    <section className="card grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Estimated 1RM</p>
          <h2>Strength</h2>
        </div>
        {names.length > 0 && (
          <select
            className="select"
            style={{ maxWidth: 210 }}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {names.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        )}
      </div>
      {data.length ? (
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="estimated1RM"
                stroke="var(--accent)"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty
          title="No strength history"
          text="Complete weighted sets to see estimated strength trends."
        />
      )}
    </section>
  );
}
