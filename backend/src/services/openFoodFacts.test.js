import { describe, it, expect } from "vitest";
import { normalizeProduct } from "./openFoodFacts.js";
describe("Open Food Facts normalization", () => {
  it("does not leak provider shape", () => {
    const f = normalizeProduct(
      {
        _id: "x",
        product_name: "Test",
        serving_quantity: 50,
        serving_size: "50 g",
        nutriments: { "energy-kcal_100g": 200, proteins_100g: 10 },
      },
      "12345678",
    );
    expect(f.calories).toBe(100);
    expect(f.protein).toBe(5);
    expect(f.nutriments).toBeUndefined();
  });
});
