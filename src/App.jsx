import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Apple, Scale, Dumbbell } from "lucide-react";
import { useApp } from "./store/AppStore";
import Layout from "./components/Layout";
import { Loading, Sheet } from "./components/UI";
import {
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
} from "./features/auth/AuthPages";
import Onboarding from "./features/onboarding/Onboarding";
import Home from "./features/dashboard/Home";
import {
  Diary,
  FoodSearch,
  FoodDetail,
  CustomFood,
  Scanner,
} from "./features/nutrition/Nutrition";
import {
  WorkoutHome,
  Exercises,
  ExerciseDetail,
  RoutineBuilder,
  ActiveWorkout,
  History,
  HistoryDetail,
} from "./features/workouts/Workouts";
import {
  ProgressHome,
  WeightProgress,
  NutritionProgress,
  StrengthProgress,
} from "./features/progress/Progress";
import Settings from "./features/settings/Settings";
function Protected({ children }) {
  const { state } = useApp();
  if (!state)
    return (
      <div className="content">
        <Loading />
      </div>
    );
  if (!state.session.authenticated) return <Navigate to="/login" replace />;
  if (!state.session.onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}
function Shell() {
  const [quick, setQuick] = useState(false);
  const go = useNavigate();
  return (
    <Layout onQuick={() => setQuick(true)}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="nutrition" element={<Diary />} />
          <Route path="nutrition/search" element={<FoodSearch />} />
          <Route path="nutrition/food/:id" element={<FoodDetail />} />
          <Route path="nutrition/custom" element={<CustomFood />} />
          <Route path="nutrition/scan" element={<Scanner />} />
          <Route path="workout" element={<WorkoutHome />} />
          <Route path="workout/exercises" element={<Exercises />} />
          <Route path="workout/exercises/:id" element={<ExerciseDetail />} />
          <Route path="workout/routines/new" element={<RoutineBuilder />} />
          <Route path="workout/active" element={<ActiveWorkout />} />
          <Route path="workout/history" element={<History />} />
          <Route path="workout/history/:id" element={<HistoryDetail />} />
          <Route path="progress" element={<ProgressHome />} />
          <Route path="progress/weight" element={<WeightProgress />} />
          <Route path="progress/nutrition" element={<NutritionProgress />} />
          <Route path="progress/strength" element={<StrengthProgress />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </Suspense>
      {quick && (
        <Sheet title="Quick add" onClose={() => setQuick(false)}>
          <div className="grid">
            <button
              className="option"
              onClick={() => {
                setQuick(false);
                go("/app/nutrition/search");
              }}
            >
              <Apple /> <strong>Add food</strong>
            </button>
            <button
              className="option"
              onClick={() => {
                setQuick(false);
                go("/app/progress/weight");
              }}
            >
              <Scale /> <strong>Log weight</strong>
            </button>
            <button
              className="option"
              onClick={() => {
                setQuick(false);
                go("/app/workout");
              }}
            >
              <Dumbbell /> <strong>Start workout</strong>
            </button>
          </div>
        </Sheet>
      )}
    </Layout>
  );
}
export default function App() {
  const { state, error } = useApp();
  useEffect(() => {
    if (!state) return;
    const setting = state.settings?.theme || "system";
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      (document.documentElement.dataset.theme =
        setting === "dark" || (setting === "system" && mq.matches)
          ? "dark"
          : "light");
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [state?.settings?.theme]);
  if (error)
    return (
      <div className="auth">
        <section className="card">
          <h1>Forma couldn’t load</h1>
          <p>{error}</p>
          <button className="btn" onClick={() => location.reload()}>
            Try again
          </button>
        </section>
      </div>
    );
  if (!state)
    return (
      <div className="auth">
        <section className="card auth-card">
          <Loading />
        </section>
      </div>
    );
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/app/*"
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={state?.session?.authenticated ? "/app/home" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
