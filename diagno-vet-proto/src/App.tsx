import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { LoginPage } from "./pages/LoginPage";
import { PreConfirmationPage } from "./pages/PreConfirmationPage";
import { PostConfirmationPage } from "./pages/PostConfirmationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { AnalysisCasePage } from "./pages/AnalysisCasePage";

// --- TIPOS DE NAVEGACIÓN ---
type AppStep =
  | "login"
  | "preConfirmation"
  | "postConfirmation"
  | "dashboard"
  | "analyze"
  | "analysisCase";

// --- ESTADOS INICIALES ---
const INITIAL_PATIENT_DATA = {
  id: null, 
  animalName: "",
  tutorName: "",
  species: "Canino",
  gender: "",
  age: "",
  weight: "",
  reason: "",
  studyType: "",
  diagnostico: "",
  images: [],
};

const INITIAL_PROFILE = {
  email: "",
  phone: "",
  title: "",
  fullName: "",
  license: "",
};

const INITIAL_CLINIC = {
  clinicName: "",
  address: "",
  phone: "",
};

export default function App() {
  // --- ESTADOS PRINCIPALES ---
  const [step, setStep] = useState<AppStep>("login");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [clinicData, setClinicData] = useState(INITIAL_CLINIC);
  const [profileData, setProfileData] = useState(INITIAL_PROFILE);
  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);

  // --- PERSISTENCIA DE SESIÓN ---
  useEffect(() => {
    const lastSessionEmail = localStorage.getItem("lastSessionEmail");
    if (lastSessionEmail) {
      const savedProfile = localStorage.getItem(`userProfile_${lastSessionEmail}`);
      const savedClinic = localStorage.getItem(`clinicData_${lastSessionEmail}`);

      if (savedProfile && savedClinic) {
        setProfileData(JSON.parse(savedProfile));
        setClinicData(JSON.parse(savedClinic));
        setStep("dashboard");
      }
    }
  }, []);

  // --- LÓGICA DE LOGIN Y REGISTRO ---
  const handleLoginAction = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const existingProfile = localStorage.getItem(`userProfile_${cleanEmail}`);
    const existingClinic = localStorage.getItem(`clinicData_${cleanEmail}`);

    if (existingProfile && existingClinic) {
      setProfileData(JSON.parse(existingProfile));
      setClinicData(JSON.parse(existingClinic));
      localStorage.setItem("lastSessionEmail", cleanEmail);
      setStep("dashboard");
    } else {
      setProfileData({ ...INITIAL_PROFILE, email: cleanEmail });
      setClinicData(INITIAL_CLINIC);
      setStep("preConfirmation");
    }
  };

  const handleCompleteRegistration = () => {
    const emailKey = profileData.email;
    localStorage.setItem(`userProfile_${emailKey}`, JSON.stringify(profileData));
    localStorage.setItem(`clinicData_${emailKey}`, JSON.stringify(clinicData));
    localStorage.setItem("lastSessionEmail", emailKey);
    setStep("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("lastSessionEmail");
    setProfileData(INITIAL_PROFILE);
    setClinicData(INITIAL_CLINIC);
    setStep("login");
  };

  // --- LÓGICA DE REPORTES ---
  const handleBackToDashboard = () => {
    setPatientData(INITIAL_PATIENT_DATA);
    setUploadedImages([]);
    setStep("dashboard");
  };

  const handleEditReport = (study: any) => {
    const reportImages = study.images || [];
    setUploadedImages(reportImages);

    setPatientData({
      id: study.id, 
      animalName: study.patient || "",
      tutorName: study.tutor || "",
      species: study.species || "Canino",
      gender: study.gender || "",
      age: study.age || "",
      weight: study.weight || "",
      studyType: study.study || "",
      reason: study.observaciones || "",
      diagnostico: study.diagnostico || "",
      images: reportImages
    });

    setStep("analysisCase"); 
  };

  // --- RENDERIZADO DE PASOS ---
  const renderStep = () => {
    switch (step) {
      case "login":
        return (
          <LoginPage
            onExistingUser={handleLoginAction}
            onNewUser={handleLoginAction}
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
            onContinue={handleCompleteRegistration}
            onBack={() => setStep("preConfirmation")}
          />
        );

      case "dashboard":
        return (
          <DashboardPage
            userProfile={profileData} 
            onLogout={handleLogout}    
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
            userProfile={profileData}
            clinicData={clinicData}
          />
        );

      case "analysisCase":
        return (
          <AnalysisCasePage
            images={uploadedImages}
            patientData={patientData}
            doctorName={profileData.fullName}
            doctorEmail={profileData.email}
            clinicName={clinicData.clinicName} 
            onBack={() => setStep("analyze")}
            onFinish={handleBackToDashboard}
          />
        );

      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FDFDFD]">
        {renderStep()}
      </div>
    </LanguageProvider>
  );
}