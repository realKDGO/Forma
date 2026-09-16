import { prisma } from "../config/prisma.js";
const date = (v) => new Date(`${v}T00:00:00.000Z`);
export const includeWorkout = {};
export const resources = {
  profile: {
    get: (u) => prisma.profile.findUnique({ where: { userId: u } }),
    put: (u, d) =>
      prisma.profile.upsert({
        where: { userId: u },
        create: {
          ...d,
          userId: u,
          birthDate: d.birthDate ? date(d.birthDate) : null,
        },
        update: { ...d, birthDate: d.birthDate ? date(d.birthDate) : null },
      }),
  },
  goal: {
    get: (u) => prisma.goal.findUnique({ where: { userId: u } }),
    put: (u, d) =>
      prisma.goal.upsert({
        where: { userId: u },
        create: { ...d, userId: u },
        update: d,
      }),
  },
  food: {
    list: (u, q) =>
      prisma.food.findMany({
        where: {
          OR: [{ ownerId: u }, { ownerId: null }],
          name: { contains: q || "", mode: "insensitive" },
        },
        take: 50,
      }),
    create: (u, d) =>
      prisma.food.upsert({
        where: { id: d.id },
        create: { ...d, ownerId: u },
        update: { ...d, ownerId: u },
      }),
  },
  log: {
    list: (u, q) =>
      prisma.foodLog.findMany({
        where: { userId: u, ...(q.date ? { date: date(q.date) } : {}) },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    create: (u, d) =>
      prisma.foodLog.upsert({
        where: { id: d.id },
        create: { ...d, userId: u, date: date(d.date) },
        update: { ...d, userId: u, date: date(d.date) },
      }),
  },
  weight: {
    list: (u) =>
      prisma.weightLog.findMany({
        where: { userId: u },
        orderBy: { date: "asc" },
        take: 1000,
      }),
    create: (u, d) =>
      prisma.weightLog.upsert({
        where: { id: d.id },
        create: { ...d, userId: u, date: date(d.date) },
        update: { ...d, userId: u, date: date(d.date) },
      }),
  },
  routine: {
    list: (u) =>
      prisma.routine.findMany({
        where: { userId: u },
        orderBy: { updatedAt: "desc" },
      }),
    create: (u, d) => prisma.$transaction(async (tx) => {
      const { exercises, ...routine } = d;
      const saved = await tx.routine.upsert({
        where: { id: d.id },
        create: { ...routine, exercises, userId: u },
        update: { ...routine, exercises, userId: u },
      });
      await tx.routineExercise.deleteMany({ where: { routineId: saved.id } });
      if (exercises.length) await tx.routineExercise.createMany({ data: exercises.map((exercise, order) => ({
        routineId: saved.id,
        exerciseSource: "WORKOUT_GUIDE",
        exerciseId: exercise.exerciseId,
        exerciseNameSnapshot: exercise.name,
        order,
        targetSets: exercise.sets,
        targetReps: exercise.reps,
        restSeconds: exercise.rest,
        notes: exercise.notes || null,
      })) });
      return tx.routine.findUnique({ where: { id: saved.id }, include: { routineExercises: { orderBy: { order: "asc" } } } });
    }),
  },
  workout: {
    list: (u, status) =>
      prisma.workout.findMany({
        where: { userId: u, ...(status ? { status } : {}) },
        orderBy: { startedAt: "desc" },
        take: 50,
      }),
    create: (u, d) => prisma.$transaction(async (tx) => {
      const { exercises, ...workout } = d;
      const saved = await tx.workout.upsert({
        where: { id: d.id },
        create: { ...workout, exercises, userId: u },
        update: { ...workout, exercises, userId: u },
      });
      await tx.workoutExercise.deleteMany({ where: { workoutId: saved.id } });
      for (const [order, exercise] of exercises.entries()) {
        const workoutExercise = await tx.workoutExercise.create({ data: {
          id: exercise.id || crypto.randomUUID(),
          workoutId: saved.id,
          exerciseSource: exercise.source || "WORKOUT_GUIDE",
          exerciseId: exercise.exerciseId || exercise.id,
          exerciseNameSnapshot: exercise.name || "Exercise",
          order,
          notes: exercise.notes || null,
        } });
        const sets = exercise.sets || [];
        if (sets.length) await tx.workoutSet.createMany({ data: sets.map((set, index) => ({
          id: set.id || crypto.randomUUID(),
          workoutExerciseId: workoutExercise.id,
          setNumber: set.setNumber || index + 1,
          weightKg: set.weight === "" || set.weight == null ? null : Number(set.weight),
          repetitions: Number(set.repetitions ?? set.reps ?? 0),
          completed: Boolean(set.completed),
          completedAt: set.completedAt ? new Date(set.completedAt) : null,
        })) });
      }
      return tx.workout.findUnique({ where: { id: saved.id }, include: { workoutExercises: { include: { sets: true }, orderBy: { order: "asc" } } } });
    }),
  },
};
export async function owned(model, id, userId) {
  const field = model === "food" ? "ownerId" : "userId";
  return prisma[model].findFirst({ where: { id, [field]: userId } });
}
export async function canWrite(model, id, userId) {
  const field = model === "food" ? "ownerId" : "userId";
  const record = await prisma[model].findUnique({ where: { id } });
  return !record || record[field] === userId;
}
export async function removeOwned(model, id, userId) {
  const record = await owned(model, id, userId);
  if (!record) return null;
  await prisma[model].delete({ where: { id } });
  return record;
}
