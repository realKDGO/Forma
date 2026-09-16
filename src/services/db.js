import { openDB } from "idb";
import { seedState, emptyState } from "../data/seed";
const DB = "forma-local";
const KEY = (userId = "signed-out") => `app-state:${userId}`;
const open = () =>
  openDB(DB, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("state")) db.createObjectStore("state");
    },
  });
export async function loadState(userId) {
  const db = await open();
  return (await db.get("state", KEY(userId))) || structuredClone(import.meta.env.DEV ? seedState : emptyState);
}
export async function saveState(value, userId) {
  const db = await open();
  await db.put("state", value, KEY(userId));
  return value;
}
export async function resetState(mode = "demo") {
  const value = structuredClone(mode === "empty" ? emptyState : seedState);
  await saveState(value, value.session?.userId);
  return value;
}
