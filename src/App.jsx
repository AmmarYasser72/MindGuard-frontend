import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./hooks/useAuth.js";
import { RouterContext } from "./hooks/useRouter.js";
import { authService } from "./services/authService.js";
import { ToastProvider } from "./components/common/Toast.jsx";
import SplashPage from "./pages/auth/SplashPage.jsx";
import OnboardingPage from "./pages/auth/OnboardingPage.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import DoctorSignupPage from "./pages/auth/DoctorSignupPage.jsx";
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import PatientChat from "./pages/patient/PatientChat.jsx";
import PatientToolPage from "./pages/patient/PatientToolPage.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import { toolPages } from "./data/patientData.js";

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

function RouteSwitch({ path }) {
  if (path === "/splash") return <SplashPage />;
  if (path === "/intro") return <OnboardingPage />;
  if (path === "/login") return <SignInPage />;
  if (path === "/signup") return <SignupPage />;
  if (path === "/doctor-signup") return <DoctorSignupPage />;
  if (path === "/patient-dashboard") return <PatientDashboard />;
  if (path.startsWith("/patient-chat/")) {
    return <PatientChat userId={decodeURIComponent(path.replace("/patient-chat/", ""))} />;
  }
  if (toolPages[path]) return <PatientToolPage config={toolPages[path]} />;
  if (path === "/doctor-dashboard") return <DoctorDashboard />;
  return (
    <main className="not-found">
      <h1>Page Not Found</h1>
    </main>
  );
}
