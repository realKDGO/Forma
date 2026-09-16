import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { resources, owned, removeOwned, canWrite } from "../services/resources.js";
import {
  profile,
  goal,
  food,
  foodLog,
  weight,
  routine,
  workout,
} from "../validators/schemas.js";
import { lookupBarcode } from "../services/openFoodFacts.js";
import { prisma } from "../config/prisma.js";
export const api = Router();
api.get("/health", (req, res) => res.json({ status: "ok", version: "0.1.0" }));
api.use(requireAuth);
api.get("/auth/me", (req, res) => res.json({ user: req.user }));
for (const [path, key, schema] of [
  ["profile", "profile", profile],
  ["goals", "goal", goal],
]) {
  api.get(`/${path}`, async (req, res) =>
    res.json({ data: await resources[key].get(req.user.id) }),
  );
  api.put(`/${path}`, async (req, res) =>
    res.json({
      data: await resources[key].put(req.user.id, schema.parse(req.body)),
    }),
  );
}
for (const [path, key, schema] of [
  ["foods", "food", food],
  ["food-logs", "log", foodLog],
  ["weight", "weight", weight],
  ["routines", "routine", routine],
  ["workouts", "workout", workout],
]) {
  api.get(`/${path}`, async (req, res) =>
    res.json({
      data: await resources[key].list(
        req.user.id,
        key === "log" ? req.query : req.query.status,
      ),
    }),
  );
  const write = async (req, res) => {
    const body = schema.parse(req.body);
    const model = key === "log" ? "foodLog" : key;
    if (!(await canWrite(model, body.id, req.user.id)))
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You cannot modify this record." } });
    res.status(req.method === "POST" ? 201 : 200).json({ data: await resources[key].create(req.user.id, body) });
  };
  api.post(`/${path}`, write);
  api.patch(`/${path}/:id`, async (req,res,next) => {
    req.body={...req.body,id:req.params.id};
    return write(req,res,next);
  });
  api.get(`/${path}/:id`, async (req, res) => {
    const id = z.uuid().parse(req.params.id),
      data = await owned(key === "log" ? "foodLog" : key, id, req.user.id);
    data
      ? res.json({ data })
      : res
          .status(404)
          .json({ error: { code: "NOT_FOUND", message: "Record not found." } });
  });
  api.delete(`/${path}/:id`, async (req, res) => {
    const id = z.uuid().parse(req.params.id),
      data = await removeOwned(
        key === "log" ? "foodLog" : key,
        id,
        req.user.id,
      );
    data
      ? res.status(204).end()
      : res
          .status(404)
          .json({ error: { code: "NOT_FOUND", message: "Record not found." } });
  });
}
api.put("/favorites/:foodId", async (req, res) => {
  const foodId = z.uuid().parse(req.params.foodId);
  await prisma.favoriteFood.upsert({
    where: { userId_foodId: { userId: req.user.id, foodId } },
    create: { userId: req.user.id, foodId },
    update: {},
  });
  res.status(204).end();
});
api.delete("/favorites/:foodId", async (req, res) => {
  const foodId = z.uuid().parse(req.params.foodId);
  await prisma.favoriteFood.deleteMany({
    where: { userId: req.user.id, foodId },
  });
  res.status(204).end();
});
api.get("/favorites", async (req, res) =>
  res.json({
    data: await prisma.favoriteFood.findMany({
      where: { userId: req.user.id },
      select: { foodId: true },
    }),
  }),
);
api.get("/barcodes/:barcode", async (req, res) => {
  const result = await lookupBarcode(req.params.barcode);
  res
    .status(
      result.status === "invalid"
        ? 400
        : result.status === "not_found"
          ? 404
          : 200,
    )
    .json(result);
});
api.get("/progress", async (req, res) => {
  const [weights, logs, workouts] = await Promise.all([
    resources.weight.list(req.user.id),
    resources.log.list(req.user.id, {}),
    resources.workout.list(req.user.id, "COMPLETED"),
  ]);
  res.json({ data: { weights, logs, workouts } });
});
api.get("/sync", async (req, res) => {
  const since = req.query.since ? new Date(req.query.since) : new Date(0);
  const [profileData, goalData, foods, favorites, foodLogs, weights, routines, workouts] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: req.user.id } }),
      prisma.goal.findUnique({ where: { userId: req.user.id } }),
      prisma.food.findMany({ where: { OR: [{ ownerId: req.user.id }, { ownerId: null }], updatedAt: { gt: since } } }),
      prisma.favoriteFood.findMany({ where: { userId: req.user.id }, select: { foodId: true } }),
      prisma.foodLog.findMany({
        where: { userId: req.user.id, updatedAt: { gt: since } },
      }),
      prisma.weightLog.findMany({
        where: { userId: req.user.id, updatedAt: { gt: since } },
      }),
      prisma.routine.findMany({
        where: { userId: req.user.id, updatedAt: { gt: since } },
      }),
      prisma.workout.findMany({
        where: { userId: req.user.id, updatedAt: { gt: since } },
      }),
    ]);
  res.json({
    data: {
      profile: profileData,
      goal: goalData,
      foods,
      favoriteIds: favorites.map(({ foodId }) => foodId),
      foodLogs,
      weights,
      routines,
      workouts,
      serverTime: new Date().toISOString(),
    },
  });
});
