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
        <div className="profile-auth-header doctor-header">
          <button type="button" className="back-chip" onClick={() => navigate("/signup")} aria-label="Back to patient signup">
            <Icon name="arrow-left" size={18} />
          </button>
          <AuthLogo tone="green" size={56} icon="stethoscope" />
          <div>
            <span className="eyebrow">Doctor account</span>
            <h1>Doctor Registration</h1>
            <p>Join MindGuard as a healthcare professional.</p>
            <span className="doctor-badge">
              <Icon name="badge-check" size={16} color="#059669" />
              Healthcare Professional Account
            </span>
          </div>
        </div>

        <Card className="profile-form-card">
          <form onSubmit={onSubmit}>
            <div className="form-title-row">
              <div>
                <h2>Professional details</h2>
                <p>Your profile helps patients find the right support.</p>
              </div>
              <Icon name="badge-check" size={22} color="#059669" />
            </div>
            <ErrorBanner error={error} />
            <div className="form-grid two">
              <TextField
                label="First Name"
                icon="user"
                placeholder="ammar"
                value={form.firstName}
                onChange={(value) => update("firstName", value)}
                autoComplete="given-name"
                disabled={authLoading}
              />
              <TextField
                label="Last Name"
                icon="user"
                placeholder="yasser"
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
              value={form.dateOfBirth}
              onChange={(value) => update("dateOfBirth", value)}
              autoComplete="bday"
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
            <SelectField
              label="Specialization"
              icon="brain"
              value={form.specialization}
              placeholder="Select your specialization"
              onChange={(value) => update("specialization", value)}
              disabled={authLoading}
            >
              {specializations.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectField>
            <TextField
              label="License Number"
              icon="badge"
              placeholder="Enter your license number"
              value={form.licenseNumber}
              onChange={(value) => update("licenseNumber", value)}
              autoComplete="off"
              disabled={authLoading}
            />
            <TextField
              label="Years of Experience"
              icon="briefcase-business"
              type="number"
              placeholder="e.g 5"
              value={form.yearsOfExperience}
              onChange={(value) => update("yearsOfExperience", value)}
              min="0"
              disabled={authLoading}
            />
            <TextField
              label="Professional Email"
              icon="mail"
              type="email"
              placeholder="Dr.ammar@gmail.com"
              value={form.email}
              onChange={(value) => update("email", value)}
              autoComplete="email"
              disabled={authLoading}
            />
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
            <Button type="submit" className="btn-full btn-green auth-submit" disabled={authLoading}>
              {authLoading ? (
                <>
                  <Icon name="loader-circle" size={18} color="#fff" className="spin-icon" />
                  Creating...
                </>
              ) : (
                <>
                  Create Doctor Account
                  <Icon name="arrow-right" size={18} color="#fff" />
                </>
              )}
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
            <small>Sign up as a Patient</small>
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
