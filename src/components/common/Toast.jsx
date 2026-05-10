import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "../../utils/cn.js";

const ToastContext = createContext(null);
const toneClasses = {
  error: "bg-red-600",
  info: "bg-slate-900",
  success: "bg-emerald-500",
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, tone = "info") => {
    setToast({ message, tone });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className={cn(
            "fixed bottom-5 right-5 z-80 max-w-[min(26rem,calc(100vw-2.5rem))] rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.2)]",
            toneClasses[toast.tone] || toneClasses.info,
          )}
        >
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
