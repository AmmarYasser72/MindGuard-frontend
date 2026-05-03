export default function Card({ children, className = "", as: Tag = "section", ...props }) {
  return (
    <Tag className={`card ${className}`} {...props}>
      {children}
    </Tag>
  );
}
