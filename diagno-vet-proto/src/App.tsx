import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { PreConfirmationPage } from "./pages/PreConfirmationPage";
import { PostConfirmationPage } from "./pages/PostConfirmationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";

type AppStep =
  | "login"
  | "preConfirmation"
  | "postConfirmation"
  | "dashboard"
  | "analyze";

export default function App() {
  const [step, setStep] = useState<AppStep>("login");

  const [clinicData, setClinicData] = useState({
    clinicName: "",
    address: "",
    phone: "",
  });

  const [profileData, setProfileData] = useState({
  phone: "",
  title: "",
  fullName: "",
  license: "",
});

  switch (step) {
    case "login":
      return (
        <LoginPage
          onExistingUser={() => setStep("dashboard")}
          onNewUser={() => setStep("preConfirmation")}
        />
      );

    case "preConfirmation":
      return (
        <PreConfirmationPage
          data={clinicData}
          onChange={setClinicData}
          onContinue={() => setStep("postConfirmation")}
          onBack={() => setStep("login")}
        />
      );

    case "postConfirmation":
      return (
        <PostConfirmationPage
      data={profileData}
      onChange={setProfileData}
      onContinue={() => setStep("dashboard")}
      onBack={() => setStep("preConfirmation")}
    />
      );

    case "dashboard":
      return (
        <DashboardPage
          onCreateReport={() => setStep("analyze")}
        />
      );

    case "analyze":
      return (
        <AnalyzePage
          onFinish={() => setStep("dashboard")}
          onBack={() => setStep("dashboard")}
        />
      );

    default:
      return null;
  }
}
