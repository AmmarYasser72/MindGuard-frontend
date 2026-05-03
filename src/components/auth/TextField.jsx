import Field from "../common/Field.jsx";

export default function TextField({ label, icon, value, onChange, placeholder, type = "text", error, ...props }) {
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
