import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Play,
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  Check,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../../store/AppStore";
import { exerciseService } from "../../services/exerciseService";
import {
  calculateWorkoutVolume,
  calculateEstimated1RM,
  formatDuration,
} from "../../utils/calculations";
import { Empty, Modal } from "../../components/UI";
export function WorkoutHome() {
  const { state, update } = useApp();
  const go = useNavigate();
  const start = (r) => {
    const w = {
      id: crypto.randomUUID(),
      routineId: r?.id || null,
      name: r?.name || "Empty Workout",
      startedAt: new Date().toISOString(),
      status: "ACTIVE",
      exercises: (r?.exercises || []).map((e) => ({
        ...e,
        id: crypto.randomUUID(),
        sets: Array.from({ length: e.sets }, (_, i) => ({
          id: crypto.randomUUID(),
          setNumber: i + 1,
          weight: "",
          reps: e.reps,
          completed: false,
        })),
        notes: "",
      })),
    };
    update({ ...state, activeWorkout: { ...w, syncStatus: "PENDING" } });
    go("/app/workout/active");
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Training</p>
          <h1>Workout</h1>
        </div>
        <button
          className="btn secondary"
          onClick={() => go("/app/workout/exercises")}
        >
          <Search />
          Exercises
        </button>
      </div>
      {state.activeWorkout && (
        <section className="card">
          <h2>Workout in progress</h2>
          <p className="muted">
            {state.activeWorkout.name} started{" "}
            {new Date(state.activeWorkout.startedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <button className="btn" onClick={() => go("/app/workout/active")}>
            Resume workout
          </button>
        </section>
      )}
      <section className="card grid">
        <div className="page-head">
          <h2>Routines</h2>
          <button
            className="btn icon secondary"
            aria-label="Create routine"
            onClick={() => go("/app/workout/routines/new")}
          >
            <Plus />
          </button>
        </div>
        {state.routines.length ? (
          <div className="list">
            {state.routines.map((r) => (
              <div className="list-item" key={r.id}>
                <div className="list-item-main">
                  <h3>{r.name}</h3>
                  <p className="muted">
                    {r.exercises.length} exercises · {r.description}
                  </p>
                </div>
                <button
                  className="btn icon"
                  aria-label={`Start ${r.name}`}
                  onClick={() => start(r)}
                >
                  <Play />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title="No routines yet"
            text="Build a repeatable workout plan."
            action={
              <button
                className="btn"
                onClick={() => go("/app/workout/routines/new")}
              >
                Create routine
              </button>
            }
          />
        )}
        <button className="btn secondary" onClick={() => start(null)}>
          Start empty workout
        </button>
      </section>
      <section className="card">
        <div className="page-head">
          <h2>Recent workouts</h2>
          <button
            className="btn secondary"
            onClick={() => go("/app/workout/history")}
          >
            History
          </button>
        </div>
        {state.workouts.length ? (
          state.workouts.slice(0, 3).map((w) => (
            <div className="list-item" key={w.id}>
              <div>
                <h3>{w.name}</h3>
                <p className="muted">
                  {new Date(w.finishedAt).toLocaleDateString()} ·{" "}
                  {formatDuration(
                    (new Date(w.finishedAt) - new Date(w.startedAt)) / 1000,
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <Empty
            title="No workout history"
            text="Finished sessions appear here."
          />
        )}
      </section>
    </div>
  );
}
export function Exercises({ picker = false, onPick }) {
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState("");
  const list = useMemo(
    () => exerciseService.search(q, muscle ? { muscle } : {}),
    [q, muscle],
  );
  const go = useNavigate();
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Workout Guide</p>
          <h1>Exercises</h1>
        </div>
      </div>
      <input
        className="input"
        placeholder="Search exercises"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="chip-row">
        {["", "chest", "back", "legs", "shoulders", "arms", "core"].map((m) => (
          <button
            key={m}
            className={`chip ${muscle === m ? "active" : ""}`}
            onClick={() => setMuscle(m)}
          >
            {m || "All"}
          </button>
        ))}
      </div>
      <div className="grid cols-2">
        {list.map((e) => (
          <button
            className="card"
            style={{ textAlign: "left" }}
            key={e.id}
            onClick={() =>
              picker ? onPick(e) : go(`/app/workout/exercises/${e.id}`)
            }
          >
            {e.frames[0] && (
              <img
                loading="lazy"
                src={e.frames[0]}
                alt={`${e.name} starting position`}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "contain",
                  background: "var(--surface-2)",
                  borderRadius: 12,
                }}
              />
            )}
            <h3>{e.name}</h3>
            <p className="muted">
              {e.primaryMuscles.join(", ")} · {e.equipment}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
export function ExerciseDetail() {
  const { id } = useParams();
  const e = exerciseService.get(id);
  const go = useNavigate();
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      e.frames.length < 2
    )
      return;
    const seq = [0, 1, 2, 1],
      t = setInterval(() => setFrame((f) => (f + 1) % seq.length), 900);
    return () => clearInterval(t);
  }, [e.id]);
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">{e.equipment}</p>
          <h1>{e.name}</h1>
        </div>
      </div>
      <section className="card">
        {e.frames.length ? (
          <img
            src={e.frames[[0, 1, 2, 1][frame] || 0]}
            alt={`${e.name} exercise demonstration`}
            style={{ width: "100%", maxHeight: 360, objectFit: "contain" }}
          />
        ) : (
          <div className="empty">Demonstration unavailable</div>
        )}
      </section>
      <section className="card grid">
        <div>
          <strong>Primary muscles</strong>
          <p className="muted">{e.primaryMuscles.join(", ")}</p>
        </div>
        {e.secondaryMuscles.length > 0 && (
          <div>
            <strong>Secondary muscles</strong>
            <p className="muted">{e.secondaryMuscles.join(", ")}</p>
          </div>
        )}
        <ol>
          {e.instructions.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ol>
        <button
          className="btn"
          onClick={() =>
            go("/app/workout/routines/new", { state: { exercise: e } })
          }
        >
          Add to routine
        </button>
      </section>
    </div>
  );
}
export function RoutineBuilder() {
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [picking, setPicking] = useState(false);
  const move = (i, d) => {
    const n = [...items],
      j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };
  const save = () => {
    if (!name.trim() || !items.length) return;
    update({
      ...state,
      routines: [
        ...state.routines,
        { id: crypto.randomUUID(), name, description, exercises: items, syncStatus: "PENDING" },
      ],
    });
    notify("Routine created");
    go("/app/workout");
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Reusable plan</p>
          <h1>Create routine</h1>
        </div>
      </div>
      <section className="card grid">
        <label className="field">
          Routine name
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          Description
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button className="btn secondary" onClick={() => setPicking(true)}>
          <Plus />
          Add exercises
        </button>
        {items.map((e, i) => (
          <div className="list-item routine-exercise" key={e.exerciseId}>
            <div className="list-item-main">
              <h3>{e.name}</h3>
              <div className="routine-exercise-fields">
                <label>
                  Sets
                  <input
                    className="input"
                    type="number"
                    value={e.sets}
                    onChange={(x) =>
                      setItems(
                        items.map((v, j) =>
                          j === i ? { ...v, sets: +x.target.value } : v,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Reps
                  <input
                    className="input"
                    type="number"
                    value={e.reps}
                    onChange={(x) =>
                      setItems(
                        items.map((v, j) =>
                          j === i ? { ...v, reps: +x.target.value } : v,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Rest
                  <input
                    className="input"
                    type="number"
                    value={e.rest}
                    onChange={(x) =>
                      setItems(
                        items.map((v, j) =>
                          j === i ? { ...v, rest: +x.target.value } : v,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
            <div className="item-actions">
              <button
                className="btn icon secondary"
                aria-label="Move up"
                onClick={() => move(i, -1)}
              >
                <ChevronUp />
              </button>
              <button
                className="btn icon secondary"
                aria-label="Move down"
                onClick={() => move(i, 1)}
              >
                <ChevronDown />
              </button>
              <button
                className="btn icon secondary"
                aria-label="Remove"
                onClick={() => setItems(items.filter((_, j) => j !== i))}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
        <button
          className="btn"
          disabled={!name.trim() || !items.length}
          onClick={save}
        >
          Save routine
        </button>
      </section>
      {picking && (
        <div className="modal-wrap">
          <div className="sheet" style={{ borderRadius: 20 }}>
            <Exercises
              picker
              onPick={(e) => {
                if (!items.some((x) => x.exerciseId === e.id))
                  setItems([
                    ...items,
                    {
                      exerciseId: e.id,
                      name: e.name,
                      sets: 3,
                      reps: 10,
                      rest: 90,
                    },
                  ]);
                setPicking(false);
              }}
            />
            <button className="btn secondary" onClick={() => setPicking(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export function ActiveWorkout() {
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const w = state.activeWorkout;
  const [, tick] = useState(0);
  const [finish, setFinish] = useState(false);
  const [rest, setRest] = useState(null);
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!rest?.running) return;
    const t = setInterval(
      () =>
        setRest((r) =>
          r.remaining <= 1 ? null : { ...r, remaining: r.remaining - 1 },
        ),
      1000,
    );
    return () => clearInterval(t);
  }, [rest?.running]);
  if (!w)
    return (
      <Empty
        title="No active workout"
        text="Start a routine or an empty workout."
        action={
          <button className="btn" onClick={() => go("/app/workout")}>
            Workout home
          </button>
        }
      />
    );
  const change = (ei, si, key, val) =>
    update({
      ...state,
      activeWorkout: {
        ...w,
        exercises: w.exercises.map((e, i) =>
          i === ei
            ? {
                ...e,
                sets: e.sets.map((s, j) =>
                  j === si
                    ? {
                        ...s,
                        [key]: val,
                        completedAt:
                          key === "completed" && val
                            ? new Date().toISOString()
                            : s.completedAt,
                      }
                    : s,
                ),
              }
            : e,
        ),
      },
    });
  const complete = (ei, si) => {
    change(ei, si, "completed", !w.exercises[ei].sets[si].completed);
    if (!w.exercises[ei].sets[si].completed)
      setRest({ remaining: w.exercises[ei].rest || 90, running: true });
  };
  const done = () => {
    const finished = {
      ...w,
      status: "COMPLETED",
      finishedAt: new Date().toISOString(),
      volume: calculateWorkoutVolume(w),
    };
    update({
      ...state,
      activeWorkout: null,
      workouts: [{ ...finished, syncStatus: "PENDING" }, ...state.workouts],
    });
    notify("Workout saved");
    go(`/app/workout/history/${w.id}`, { state: { summary: true } });
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {formatDuration((Date.now() - new Date(w.startedAt)) / 1000)}{" "}
            elapsed
          </p>
          <h1>{w.name}</h1>
        </div>
        <button className="btn danger" onClick={() => setFinish(true)}>
          Finish
        </button>
      </div>
      {!w.exercises.length && (
        <Empty
          title="Empty workout"
          text="Start from a routine to record exercises."
        />
      )}
      {w.exercises.map((e, ei) => (
        <section className="card grid" key={e.id}>
          <div>
            <h2>{e.name}</h2>
            <p className="muted">
              Previous:{" "}
              {state.workouts
                .find((x) =>
                  x.exercises.some((y) => y.exerciseId === e.exerciseId),
                )
                ?.exercises.find((y) => y.exerciseId === e.exerciseId)
                ?.sets.filter((s) => s.completed)
                .map((s) => `${s.weight} kg × ${s.reps}`)
                .join(", ") || "No history"}
            </p>
          </div>
          <div className="set-grid">
            <strong>Set</strong>
            <strong>kg</strong>
            <strong>Reps</strong>
            <span />
            {e.sets.map((s, si) => (
              <Fragment key={s.id}>
                <span>{si + 1}</span>
                <input
                  className="input"
                  inputMode="decimal"
                  value={s.weight}
                  onChange={(x) => change(ei, si, "weight", x.target.value)}
                />
                <input
                  className="input"
                  inputMode="numeric"
                  value={s.reps}
                  onChange={(x) => change(ei, si, "reps", +x.target.value)}
                />
                <button
                  className={`btn icon ${s.completed ? "" : "secondary"}`}
                  aria-label={`Complete set ${si + 1}`}
                  onClick={() => complete(ei, si)}
                >
                  <Check />
                </button>
              </Fragment>
            ))}
          </div>
          <button
            className="btn secondary"
            onClick={() =>
              update({
                ...state,
                activeWorkout: {
                  ...w,
                  exercises: w.exercises.map((x, i) =>
                    i === ei
                      ? {
                          ...x,
                          sets: [
                            ...x.sets,
                            {
                              id: crypto.randomUUID(),
                              setNumber: x.sets.length + 1,
                              weight: "",
                              reps: 10,
                              completed: false,
                            },
                          ],
                        }
                      : x,
                  ),
                },
              })
            }
          >
            <Plus />
            Add set
          </button>
        </section>
      ))}
      {rest && (
        <div className="workout-bar">
          <div className="workout-bar-actions">
            <small>Rest timer</small>
            <strong style={{ display: "block" }}>
              {Math.floor(rest.remaining / 60)}:
              {String(rest.remaining % 60).padStart(2, "0")}
            </strong>
          </div>
          <div>
            <button
              className="btn icon secondary"
              onClick={() => setRest({ ...rest, running: !rest.running })}
            >
              {rest.running ? <Pause /> : <Play />}
            </button>{" "}
            <button
              className="btn secondary"
              onClick={() =>
                setRest({ ...rest, remaining: rest.remaining + 15 })
              }
            >
              +15 sec
            </button>{" "}
            <button className="btn secondary" onClick={() => setRest(null)}>
              Skip
            </button>
          </div>
        </div>
      )}
      {finish && (
        <Modal
          title="Finish workout?"
          onClose={() => setFinish(false)}
          actions={
            <>
              <button
                className="btn secondary"
                onClick={() => setFinish(false)}
              >
                Keep training
              </button>
              <button className="btn" onClick={done}>
                Finish and save
              </button>
            </>
          }
        >
          <p>
            Completed sets and applicable volume will be saved to workout
            history.
          </p>
        </Modal>
      )}
    </div>
  );
}
export function History() {
  const { state } = useApp();
  const go = useNavigate();
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Completed sessions</p>
          <h1>Workout history</h1>
        </div>
      </div>
      {state.workouts.length ? (
        <div className="list">
          {state.workouts.map((w) => (
            <button
              className="list-item"
              key={w.id}
              onClick={() => go(`/app/workout/history/${w.id}`)}
            >
              <div className="list-item-main">
                <h3>{w.name}</h3>
                <p className="muted">
                  {new Date(w.finishedAt).toLocaleDateString()} ·{" "}
                  {w.exercises.length} exercises
                </p>
              </div>
              <strong>{Math.round(w.volume || 0)} kg</strong>
            </button>
          ))}
        </div>
      ) : (
        <Empty
          title="No workout history"
          text="Finish a workout to start tracking progress."
        />
      )}
    </div>
  );
}
export function HistoryDetail() {
  const { id } = useParams();
  const { state } = useApp();
  const w = state.workouts.find((x) => x.id === id);
  if (!w)
    return (
      <Empty
        title="Workout not found"
        text="This session may not have been saved."
      />
    );
  const prs = w.exercises
    .flatMap((e) =>
      e.sets
        .filter((s) => s.completed && s.weight)
        .map((s) => ({
          name: e.name,
          weight: s.weight,
          e1rm: calculateEstimated1RM(+s.weight, +s.reps),
        })),
    )
    .sort((a, b) => b.e1rm - a.e1rm)
    .slice(0, 2);
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Workout complete</p>
          <h1>{w.name}</h1>
        </div>
      </div>
      <section className="card">
        <div className="stat-row">
          <div className="stat">
            <small>Duration</small>
            <strong>
              {formatDuration(
                (new Date(w.finishedAt) - new Date(w.startedAt)) / 1000,
              )}
            </strong>
          </div>
          <div className="stat">
            <small>Sets</small>
            <strong>
              {
                w.exercises.flatMap((e) => e.sets).filter((s) => s.completed)
                  .length
              }
            </strong>
          </div>
          <div className="stat">
            <small>Volume</small>
            <strong>{Math.round(w.volume)} kg</strong>
          </div>
        </div>
      </section>
      {prs.length > 0 && (
        <section className="card">
          <h2>Estimated performance</h2>
          {prs.map((p, i) => (
            <p key={i}>
              {p.name}: Estimated 1RM {Math.round(p.e1rm)} kg
            </p>
          ))}
        </section>
      )}
      {w.exercises.map((e) => (
        <section className="card" key={e.id}>
          <h2>{e.name}</h2>
          {e.sets
            .filter((s) => s.completed)
            .map((s) => (
              <p key={s.id}>
                Set {s.setNumber}: {s.weight} kg × {s.reps}
              </p>
            ))}
        </section>
      ))}
    </div>
  );
}
