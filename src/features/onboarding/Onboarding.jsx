import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../store/AppStore";
import {
  calculateBMR,
  calculateTDEE,
  calculateNutritionTargets,
} from "../../utils/calculations";
import { apiClient } from "../../services/apiClient";
const steps = [
  "Welcome",
  "Personal Information",
  "Fitness Goal",
  "Activity Level",
  "Nutrition Target",
  "Complete",
];
export default function Onboarding() {
  const { state, update } = useApp();
  const go = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: state.profile?.name || "",
    birthDate: "2004-01-01",
    sex: "male",
    heightCm: 170,
    currentWeightKg: 68,
    targetWeightKg: 65,
    units: "metric",
    goalType: "MAINTAIN",
    activityLevel: "MODERATE",
  });
  const age = Math.max(
    14,
    new Date().getFullYear() - new Date(data.birthDate).getFullYear(),
  );
  const suggested = useMemo(
    () =>
      calculateNutritionTargets(
        calculateTDEE(
          calculateBMR({
            weightKg: +data.currentWeightKg,
            heightCm: +data.heightCm,
            age,
            sex: data.sex,
          }),
          data.activityLevel,
        ),
        data.goalType,
        +data.currentWeightKg,
      ),
    [data, age],
  );
  const [nextTargets, setTargets] = useState(null);
  const finish = async () => {
    const goal={...data,...(nextTargets||suggested)};
    const profile={...data,id:state.profile?.id||crypto.randomUUID(),userId:state.session.userId};
    update({
      ...state,
      profile,
      goal,
      session: { ...state.session, onboarded: true },
    });
    if(navigator.onLine) Promise.all([apiClient.put('/profile',profile),apiClient.put('/goals',goal)]).catch(()=>{});
    go("/app/home");
  };
  const content = [
    <div>
      <h1>Build your Forma</h1>
      <p className="muted">
        A few details help calculate suggested nutrition targets. You can change
        every target later.
      </p>
    </div>,
    <div className="grid">
      <label className="field">
        Name
        <input
          className="input"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </label>
      <label className="field">
        Date of birth
        <input
          className="input"
          type="date"
          value={data.birthDate}
          onChange={(e) => setData({ ...data, birthDate: e.target.value })}
        />
      </label>
      <div className="grid cols-2">
        <label className="field">
          Height (cm)
          <input
            className="input"
            type="number"
            inputMode="decimal"
            value={data.heightCm}
            onChange={(e) => setData({ ...data, heightCm: e.target.value })}
          />
        </label>
        <label className="field">
          Weight (kg)
          <input
            className="input"
            type="number"
            inputMode="decimal"
            value={data.currentWeightKg}
            onChange={(e) =>
              setData({ ...data, currentWeightKg: e.target.value })
            }
          />
        </label>
      </div>
      <label className="field">
        Sex used by formula
        <select
          className="select"
          value={data.sex}
          onChange={(e) => setData({ ...data, sex: e.target.value })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <small className="muted">
          Mifflin-St Jeor uses sex-specific constants. This estimate is not
          medical advice.
        </small>
      </label>
    </div>,
    <div className="grid">
      {[
        ["LOSE", "Lose weight"],
        ["MAINTAIN", "Maintain weight"],
        ["GAIN", "Gain weight"],
      ].map(([v, l]) => (
        <button
          className={`option ${data.goalType === v ? "selected" : ""}`}
          onClick={() => setData({ ...data, goalType: v })}
          key={v}
        >
          <strong>{l}</strong>
        </button>
      ))}
      <label className="field">
        Target weight (kg)
        <input
          className="input"
          type="number"
          value={data.targetWeightKg}
          onChange={(e) => setData({ ...data, targetWeightKg: e.target.value })}
        />
      </label>
    </div>,
    <div className="grid">
      {[
        ["SEDENTARY", "Sedentary", "Mostly seated"],
        ["LIGHT", "Lightly active", "Light exercise 1–3 days/week"],
        ["MODERATE", "Moderately active", "Moderate exercise 3–5 days/week"],
        ["VERY", "Very active", "Hard exercise most days"],
        ["EXTREME", "Extremely active", "Very hard training or physical work"],
      ].map(([v, l, d]) => (
        <button
          className={`option ${data.activityLevel === v ? "selected" : ""}`}
          onClick={() => setData({ ...data, activityLevel: v })}
          key={v}
        >
          <strong>{l}</strong>
          <br />
          <span className="muted">{d}</span>
        </button>
      ))}
    </div>,
    <div className="grid">
      <p className="muted">
        Suggested from an estimated BMR and activity level. Edit any value.
      </p>
      {Object.entries(nextTargets || suggested).map(([k, v]) => (
        <label className="field" key={k}>
          {k[0].toUpperCase() + k.slice(1)}
          <input
            className="input"
            type="number"
            value={v}
            onChange={(e) =>
              setTargets({ ...suggested, ...nextTargets, [k]: +e.target.value })
            }
          />
        </label>
      ))}
    </div>,
    <div>
      <h1>You're ready</h1>
      <p className="muted">
        Forma will use these settings for daily summaries. Your data stays on
        this device during frontend development.
      </p>
    </div>,
  ][step];
  return (
    <div className="auth">
      <section className="card auth-card grid">
        <div>
          <p className="eyebrow">
            Step {step + 1} of {steps.length}
          </p>
          <div className="progress">
            <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
        {content}
        <div
          style={{ display: "flex", gap: 8, justifyContent: "space-between" }}
        >
          {step > 0 ? (
            <button className="btn secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            className="btn"
            disabled={step === 1 && (!data.name || !data.birthDate)}
            onClick={() =>
              step === steps.length - 1 ? finish() : setStep(step + 1)
            }
          >
            {step === steps.length - 1 ? "Open Forma" : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
}
