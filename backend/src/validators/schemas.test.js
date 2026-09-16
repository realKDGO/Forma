import { describe, expect, it } from "vitest";
import { foodLog, weight, workout } from "./schemas.js";
const id="00000000-0000-4000-8000-000000000001";
describe("authoritative validation",()=>{
  it("rejects impossible weight",()=>expect(()=>weight.parse({id,date:"2026-09-16",weightKg:-1})).toThrow());
  it("rejects invalid diary dates",()=>expect(()=>foodLog.parse({id,date:"09/16/2026",meal:"LUNCH",quantity:1,nutrition:{servingAmount:1,servingUnit:"g",calories:1,protein:1,carbohydrates:1,fat:1,fiber:1}})).toThrow());
  it("rejects invalid workout timestamps",()=>expect(()=>workout.parse({id,name:"Push",status:"ACTIVE",startedAt:"today",exercises:[]})).toThrow());
});
