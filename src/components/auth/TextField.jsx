import Field from "../common/Field.jsx";

export default function TextField({ label, icon, value, onChange, placeholder, type = "text", error, ...props }) {
  return (
    <Field label={label} icon={icon} error={error}>
      <input
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </Field>
  );
}
