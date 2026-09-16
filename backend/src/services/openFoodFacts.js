const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
export function normalizeProduct(product, barcode) {
  const n = product.nutriments || {};
  const serving = product.serving_quantity || 100;
  return {
    id: crypto.randomUUID(),
    externalId: String(product._id || barcode),
    barcode,
    name: product.product_name || product.generic_name || "Packaged food",
    brand: product.brands || null,
    servingAmount: num(serving) || 100,
    servingUnit:
      product.serving_size?.replace(String(serving), "").trim() || "g",
    calories: num(
      n["energy-kcal_serving"] ?? (n["energy-kcal_100g"] * serving) / 100,
    ),
    protein: num(n.proteins_serving ?? (n.proteins_100g * serving) / 100),
    carbohydrates: num(
      n.carbohydrates_serving ?? (n.carbohydrates_100g * serving) / 100,
    ),
    fat: num(n.fat_serving ?? (n.fat_100g * serving) / 100),
    fiber: num(n.fiber_serving ?? (n.fiber_100g * serving) / 100),
    source: "OPEN_FOOD_FACTS",
    notice: "External nutrition data should be reviewed before logging.",
  };
}
export async function lookupBarcode(barcode) {
  if (!/^\d{8,14}$/.test(barcode)) return { status: "invalid" };
  const url = new URL(
    `/api/v2/product/${encodeURIComponent(barcode)}.json`,
    "https://world.openfoodfacts.org",
  );
  url.searchParams.set(
    "fields",
    "_id,product_name,generic_name,brands,serving_quantity,serving_size,nutriments",
  );
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Forma/0.1.0 (contact: developer@example.invalid)",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw Object.assign(new Error("Provider unavailable"), { status: 503 });
  const body = await response.json();
  return body.status === 1
    ? { status: "found", food: normalizeProduct(body.product, barcode) }
    : { status: "not_found" };
}
