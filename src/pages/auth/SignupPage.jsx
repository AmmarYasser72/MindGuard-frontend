import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import AuthLogo from "../../components/auth/AuthLogo.jsx";
import ErrorBanner from "../../components/auth/ErrorBanner.jsx";
import PasswordField from "../../components/auth/PasswordField.jsx";
import SelectField from "../../components/auth/SelectField.jsx";
import TextField from "../../components/auth/TextField.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "../../hooks/useRouter.js";

const initialForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { register, authLoading } = useAuth();
  const { navigate } = useRouter();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const validation = validatePatient(form);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    try {
      await register({ ...form, role: "patient" });
      navigate("/patient-dashboard");
    } catch (authError) {
      setError(authError.message);
    }
  }

  return (
    <main className="auth-page profile-auth-page">
      <section className="profile-auth-shell">
        <div className="profile-auth-header">
          <button type="button" className="back-chip" onClick={() => navigate("/login")} aria-label="Back to sign in">
            <Icon name="arrow-left" size={18} />
          </button>
          <AuthLogo size={56} icon="user-plus" />
          <div>
            <span className="eyebrow">Patient account</span>
            <h1>Create Account</h1>
            <p>Start your wellness journey with a secure profile.</p>
          </div>
        </div>

        <Card className="profile-form-card">
          <form onSubmit={onSubmit}>
            <div className="form-title-row">
              <div>
                <h2>Personal details</h2>
                <p>Keep these details accurate for better care matching.</p>
              </div>
              <Icon name="user-check" size={22} color="#6366f1" />
            </div>
            <ErrorBanner error={error} />
            <div className="form-grid two">
              <TextField
                label="First Name"
                icon="user"
                name="given-name"
                placeholder="John"
                value={form.firstName}
                onChange={(value) => update("firstName", value)}
                autoComplete="given-name"
                disabled={authLoading}
              />
              <TextField
                label="Last Name"
                icon="user"
                name="family-name"
                placeholder="Doe"
                value={form.lastName}
                onChange={(value) => update("lastName", value)}
                autoComplete="family-name"
                disabled={authLoading}
              />
            </div>
            <TextField
              label="Date of Birth"
              icon="calendar"
              type="date"
              name="bday"
              value={form.dateOfBirth}
              onChange={(value) => update("dateOfBirth", value)}
              autoComplete="bday"
              disabled={authLoading}
            />
            <TextField
              label="Email Address"
              icon="mail"
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={form.email}
              onChange={(value) => update("email", value)}
              autoComplete="email"
              disabled={authLoading}
            />
            <SelectField
              label="Gender"
              icon="user"
              value={form.gender}
              placeholder="Select gender"
              onChange={(value) => update("gender", value)}
              disabled={authLoading}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </SelectField>
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(value) => update("password", value)}
              autoComplete="new-password"
              disabled={authLoading}
            />
            <PasswordField
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={(value) => update("confirmPassword", value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={authLoading}
            />
            <Button type="submit" className="btn-full auth-submit" disabled={authLoading}>
              {authLoading ? (
                <>
                  <Icon name="loader-circle" size={18} color="#fff" className="spin-icon" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <Icon name="arrow-right" size={18} color="#fff" />
                </>
              )}
            </Button>
          </form>
          <p className="auth-switch">
            Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign In</button>
          </p>
        </Card>
        <button type="button" className="role-link-card doctor-link" onClick={() => navigate("/doctor-signup")}>
          <span><Icon name="stethoscope" size={24} color="#059669" /></span>
          <span>
            <strong>Are you a healthcare professional?</strong>
            <small>Sign up as a Doctor</small>
          </span>
        </button>
      </section>
    </main>
  );
}

export function validatePatient(form) {
  if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) return "First and last name are required";
  if (!form.dateOfBirth) return "Please select your date of birth";
  if (!form.email.includes("@")) return "Please enter a valid email";
  if (!form.gender) return "Please select gender";
  if (form.password.length < 6) return "Password must be at least 6 characters";
  if (form.password !== form.confirmPassword) return "Passwords do not match";
  return "";
}
