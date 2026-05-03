import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function SubmitButton({ children, loading, tone = "indigo" }) {
  return (
    <Button type="submit" className={`btn-full btn-${tone}`} disabled={loading}>
      {loading ? (
        <>
          <Icon name="loader-circle" size={18} color="#fff" className="spin-icon" />
          Working...
        </>
      ) : children}
    </Button>
  );
}
