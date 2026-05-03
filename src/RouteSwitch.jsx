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

export default function RouteSwitch({ path }) {
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
