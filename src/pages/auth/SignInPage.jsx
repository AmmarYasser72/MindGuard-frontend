import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { Button, Card } from "../../components/common/Primitives.jsx";
import { AuthLogo, ErrorBanner, PasswordField, TextField } from "../../components/auth/AuthForm.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "../../hooks/useRouter.js";

const demoAccounts = [
  { title: "Patient Account", email: "patient@demo.com", password: "demo123", icon: "user" },
  { title: "Doctor Account", email: "doctor@demo.com", password: "demo123", icon: "stethoscope" },
];

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { signIn, authLoading } = useAuth();
  const { navigate } = useRouter();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitCredentials(credentials) {
    setError("");
    const cleanEmail = credentials.email.trim();
    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      const user = await signIn(cleanEmail, credentials.password);
      navigate(user.email?.includes("doctor") || user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    } catch (authError) {
      setError(authError.message);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    submitCredentials(form);
  }

  function useDemoAccount(account) {
    const credentials = { email: account.email, password: account.password };
    setForm(credentials);
    submitCredentials(credentials);
  }

  return (
    <main className="auth-page signin-page">
      <section className="signin-shell">
        <div className="signin-hero-panel">
          <AuthLogo />
          <span className="eyebrow">Mind Guard</span>
          <h1>Welcome back</h1>
          <p>Sign in to continue your mental wellness care.</p>
          <div className="auth-benefit-grid" aria-label="Sign in benefits">
            <span>
              <Icon name="timer" size={18} color="#0f766e" />
             Fast Recovery
            </span>
            <span>
              <Icon name="shield-check" size={18} color="#4f46e5" />
              Secure session
            </span>
          </div>
        </div>

        <div className="signin-stack">
          <Card className="auth-card">
            <form onSubmit={onSubmit}>
              <div className="form-title-row">
                <div>
                  <h2>Sign in</h2>
                  <p>Use your email and password.</p>
                </div>
                <Icon name="log-in" size={22} color="#6366f1" />
              </div>
              <ErrorBanner error={error} />
              <TextField
                label="Email"
                icon="mail"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(value) => update("email", value)}
                autoComplete="email"
                disabled={authLoading}
              />
              <PasswordField
                label="Password"
                value={form.password}
                onChange={(value) => update("password", value)}
                autoComplete="current-password"
                disabled={authLoading}
              />
              <Button type="submit" className="btn-full auth-submit" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <Icon name="loader-circle" size={18} color="#fff" className="spin-icon" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <Icon name="arrow-right" size={18} color="#fff" />
                  </>
                )}
              </Button>
            </form>
            <p className="auth-switch">
              Don't have an account? <button type="button" onClick={() => navigate("/signup")}>Sign up</button>
            </p>
          </Card>

          <Card className="demo-card">
            <div className="demo-heading">
              <Icon name="flask-conical" size={18} color="#3b82f6" />
              <div>
                <h2>Demo Accounts</h2>
                <p>One-click access for testing</p>
              </div>
            </div>
            {demoAccounts.map((account) => (
              <button
                type="button"
                className="demo-account"
                key={account.email}
                onClick={() => useDemoAccount(account)}
                disabled={authLoading}
              >
                <span><Icon name={account.icon} size={20} color="#3b82f6" /></span>
                <span>
                  <strong>{account.title}</strong>
                  <small>{account.email}</small>
                </span>
                <span className="demo-use">Use</span>
              </button>
            ))}
          </Card>

        </div>
      </section>
    </main>
  );
}
