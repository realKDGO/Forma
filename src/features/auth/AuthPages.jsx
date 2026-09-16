import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, ShieldAlert } from "lucide-react";
import { useApp } from "../../store/AppStore";
import { Brand } from "../../components/Layout";
import { Modal } from "../../components/UI";
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
  const [confirmationSent, setConfirmationSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!state) return setError("Forma is still loading. Please try again.");
    if (register && !name.trim()) return setError("Enter your name.");
    if (!email.includes("@") || password.length < 6)
      return setError(
        "Enter a valid email and a password with at least 6 characters.",
      );
    setLoading(true); setError("");
    try {
      const session = register ? await authService.register(name.trim(),email,password) : await authService.login(email,password);
      if (!session) {
        setConfirmationSent(true);
        return;
      }
      let remote = {};
      if (!register) {
        try {
          const syncData = (await apiClient.get("/sync"))?.data?.data;
          remote =
            syncData && typeof syncData === "object" && !Array.isArray(syncData)
              ? syncData
              : {};
        } catch {
          remote = {};
        }
      }
      const nextProfile = register
        ? { name: name.trim(), units: "metric" }
        : remote.profile || state.profile || null;
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
          <div className="password-field">
            <input
              className="input"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={register ? "new-password" : "current-password"}
            />
            <button
              type="button"
              className="btn icon secondary"
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
        {!register && (
          <Link className="auth-link" to="/forgot-password">
            Forgot password?
          </Link>
        )}
        <p className="muted">
          {register ? "Already have an account? " : "New to Forma? "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Register"}
          </Link>
        </p>
      </form>
      {confirmationSent && (
        <Modal
          title="Confirm your email"
          onClose={() => setConfirmationSent(false)}
          actions={
            <>
              <button
                className="btn secondary"
                onClick={() => setConfirmationSent(false)}
              >
                Close
              </button>
              <button className="btn" onClick={() => go("/login")}>
                Go to login
              </button>
            </>
          }
        >
          <div className="confirmation-message">
            <Mail aria-hidden="true" />
            <p>
              We sent a confirmation link to <strong>{email}</strong>. Open it
              to verify your account and return to Forma onboarding.
            </p>
          </div>
          <div className="spam-callout">
            <ShieldAlert aria-hidden="true" />
            <div>
              <strong>Check your Spam folder</strong>
              <p>
                If the email is not in your inbox after a few minutes, check
                your Spam or Junk folder and mark the message as not spam.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export const Login = () => <AuthForm />;
export const Register = () => <AuthForm register />;

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email address.");
    setLoading(true);
    setError("");
    try {
      await authService.requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError(
        "We couldn’t send the reset email. Please wait a moment and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="card auth-card grid">
        <Brand />
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1>Reset your password</h1>
          <p className="muted">
            Enter the email connected to your Forma account.
          </p>
        </div>
        {sent ? (
          <>
            <div className="confirmation-message" role="status">
              <Mail aria-hidden="true" />
              <p>
                If an account exists for <strong>{email}</strong>, a password
                reset link has been sent.
              </p>
            </div>
            <div className="spam-callout">
              <ShieldAlert aria-hidden="true" />
              <div>
                <strong>Check your Spam folder</strong>
                <p>The reset message may take a few minutes to arrive.</p>
              </div>
            </div>
            <Link className="btn" to="/login">
              Back to login
            </Link>
          </>
        ) : (
          <form className="grid" onSubmit={submit}>
            <label className="field">
              Email
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <Link className="auth-link" to="/login">
              Back to login
            </Link>
          </form>
        )}
      </section>
    </div>
  );
}

export function ResetPassword() {
  const go = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [show, setShow] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    authService.session().then((session) => {
      if (active) {
        setReady(Boolean(session));
        setChecking(false);
      }
    });
    const subscription = authService.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setChecking(false);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < 8)
      return setError("Use at least 8 characters for your new password.");
    if (password !== confirmation)
      return setError("The passwords do not match.");
    setLoading(true);
    setError("");
    try {
      await authService.updatePassword(password);
      await authService.logout();
      go("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Your password could not be updated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="card auth-card grid">
        <Brand />
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1>Choose a new password</h1>
          <p className="muted">Use at least 8 characters.</p>
        </div>
        {checking ? (
          <p className="muted" role="status">
            Checking your reset link…
          </p>
        ) : ready ? (
          <form className="grid" onSubmit={submit}>
            <label className="field">
              New password
              <div className="password-field">
                <input
                  className="input"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="btn icon secondary"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((current) => !current)}
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
            <label className="field">
              Confirm new password
              <input
                className="input"
                type={show ? "text" : "password"}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : (
          <div className="grid">
            <p className="error" role="alert">
              This reset link is invalid or has expired. Request a new one.
            </p>
            <Link className="btn" to="/forgot-password">
              Request another link
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
