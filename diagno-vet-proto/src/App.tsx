import { useState, useEffect } from "react";
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
  const [step, setStep] = useState<AppStep>("login");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // --- ESTADOS DE USUARIO ---
  const [clinicData, setClinicData] = useState(INITIAL_CLINIC);
  const [profileData, setProfileData] = useState(INITIAL_PROFILE);
  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);

  // --- PERSISTENCIA DE SESIÓN ---
  useEffect(() => {
    // Al cargar la app, vemos si hay una sesión activa de la última vez
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

  // --- LÓGICA DE LOGIN (CORREGIDA) ---
  const handleLoginAction = (email: string, isNew: boolean) => {
    const cleanEmail = email.toLowerCase().trim();
    
    // Intentamos recuperar datos específicos de ESTE email
    const existingProfile = localStorage.getItem(`userProfile_${cleanEmail}`);
    const existingClinic = localStorage.getItem(`clinicData_${cleanEmail}`);

    if (existingProfile && existingClinic) {
      // Si el usuario ya existía en este navegador, cargamos sus datos
      setProfileData(JSON.parse(existingProfile));
      setClinicData(JSON.parse(existingClinic));
      localStorage.setItem("lastSessionEmail", cleanEmail);
      setStep("dashboard");
    } else {
      // SI ES NUEVO O NO TIENE DATOS: Limpiamos los estados por completo
      setProfileData({ ...INITIAL_PROFILE, email: cleanEmail });
      setClinicData(INITIAL_CLINIC);
      setStep("preConfirmation");
    }
  };

  const handleCompleteRegistration = () => {
    const emailKey = profileData.email;
    // Guardamos con llaves únicas por email para que no se mezclen
    localStorage.setItem(`userProfile_${emailKey}`, JSON.stringify(profileData));
    localStorage.setItem(`clinicData_${emailKey}`, JSON.stringify(clinicData));
    localStorage.setItem("lastSessionEmail", emailKey);
    setStep("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("lastSessionEmail"); // Solo cerramos sesión, no borramos los datos del disco
    setProfileData(INITIAL_PROFILE);
    setClinicData(INITIAL_CLINIC);
    setStep("login");
  };

  const handleBackToDashboard = () => {
    setPatientData(INITIAL_PATIENT_DATA);
    setUploadedImages([]);
    setStep("dashboard");
  };

  const handleEditReport = (study: any) => {
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
    });
    setUploadedImages(study.images || []);
    setStep("analysisCase"); 
  };

  // --- RENDERIZADO ---
  switch (step) {
    case "login":
      return (
        <LoginPage
          onExistingUser={(email) => handleLoginAction(email, false)}
          onNewUser={(email) => handleLoginAction(email, true)}
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
}