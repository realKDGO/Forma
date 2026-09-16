import { apiClient } from "./apiClient";
const pending = (items = []) => items.filter((item) => item.syncStatus === "PENDING");
const postAll = (path, items) => Promise.all(pending(items).map((item) => apiClient.post(path, item)));
export const syncService = {
  async flush(state) {
    if (!navigator.onLine || !state.session?.authenticated) return state;
    await Promise.all([
      postAll("/foods", state.foods), postAll("/food-logs", state.foodLogs),
      postAll("/weight", state.weights), postAll("/routines", state.routines),
      ...pending(state.workouts).map((item) => apiClient.post("/workouts", item)),
      state.activeWorkout?.syncStatus === "PENDING" ? apiClient.post("/workouts", state.activeWorkout) : null,
      ...(state.pendingDeletions || []).map((item) => apiClient.delete(`${item.path}/${item.id}`)),
    ]);
    const synced = (item) => item.syncStatus === "PENDING" ? { ...item, syncStatus: "SYNCED" } : item;
    return { ...state, foods: state.foods.map(synced), foodLogs: state.foodLogs.map(synced), weights: state.weights.map(synced), routines: state.routines.map(synced), workouts: state.workouts.map(synced), activeWorkout: state.activeWorkout ? synced(state.activeWorkout) : null, pendingDeletions: [], lastSyncAt: new Date().toISOString() };
  },
};
