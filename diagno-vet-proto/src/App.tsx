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

// --- TIPOS DE DATOS ---
type PatientData = {
  id?: number | null;
  animalName: string;
  tutorName: string;
  species: string;
  gender: string;
  age: string;
  weight: string;
  reason: string;
  studyType: string;
  diagnostico: string;
  images: string[];
};

type ProfileData = {
  email: string;
  phone: string;
  title: string;
  fullName: string;
  license: string;
};

type ClinicData = {
  clinicName: string;
  address: string;
  phone: string;
};

type ReportSummary = {
  id?: number;
  patient?: string;
  tutor?: string;
  study?: string;
  species?: string;
  date?: string;
  status?: string;
  observaciones?: string;
  diagnostico?: string;
  images?: string[];
  gender?: string;
  age?: string;
  weight?: string;
};

// --- ESTADOS INICIALES ---
const INITIAL_PATIENT_DATA: PatientData = {
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

const INITIAL_PROFILE: ProfileData = {
  email: "",
  phone: "",
  title: "",
  fullName: "",
  license: "",
};

const INITIAL_CLINIC: ClinicData = {
  clinicName: "",
  address: "",
  phone: "",
};

export default function App() {
  // --- ESTADOS PRINCIPALES ---
  const [step, setStep] = useState<AppStep>("login");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [clinicData, setClinicData] = useState<ClinicData>(INITIAL_CLINIC);
  const [profileData, setProfileData] = useState<ProfileData>(INITIAL_PROFILE);
  const [patientData, setPatientData] =
    useState<PatientData>(INITIAL_PATIENT_DATA);

  // --- PERSISTENCIA DE SESIÓN ---
  // Corregido para evitar "cascading renders" según el Linter
  useEffect(() => {
    const lastSessionEmail = localStorage.getItem("lastSessionEmail");
    if (!lastSessionEmail) return;

    const savedProfile = localStorage.getItem(
      `userProfile_${lastSessionEmail}`,
    );
    const savedClinic = localStorage.getItem(`clinicData_${lastSessionEmail}`);

    if (savedProfile && savedClinic) {
      const timer = setTimeout(() => {
        setProfileData(JSON.parse(savedProfile) as ProfileData);
        setClinicData(JSON.parse(savedClinic) as ClinicData);
        setStep("dashboard");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- LÓGICA DE LOGIN Y REGISTRO ---
  const handleLoginAction = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const existingProfile = localStorage.getItem(`userProfile_${cleanEmail}`);
    const existingClinic = localStorage.getItem(`clinicData_${cleanEmail}`);

    if (existingProfile && existingClinic) {
      setProfileData(JSON.parse(existingProfile) as ProfileData);
      setClinicData(JSON.parse(existingClinic) as ClinicData);
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
    localStorage.setItem(
      `userProfile_${emailKey}`,
      JSON.stringify(profileData),
    );
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

  const handleEditReport = (study: ReportSummary) => {
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
      images: reportImages,
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
            onChange={(newData) => setClinicData(newData as ClinicData)}
            onContinue={() => setStep("postConfirmation")}
            onBack={() => setStep("login")}
          />
        );

      case "postConfirmation":
        return (
          <PostConfirmationPage
            data={profileData}
            onChange={(newData) => setProfileData(newData as ProfileData)}
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
      <div className="min-h-screen bg-[#FDFDFD]">{renderStep()}</div>
    </LanguageProvider>
  );
}
