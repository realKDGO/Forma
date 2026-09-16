import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  ScanLine,
  Heart,
  Trash2,
  Edit3,
} from "lucide-react";
import { useApp } from "../../store/AppStore";
import { scaleNutrition, totalsForDate } from "../../utils/calculations";
import { Empty, Modal, ProgressBar } from "../../components/UI";
import { barcodeService } from "../../services/barcodeService";
const today = () => new Date().toISOString().slice(0, 10);
const meals = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];
export function Diary() {
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const [date, setDate] = useState(today());
  const [edit, setEdit] = useState(null);
  const t = totalsForDate(state, date);
  const move = (d) => {
    const x = new Date(date + "T12:00:00Z");
    x.setUTCDate(x.getUTCDate() + d);
    setDate(x.toISOString().slice(0, 10));
  };
  const del = (id) => {
    update({ ...state, foodLogs: state.foodLogs.filter((x) => x.id !== id), pendingDeletions: [...(state.pendingDeletions || []), { path: "/food-logs", id, createdAt: new Date().toISOString() }] });
    setEdit(null);
    notify("Food removed");
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Daily diary</p>
          <h1>Nutrition</h1>
        </div>
        <div>
          <button
            className="btn icon secondary"
            aria-label="Search foods"
            onClick={() => go("/app/nutrition/search")}
          >
            <Search />
          </button>{" "}
          <button
            className="btn icon secondary"
            aria-label="Scan barcode"
            onClick={() => go("/app/nutrition/scan")}
          >
            <ScanLine />
          </button>
        </div>
      </div>
      <section className="card">
        <div className="date-navigation">
          <button
            className="btn icon secondary"
            aria-label="Previous day"
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </button>
          <input
            className="input"
            type="date"
            max={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="btn icon secondary"
            aria-label="Next day"
            disabled={date >= today()}
            onClick={() => move(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </section>
      <section className="card grid">
        <div className="metric">
          <strong>{Math.round(t.calories)} kcal</strong>
          <span className="muted">of {state.goal.calories}</span>
        </div>
        <ProgressBar
          label="Protein"
          value={t.protein}
          target={state.goal.protein}
        />
      </section>
      {meals.map((meal) => {
        const logs = state.foodLogs.filter(
          (l) => l.date === date && l.meal === meal,
        );
        const c = logs.reduce(
          (a, l) =>
            a +
            scaleNutrition(
              state.foods.find((f) => f.id === l.foodId) || {},
              l.quantity,
            ).calories,
          0,
        );
        return (
          <section className="card" key={meal}>
            <div className="page-head">
              <div>
                <h2>{meal[0] + meal.slice(1).toLowerCase()}</h2>
                <span className="muted">{Math.round(c)} kcal</span>
              </div>
              <button
                className="btn icon secondary"
                aria-label={`Add food to ${meal}`}
                onClick={() => go(`/app/nutrition/search?meal=${meal}`)}
              >
                <Plus />
              </button>
            </div>
            {logs.length ? (
              <div className="list">
                {logs.map((l) => {
                  const f = state.foods.find((x) => x.id === l.foodId),
                    n = scaleNutrition(f, l.quantity);
                  return (
                    <button
                      className="list-item"
                      style={{ textAlign: "left" }}
                      key={l.id}
                      onClick={() => setEdit({ ...l, food: f })}
                    >
                      <div className="list-item-main">
                        <h3>{f.name}</h3>
                        <p className="muted">
                          {l.quantity} × {f.servingAmount} {f.servingUnit}
                        </p>
                      </div>
                      <strong>{Math.round(n.calories)}</strong>
                      <Edit3 size={17} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <Empty
                title="No food logged"
                text={`Add your ${meal.toLowerCase()} when you're ready.`}
              />
            )}
          </section>
        );
      })}
      {edit && (
        <Modal
          title="Edit diary entry"
          onClose={() => setEdit(null)}
          actions={
            <>
              <button className="btn danger" onClick={() => del(edit.id)}>
                <Trash2 />
                Delete
              </button>
              <button
                className="btn"
                onClick={() => {
                  update({
                    ...state,
                    foodLogs: state.foodLogs.map((x) =>
                      x.id === edit.id ? edit : x,
                    ),
                  });
                  setEdit(null);
                  notify("Food updated");
                }}
              >
                Save
              </button>
            </>
          }
        >
          <div className="grid">
            <h3>{edit.food.name}</h3>
            <label className="field">
              Quantity
              <input
                className="input"
                type="number"
                min="0.1"
                step="0.1"
                value={edit.quantity}
                onChange={(e) =>
                  setEdit({ ...edit, quantity: +e.target.value })
                }
              />
            </label>
            <label className="field">
              Meal
              <select
                className="select"
                value={edit.meal}
                onChange={(e) => setEdit({ ...edit, meal: e.target.value })}
              >
                {meals.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function FoodSearch() {
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const results = useMemo(
    () =>
      state.foods.filter(
        (f) =>
          (tab !== "favorites" || state.favorites.includes(f.id)) &&
          f.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [state, q, tab],
  );
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Add to diary</p>
          <h1>Find food</h1>
        </div>
        <button
          className="btn secondary"
          onClick={() => go("/app/nutrition/custom")}
        >
          Custom food
        </button>
      </div>
      <label className="field">
        <span className="sr-only">Search</span>
        <input
          autoFocus
          className="input"
          placeholder="Search foods"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <div className="chip-row">
        <button
          className={`chip ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          className={`chip ${tab === "favorites" ? "active" : ""}`}
          onClick={() => setTab("favorites")}
        >
          Favorites
        </button>
      </div>
      {!q && state.recentFoodIds.length > 0 && (
        <section>
          <h2>Recent</h2>
        </section>
      )}
      <div className="list">
        {results.map((f) => (
          <div className="list-item" key={f.id}>
            <button
              className="btn icon secondary"
              aria-label={
                state.favorites.includes(f.id) ? "Unfavorite" : "Favorite"
              }
              onClick={() =>
                update({
                  ...state,
                  favorites: state.favorites.includes(f.id)
                    ? state.favorites.filter((x) => x !== f.id)
                    : [...state.favorites, f.id],
                })
              }
            >
              <Heart
                fill={state.favorites.includes(f.id) ? "currentColor" : "none"}
                size={19}
              />
            </button>
            <button
              className="list-item-main"
              style={{
                border: 0,
                background: "none",
                color: "inherit",
                textAlign: "left",
              }}
              onClick={() => go(`/app/nutrition/food/${f.id}`)}
            >
              <h3>{f.name}</h3>
              <p className="muted">
                {f.servingAmount} {f.servingUnit} · {f.calories} kcal
              </p>
            </button>
          </div>
        ))}
      </div>
      {results.length === 0 && (
        <Empty
          title="No foods found"
          text="Try another search or create a custom food."
          action={
            <button className="btn" onClick={() => go("/app/nutrition/custom")}>
              Create food
            </button>
          }
        />
      )}
    </div>
  );
}
export function FoodDetail() {
  const { id } = useParams();
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const f = state.foods.find((x) => x.id === id);
  const [q, setQ] = useState(1);
  const [meal, setMeal] = useState("BREAKFAST");
  if (!f)
    return <Empty title="Food not found" text="This food is unavailable." />;
  const n = scaleNutrition(f, q);
  const add = () => {
    update({
      ...state,
      foodLogs: [
        ...state.foodLogs,
        {
          id: crypto.randomUUID(),
          foodId: f.id,
          date: today(),
          meal,
          quantity: q,
          nutrition: {
            servingAmount: f.servingAmount,
            servingUnit: f.servingUnit,
            ...n,
          },
          createdAt: new Date().toISOString(),
          syncStatus: "PENDING",
        },
      ],
      recentFoodIds: [
        f.id,
        ...state.recentFoodIds.filter((x) => x !== f.id),
      ].slice(0, 12),
    });
    notify("Food added");
    go("/app/nutrition");
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">{f.brand || "Forma food"}</p>
          <h1>{f.name}</h1>
        </div>
      </div>
      <section className="card grid">
        <div className="stat-row">
          <div className="stat">
            <small>Calories</small>
            <strong>{n.calories}</strong>
          </div>
          <div className="stat">
            <small>Protein</small>
            <strong>{n.protein}g</strong>
          </div>
          <div className="stat">
            <small>Carbs</small>
            <strong>{n.carbohydrates}g</strong>
          </div>
        </div>
        <ProgressBar label="Fat" value={n.fat} target={state.goal.fat} />
        <p className="muted">Fiber {n.fiber} g</p>
      </section>
      <section className="card grid">
        <label className="field">
          Quantity
          <input
            className="input"
            type="number"
            min="0.1"
            step="0.1"
            value={q}
            onChange={(e) => setQ(+e.target.value)}
          />
          <small className="muted">
            1 serving = {f.servingAmount} {f.servingUnit}
          </small>
        </label>
        <label className="field">
          Meal
          <select
            className="select"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          >
            {meals.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={add}>
          Add to diary
        </button>
      </section>
    </div>
  );
}
export function CustomFood() {
  const { state, update, notify } = useApp();
  const go = useNavigate();
  const [form, setForm] = useState({
    name: "",
    brand: "",
    servingAmount: 100,
    servingUnit: "g",
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    barcode: "",
  });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const food = {
      ...form,
      id: crypto.randomUUID(),
      source: "USER",
      ownerId: state.session.userId,
      syncStatus: "PENDING",
    };
    update({ ...state, foods: [...state.foods, food] });
    notify("Custom food saved");
    go(`/app/nutrition/food/${food.id}`);
  };
  return (
    <form className="grid" onSubmit={submit}>
      <div className="page-head">
        <div>
          <p className="eyebrow">Personal collection</p>
          <h1>Custom food</h1>
        </div>
      </div>
      <section className="card grid">
        {Object.entries(form)
          .filter(([k]) => k !== "id")
          .map(([k, v]) => (
            <label className="field" key={k}>
              {k
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (x) => x.toUpperCase())}
              <input
                className="input"
                required={
                  k === "name" ||
                  k === "servingAmount" ||
                  k === "servingUnit" ||
                  k === "calories"
                }
                type={typeof v === "number" ? "number" : "text"}
                min={typeof v === "number" ? 0 : undefined}
                value={v}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [k]:
                      typeof v === "number" ? +e.target.value : e.target.value,
                  })
                }
              />
            </label>
          ))}
        <button className="btn">Save food</button>
      </section>
    </form>
  );
}
export function Scanner() {
  const { state, update } = useApp();
  const go = useNavigate();
  const [status, setStatus] = useState("idle");
  const [code, setCode] = useState("4800016051014");
  const open = async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((t) => t.stop());
      setStatus("ready");
    } catch (e) {
      setStatus(e.name === "NotAllowedError" ? "denied" : "unavailable");
    }
  };
  const lookup = async () => {
    setStatus("requesting");
    const local = state.foods.find((x) => x.barcode === code);
    if (local) return go(`/app/nutrition/food/${local.id}`);
    try {
      const result = await barcodeService.lookup(code);
      const external = { ...result.food, id: crypto.randomUUID(), source: "OPEN_FOOD_FACTS" };
      update({ ...state, foods: [...state.foods, external] });
      go(`/app/nutrition/food/${external.id}`);
    } catch (error) {
      setStatus(error.status === 404 ? "missing" : "unavailable");
    }
  };
  return (
    <div className="grid">
      <div className="page-head">
        <div>
          <p className="eyebrow">Packaged foods</p>
          <h1>Scan barcode</h1>
        </div>
      </div>
      <section className="card empty">
        <ScanLine size={64} />
        <h2>
          {status === "idle"
            ? "Camera opens only when you choose"
            : status === "ready"
              ? "Scanner ready"
              : status === "denied"
                ? "Camera permission denied"
                : status === "unavailable"
                  ? "Camera unavailable"
                  : status === "missing"
                    ? "Product not found"
                    : "Requesting camera…"}
        </h2>
        <p className="muted">You can always enter a barcode manually.</p>
        {status === "idle" && (
          <button className="btn" onClick={open}>
            Open camera
          </button>
        )}
      </section>
      <section className="card grid">
        <label className="field">
          Barcode
          <input
            className="input"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button className="btn" onClick={lookup}>
          Look up product
        </button>
        {status === "missing" && (
          <button
            className="btn secondary"
            onClick={() => go("/app/nutrition/custom")}
          >
            Create food
          </button>
        )}
      </section>
    </div>
  );
}
