import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { Button, Card } from "../../components/common/Primitives.jsx";
import { AuthLogo, ErrorBanner, PasswordField, SelectField, TextField } from "../../components/auth/AuthForm.jsx";
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
        <button type="button" className="back-chip" onClick={() => navigate("/login")}>
          <Icon name="arrow-left" size={18} />
        </button>
        <AuthLogo size={56} icon="user-plus" />
        <h1>Create Account</h1>
        <p>Join MindGuard and start your wellness journey</p>
        <Card className="profile-form-card">
          <form onSubmit={onSubmit}>
            <ErrorBanner error={error} />
            <div className="form-grid two">
              <TextField label="First Name" icon="user" placeholder="John" value={form.firstName} onChange={(value) => update("firstName", value)} />
              <TextField label="Last Name" icon="user" placeholder="Doe" value={form.lastName} onChange={(value) => update("lastName", value)} />
            </div>
            <TextField label="Date of Birth" icon="calendar" type="date" value={form.dateOfBirth} onChange={(value) => update("dateOfBirth", value)} />
            <TextField label="Email Address" icon="mail" type="email" placeholder="john.doe@example.com" value={form.email} onChange={(value) => update("email", value)} />
            <SelectField label="Gender" icon="user" value={form.gender} placeholder="Select Gender" onChange={(value) => update("gender", value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </SelectField>
            <PasswordField label="Password" value={form.password} onChange={(value) => update("password", value)} />
            <PasswordField label="Confirm Password" value={form.confirmPassword} onChange={(value) => update("confirmPassword", value)} />
            <Button type="submit" className="btn-full" disabled={authLoading}>
              {authLoading ? "Creating..." : "Create Account"}
              <Icon name="arrow-right" size={18} color="#fff" />
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
            <small>Sign up as a Doctor →</small>
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
