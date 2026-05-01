import { useState } from "react";
import Icon from "../common/Icon.jsx";
import { Button, Field } from "../common/Primitives.jsx";

export function AuthLogo({ tone = "indigo", icon = "shield", size = 80 }) {
  return (
    <div className={`auth-logo auth-logo-${tone}`} style={{ width: size, height: size, borderRadius: size * 0.25 }}>
      <Icon name={icon} size={size * 0.5} color="#ffffff" />
    </div>
  );
}

export function PasswordField({ label, value, onChange, placeholder = "••••••••", error }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} icon="lock" error={error}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" className="field-icon-button" onClick={() => setVisible((state) => !state)} aria-label="Toggle password visibility">
        <Icon name={visible ? "eye-off" : "eye"} size={20} color="#9ca3af" />
      </button>
    </Field>
  );
}

export function TextField({ label, icon, value, onChange, placeholder, type = "text", error, ...props }) {
  return (
    <Field label={label} icon={icon} error={error}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </Field>
  );
}

export function SelectField({ label, icon, value, onChange, placeholder, children, error }) {
  return (
    <Field label={label} icon={icon} error={error}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {children}
      </select>
    </Field>
  );
}

export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="error-banner">
      <Icon name="circle-alert" size={20} color="#dc2626" />
      <span>{error}</span>
    </div>
  );
}

export function SubmitButton({ children, loading, tone = "indigo" }) {
  return (
    <Button type="submit" className={`btn-full btn-${tone}`} disabled={loading}>
      {loading ? "Loading..." : children}
    </Button>
  );
}
