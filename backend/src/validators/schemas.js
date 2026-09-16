import { z } from "zod";
export const uuid = z.uuid();
export const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const nonnegative = z.coerce.number().min(0).max(100000);
export const profile = z.object({
  name: z.string().trim().min(1).max(120),
  birthDate: date.nullish(),
  sex: z.enum(["male", "female"]).nullish(),
  heightCm: z.coerce.number().min(50).max(300).nullish(),
  units: z.enum(["metric", "imperial"]),
});
export const goal = z.object({
  goalType: z.enum(["LOSE", "MAINTAIN", "GAIN"]),
  targetWeightKg: z.coerce.number().min(20).max(500).nullish(),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "VERY", "EXTREME"]),
  weeklyRateKg: z.coerce.number().min(0).max(2).nullish(),
  calories: z.coerce.number().int().min(800).max(10000),
  protein: z.coerce.number().int().min(0).max(1000),
  carbohydrates: z.coerce.number().int().min(0).max(2000),
  fat: z.coerce.number().int().min(0).max(1000),
  fiber: z.coerce.number().int().min(0).max(300),
});
export const food = z.object({
  id: uuid,
  name: z.string().trim().min(1).max(200),
  brand: z.string().max(120).nullish(),
  barcode: z
    .string()
    .regex(/^\d{8,14}$/)
    .nullish(),
  servingAmount: z.coerce.number().positive().max(100000),
  servingUnit: z.string().min(1).max(30),
  calories: nonnegative,
  protein: nonnegative,
  carbohydrates: nonnegative,
  fat: nonnegative,
  fiber: nonnegative,
  source: z.enum(["USER", "OPEN_FOOD_FACTS"]).default("USER"),
});
export const foodLog = z.object({
  id: uuid,
  foodId: uuid.nullish(),
  date,
  meal: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACKS"]),
  quantity: z.coerce.number().positive().max(1000),
  nutrition: z.object({
    servingAmount: nonnegative,
    servingUnit: z.string(),
    calories: nonnegative,
    protein: nonnegative,
    carbohydrates: nonnegative,
    fat: nonnegative,
    fiber: nonnegative,
  }),
});
export const weight = z.object({
  id: uuid,
  date,
  weightKg: z.coerce.number().min(20).max(500),
  note: z.string().max(500).nullish(),
});
export const routine = z.object({
  id: uuid,
  name: z.string().trim().min(1).max(120),
  description: z.string().max(1000).nullish(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1),
        name: z.string().min(1),
        sets: z.number().int().min(1).max(20),
        reps: z.number().int().min(1).max(1000),
        rest: z.number().int().min(0).max(3600),
      }),
    )
    .max(100),
});
export const workout = z.object({
  id: uuid,
  routineId: uuid.nullish(),
  name: z.string().min(1).max(120),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullish(),
  notes: z.string().max(2000).nullish(),
  exercises: z.array(z.any()).max(100),
  summary: z.record(z.string(), z.any()).nullish(),
});
