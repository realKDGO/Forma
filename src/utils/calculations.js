export const activityMultipliers = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  VERY: 1.725,
  EXTREME: 1.9,
};
export function calculateBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === "male" ? 5 : -161));
}
export function calculateTDEE(bmr, activity = "MODERATE") {
  return Math.round(bmr * (activityMultipliers[activity] || 1.55));
}
export function calculateNutritionTargets(
  tdee,
  goal = "MAINTAIN",
  weightKg = 70,
) {
  const adjustment = goal === "LOSE" ? -400 : goal === "GAIN" ? 300 : 0;
  const calories = Math.max(1200, tdee + adjustment);
  const protein = Math.round(weightKg * 1.8);
  const fat = Math.round((calories * 0.28) / 9);
  const carbohydrates = Math.round((calories - protein * 4 - fat * 9) / 4);
  return {
    calories,
    protein,
    fat,
    carbohydrates,
    fiber: Math.max(25, Math.round((calories / 1000) * 14)),
  };
}
export const scaleNutrition = (food, q = 1) =>
  Object.fromEntries(
    ["calories", "protein", "carbohydrates", "fat", "fiber"].map((k) => [
      k,
      Number(((food[k] || 0) * q).toFixed(1)),
    ]),
  );
export const calculateSetVolume = (s) =>
  s.completed && Number(s.weight) > 0
    ? Number(s.weight) * Number(s.reps || 0)
    : 0;
export const calculateWorkoutVolume = (w) =>
  w.exercises.reduce(
    (a, e) => a + e.sets.reduce((x, s) => x + calculateSetVolume(s), 0),
    0,
  );
export const calculateEstimated1RM = (weight, reps) =>
  reps > 0 ? weight * (1 + reps / 30) : 0;
export function formatDuration(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}
export function totalsForDate(state, date) {
  return state.foodLogs
    .filter((l) => l.date === date)
    .reduce(
      (a, l) => {
        const f = state.foods.find((x) => x.id === l.foodId);
        if (!f) return a;
        const n = scaleNutrition(f, l.quantity);
        Object.keys(n).forEach((k) => (a[k] += n[k]));
        return a;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 },
    );
}
