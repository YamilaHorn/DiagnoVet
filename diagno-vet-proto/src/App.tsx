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

const INITIAL_PATIENT_DATA = {
  id: null, // Importante para diferenciar nuevo de editado
  animalName: "",
  tutorName: "",
  species: "Canino",
  gender: "",
  age: "",
  weight: "",
  reason: "",
  studyType: "",
  diagnostico: "", // Añadido para persistir el texto de la IA
};

export default function App() {
  const [step, setStep] = useState<AppStep>("login");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);

  const handleBackToDashboard = () => {
    setPatientData(INITIAL_PATIENT_DATA);
    setUploadedImages([]);
    setStep("dashboard");
  };

  // --- FUNCIÓN DE EDICIÓN CORREGIDA ---
  const handleEditReport = (study: any) => {
    // Sincronizamos los nombres de las propiedades del Dashboard con el estado del Editor
    setPatientData({
      id: study.id, // PASAMOS EL ID ORIGINAL
      animalName: study.patient || "",
      tutorName: study.tutor || "",
      species: study.species || "Canino",
      gender: study.gender || "",
      age: study.age || "",
      weight: study.weight || "",
      studyType: study.study || "",
      reason: study.observaciones || "",
      diagnostico: study.diagnostico || "", // PASAMOS EL TEXTO YA ESCRITO
    });

    setUploadedImages(study.images || []);
    setStep("analysisCase"); // Saltamos directo al editor final
  };

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
            setPatientData(INITIAL_PATIENT_DATA);
            setUploadedImages([]);
            setStep("analyze");
          }}
          onEditReport={handleEditReport}
        />
      );

    case "analyze":
      return (
        <AnalyzePage
          data={patientData}
          onChange={setPatientData}
          images={uploadedImages}
          onUpdateImages={setUploadedImages}
          onFinish={() => setStep("analysisCase")}
          onBack={handleBackToDashboard}
        />
      );

    case "analysisCase":
      return (
        <AnalysisCasePage
          images={uploadedImages}
          patientData={patientData}
          doctorName={profileData.fullName}
          onBack={() => setStep("analyze")}
          onFinish={handleBackToDashboard}
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