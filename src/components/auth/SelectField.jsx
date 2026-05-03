import Field from "../common/Field.jsx";

export default function SelectField({ label, icon, value, onChange, placeholder, children, error, ...props }) {
  return (
    <Field label={label} icon={icon} error={error}>
      <select value={value} onChange={(event) => onChange(event.target.value)} {...props}>
        <option value="">{placeholder}</option>
        {children}
      </select>
    </Field>
  );
}
