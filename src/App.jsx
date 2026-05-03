import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./hooks/useAuth.js";
import { RouterContext } from "./hooks/useRouter.js";
import { authService } from "./services/authService.js";
import { ToastProvider } from "./components/common/Toast.jsx";
import RouteSwitch from "./RouteSwitch.jsx";

function readPath() {
  return window.location.pathname || "/splash";
}

export default function App() {
  const [path, setPath] = useState(readPath);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener("popstate", onPop);
    if (readPath() === "/") {
      window.history.replaceState({}, "", "/splash");
      setPath("/splash");
    }
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((nextPath) => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const auth = useMemo(() => ({
    user,
    authLoading,
    async signIn(email, password) {
      setAuthLoading(true);
      try {
        const nextUser = await authService.signIn(email, password);
        setUser(nextUser);
        return nextUser;
      } finally {
        setAuthLoading(false);
      }
    },
    async register(profile) {
      setAuthLoading(true);
      try {
        const nextUser = await authService.register(profile);
        setUser(nextUser);
        return nextUser;
      } finally {
        setAuthLoading(false);
      }
    },
    signOut() {
      authService.signOut();
      setUser(null);
    },
  }), [authLoading, user]);

  const router = useMemo(() => ({ path, navigate }), [navigate, path]);

  return (
    <RouterContext.Provider value={router}>
      <AuthContext.Provider value={auth}>
        <ToastProvider>
          <RouteSwitch path={path} />
        </ToastProvider>
      </AuthContext.Provider>
    </RouterContext.Provider>
  );
}
