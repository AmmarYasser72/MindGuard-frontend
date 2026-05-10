import Field from "../common/Field.jsx";

export default function SelectField({ label, icon, value, onChange, placeholder, children, error, ...props }) {
  return (
    <Field label={label} icon={icon} error={error}>
      <select
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </Field>
  );
}
