import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { PreConfirmationPage } from "./pages/PreConfirmationPage";
import { PostConfirmationPage } from "./pages/PostConfirmationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { AnalysisCasePage } from "./pages/AnalysisCasePage";

type AppStep =
  | "login"
  | "preConfirmation"
  | "postConfirmation"
  | "dashboard"
  | "analyze"
  | "analysisCase";

export default function App() {
  const [step, setStep] = useState<AppStep>("login");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Datos de la Clínica (Step 1 del Setup)
  const [clinicData, setClinicData] = useState({
    clinicName: "",
    address: "",
    phone: "",
  });

  // Datos del Veterinario (Step 2 del Setup)
  const [profileData, setProfileData] = useState({
    phone: "",
    title: "",
    fullName: "",
    license: "",
  });

  // --- LÓGICA DE RENDERIZADO (Router Mock) ---
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
          onCreateReport={() => {
            setUploadedImages([]); // Limpiamos imágenes para un nuevo caso
            setStep("analyze");
          }}
        />
      );

    case "analyze":
      return (
        <AnalyzePage
          // Aquí capturamos el array de strings (URLs/Blobs) de las fotos subidas
          onFinish={(images: string[]) => {
            setUploadedImages(images);
            setStep("analysisCase");
          }}
          onBack={() => setStep("dashboard")}
        />
      );

    case "analysisCase":
      return (
        <AnalysisCasePage 
          images={uploadedImages} // Pasamos las fotos reales al reporte final
          onBack={() => setStep("dashboard")} 
        />
      );

    default:
      return (
        <div className="h-screen flex items-center justify-center">
          <p className="text-slate-400">Página no encontrada</p>
        </div>
      );
  }
}
