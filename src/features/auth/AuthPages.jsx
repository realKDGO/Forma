import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../../store/AppStore";
import { Brand } from "../../components/Layout";
import { authService } from "../../services/authService";
import { apiClient } from "../../services/apiClient";
function AuthForm({ register = false }) {
  const { state, update } = useApp();
  const go = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (register && !name.trim()) return setError("Enter your name.");
    if (!email.includes("@") || password.length < 6)
      return setError(
        "Enter a valid email and a password with at least 6 characters.",
      );
    setLoading(true); setError("");
    try {
      const session = register ? await authService.register(name.trim(),email,password) : await authService.login(email,password);
      if (!session) return setError("Check your email to confirm the account, then log in.");
      let remote={};
      if(!register){try{remote=(await apiClient.get('/sync')).data.data}catch{remote={}}}
      const nextProfile=register?{name:name.trim(),units:'metric'}:(remote.profile || state.profile);
      update({...state,...remote,profile:nextProfile,session:{authenticated:true,onboarded:register?false:!!nextProfile,userId:session.user.id}});
      go(register?'/onboarding':'/app/home');
    } catch (err) { setError(err.message || "Authentication failed."); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth">
      <form className="card auth-card grid" onSubmit={submit}>
        <Brand />
        <div>
          <p className="eyebrow">Nutrition. Training. Progress.</p>
          <h1>{register ? "Create your account" : "Welcome back"}</h1>
        </div>
        {register && (
          <label className="field">
            Name
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
        )}
        <label className="field">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="field">
          Password
          <div style={{ display: "flex" }}>
            <input
              className="input"
              style={{ borderRadius: "12px 0 0 12px" }}
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={register ? "new-password" : "current-password"}
            />
            <button
              type="button"
              className="btn secondary"
              style={{ borderRadius: "0 12px 12px 0" }}
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="btn" disabled={loading}>{loading ? "Please wait…" : register ? "Continue" : "Log in"}</button>
        <p className="muted">
          {register ? "Already have an account? " : "New to Forma? "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}
export const Login = () => <AuthForm />;
export const Register = () => <AuthForm register />;
