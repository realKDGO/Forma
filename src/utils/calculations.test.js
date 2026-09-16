import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  scaleNutrition,
  calculateEstimated1RM,
} from "./calculations";
describe("Forma calculations", () => {
  it("uses Mifflin-St Jeor", () =>
    expect(
      calculateBMR({ weightKg: 70, heightCm: 175, age: 25, sex: "male" }),
    ).toBe(1674));
  it("scales nutrition", () =>
    expect(scaleNutrition({ calories: 100, protein: 10 }, 1.5).calories).toBe(
      150,
    ));
  it("calculates TDEE and estimated 1RM", () => {
    expect(calculateTDEE(1600, "SEDENTARY")).toBe(1920);
    expect(Math.round(calculateEstimated1RM(100, 10))).toBe(133);
  });
});
