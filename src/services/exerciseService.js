import {
  searchExercises,
  getExercise,
  getAssetUrl,
} from "@bryllim/workout-guide";
const fallback = [
  {
    id: "push-up",
    name: "Push Up",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps"],
    equipment: "bodyweight",
    instructions: [
      "Keep a straight line from shoulders to heels.",
      "Lower with control, then press away.",
    ],
  },
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps"],
    equipment: "barbell",
    instructions: [
      "Set your shoulders and feet.",
      "Lower the bar with control and press upward.",
    ],
  },
  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: ["glutes"],
    equipment: "bodyweight",
    instructions: [
      "Sit the hips down and back.",
      "Stand tall through the whole foot.",
    ],
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps"],
    equipment: "dumbbell",
    instructions: [
      "Brace your torso.",
      "Pull toward the hip and lower slowly.",
    ],
  },
];
const normalize = (e) => ({
  id: e.id || e.slug,
  name: e.name || e.title,
  primaryMuscles:
    e.primaryMuscles ||
    e.muscles ||
    (e.primaryMuscle ? [e.primaryMuscle] : ["general"]),
  secondaryMuscles: e.secondaryMuscles || [],
  equipment: Array.isArray(e.equipment)
    ? e.equipment.join(", ")
    : e.equipment || "bodyweight",
  instructions: e.instructions || [],
  frames: [1, 2, 3]
    .map((n) => {
      try {
        return getAssetUrl(e.id || e.slug, n);
      } catch {
        return null;
      }
    })
    .filter(Boolean),
  source: "WORKOUT_GUIDE",
});
export const exerciseService = {
  search(query = "", filters = {}) {
    try {
      const list = searchExercises(query, filters);
      return (list?.length ? list : fallback).slice(0, 80).map(normalize);
    } catch {
      return fallback
        .filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
        .map(normalize);
    }
  },
  get(id) {
    try {
      return normalize(getExercise(id));
    } catch {
      return normalize(fallback.find((x) => x.id === id) || fallback[0]);
    }
  },
};
