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

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      const user = await signIn(form.email, form.password);
      navigate(user.email?.includes("doctor") || user.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    } catch (authError) {
      setError(authError.message);
    }
  }

  return (
    <main className="auth-page signin-page">
      <section className="auth-shell">
        <AuthLogo />
        <h1>Mind Guard</h1>
        <p>Your mental health companion</p>
        <Card className="demo-card">
          <div className="demo-heading">
            <Icon name="flask-conical" size={18} color="#3b82f6" />
            <div>
              <h2>Demo Accounts</h2>
              <p>Tap to auto-fill credentials</p>
            </div>
          </div>
          {demoAccounts.map((account) => (
            <button
              type="button"
              className="demo-account"
              key={account.email}
              onClick={() => setForm({ email: account.email, password: account.password })}
            >
              <span><Icon name={account.icon} size={20} color="#3b82f6" /></span>
              <span>
                <strong>{account.title}</strong>
                <small>{account.email}</small>
              </span>
              <Icon name="chevron-right" size={16} color="#9ca3af" />
            </button>
          ))}
        </Card>
        <Card className="auth-card">
          <form onSubmit={onSubmit}>
            <ErrorBanner error={error} />
            <TextField label="Email" icon="mail" type="email" placeholder="Enter your email" value={form.email} onChange={(value) => update("email", value)} />
            <PasswordField label="Password" value={form.password} onChange={(value) => update("password", value)} placeholder="Enter your password" />
            <Button type="submit" className="btn-full" disabled={authLoading}>
              {authLoading ? "Signing In..." : "Sign In"}
              <Icon name="arrow-right" size={18} color="#fff" />
            </Button>
          </form>
          <p className="auth-switch">
            Don't have an account? <button type="button" onClick={() => navigate("/signup")}>Sign up</button>
          </p>
        </Card>
        <p className="trust-line">Trusted by healthcare professionals worldwide</p>
        <p className="trust-line small">HIPAA Compliant • End-to-End Encrypted • GDPR Ready</p>
      </section>
    </main>
  );
}
