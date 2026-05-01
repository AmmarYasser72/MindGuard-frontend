import { useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { Button, Card } from "../../components/common/Primitives.jsx";
import { AuthLogo, ErrorBanner, PasswordField, SelectField, TextField } from "../../components/auth/AuthForm.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useRouter } from "../../hooks/useRouter.js";
import { validatePatient } from "./SignupPage.jsx";

const specializations = [
  "Psychiatry",
  "Clinical Psychology",
  "Counseling Psychology",
  "Neuropsychology",
  "Child & Adolescent Psychology",
  "Health Psychology",
  "Behavioral Medicine",
  "Addiction Medicine",
  "Sleep Medicine",
  "Geriatric Psychiatry",
  "Forensic Psychology",
  "Sports Psychology",
  "Occupational Therapy",
  "Social Work",
  "Marriage & Family Therapy",
  "General Practice",
  "Internal Medicine",
  "Neurology",
  "Other",
];

const initialForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  specialization: "",
  licenseNumber: "",
  yearsOfExperience: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function DoctorSignupPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { register, authLoading } = useAuth();
  const { navigate } = useRouter();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const validation = validateDoctor(form);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    try {
      await register({ ...form, role: "doctor" });
      navigate("/doctor-dashboard");
    } catch (authError) {
      setError(authError.message);
    }
  }

  return (
    <main className="auth-page profile-auth-page">
      <section className="profile-auth-shell">
        <button type="button" className="back-chip" onClick={() => navigate("/signup")}>
          <Icon name="arrow-left" size={18} />
        </button>
        <AuthLogo tone="green" size={56} icon="stethoscope" />
        <h1>Doctor Registration</h1>
        <p>Join MindGuard as a healthcare professional</p>
        <span className="doctor-badge">
          <Icon name="badge-check" size={16} color="#059669" />
          Healthcare Professional Account
        </span>
        <Card className="profile-form-card">
          <form onSubmit={onSubmit}>
            <ErrorBanner error={error} />
            <div className="form-grid two">
              <TextField label="First Name" icon="user" placeholder="Sarah" value={form.firstName} onChange={(value) => update("firstName", value)} />
              <TextField label="Last Name" icon="user" placeholder="Johnson" value={form.lastName} onChange={(value) => update("lastName", value)} />
            </div>
            <TextField label="Date of Birth" icon="calendar" type="date" value={form.dateOfBirth} onChange={(value) => update("dateOfBirth", value)} />
            <SelectField label="Gender" icon="user" value={form.gender} placeholder="Select gender" onChange={(value) => update("gender", value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </SelectField>
            <SelectField label="Specialization" icon="brain" value={form.specialization} placeholder="Select your specialization" onChange={(value) => update("specialization", value)}>
              {specializations.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectField>
            <TextField label="License Number" icon="badge" placeholder="Enter your license number" value={form.licenseNumber} onChange={(value) => update("licenseNumber", value)} />
            <TextField label="Years of Experience" icon="briefcase-business" type="number" placeholder="e.g. 5" value={form.yearsOfExperience} onChange={(value) => update("yearsOfExperience", value)} />
            <TextField label="Professional Email" icon="mail" type="email" placeholder="dr.johnson@clinic.com" value={form.email} onChange={(value) => update("email", value)} />
            <PasswordField label="Password" value={form.password} onChange={(value) => update("password", value)} />
            <PasswordField label="Confirm Password" value={form.confirmPassword} onChange={(value) => update("confirmPassword", value)} />
            <Button type="submit" className="btn-full btn-green" disabled={authLoading}>
              {authLoading ? "Creating..." : "Create Doctor Account"}
              <Icon name="arrow-right" size={18} color="#fff" />
            </Button>
          </form>
          <p className="auth-switch green">
            Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign In</button>
          </p>
        </Card>
        <button type="button" className="role-link-card patient-link" onClick={() => navigate("/signup")}>
          <span><Icon name="user" size={24} color="#6366f1" /></span>
          <span>
            <strong>Not a healthcare professional?</strong>
            <small>Sign up as a Patient →</small>
          </span>
        </button>
      </section>
    </main>
  );
}

function validateDoctor(form) {
  const base = validatePatient(form);
  if (base) return base;
  if (!form.specialization) return "Please select your specialization";
  if (!form.licenseNumber.trim()) return "License number is required";
  if (!form.yearsOfExperience || Number.isNaN(Number(form.yearsOfExperience))) return "Enter a valid number";
  return "";
}
