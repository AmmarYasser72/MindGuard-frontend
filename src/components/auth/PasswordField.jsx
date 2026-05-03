import { useState } from "react";
import Icon from "../common/Icon.jsx";
import Field from "../common/Field.jsx";

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  autoComplete,
  disabled,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} icon="lock" error={error}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className="field-icon-button"
        onClick={() => setVisible((state) => !state)}
        aria-label="Toggle password visibility"
        disabled={disabled}
      >
        <Icon name={visible ? "eye-off" : "eye"} size={20} color="#9ca3af" />
      </button>
    </Field>
  );
}
