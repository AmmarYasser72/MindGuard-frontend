import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function SubmitButton({ children, loading, tone = "indigo" }) {
  return (
    <Button type="submit" variant={tone} className="w-full" disabled={loading}>
      {loading ? (
        <>
          <Icon name="loader-circle" size={18} color="#fff" className="animate-spin" />
          Working...
        </>
      ) : children}
    </Button>
  );
}
