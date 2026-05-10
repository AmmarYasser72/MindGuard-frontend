import { cn } from "../../utils/cn.js";

export default function Card({ children, className = "", as: Tag = "section", ...props }) {
  return (
    <Tag
      className={cn(
        "w-full rounded-[1.5rem] border border-slate-200/90 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.06)] sm:p-5",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
