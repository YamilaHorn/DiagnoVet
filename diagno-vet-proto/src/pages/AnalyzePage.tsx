import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useLanguage } from "../context/LanguageContext";
import { analyzeTranslations } from "../utils/translations/analyze";

// --- 1. DEFINICIÓN DE TIPOS PARA RECONOCIMIENTO DE VOZ (Anti-Linter) ---
interface SpeechRecognitionResult {
  readonly [index: number]: {
    readonly transcript: string;
  };
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}

// --- 2. OPCIONES DE TRADUCCIÓN ---
const SELECT_OPTIONS: Record<"es" | "en", Record<string, string>> = {
  en: {
    study_default: "Select study",
    gender_default: "Select gender",
    study_1: "Abdominal Ultrasound",
    study_2: "Echocardiography",
    study_3: "Digital Radiography",
    study_4: "Vascular Doppler",
    gender_1: "Male",
    gender_2: "Neutered Male",
    gender_3: "Female",
    gender_4: "Spayed Female",
    specie_1: "Canine",
    specie_2: "Feline",
    specie_3: "Equine",
    specie_4: "Exotic",
    btn_dictate: "DICTATE",
    btn_stop: "STOP",
  },
  es: {
    study_default: "Seleccionar estudio",
    gender_default: "Seleccionar género",
    study_1: "Ecografía Abdominal",
    study_2: "Ecocardiografía",
    study_3: "Radiografía Digital",
    study_4: "Doppler Vascular",
    gender_1: "Macho",
    gender_2: "Macho Castrado",
    gender_3: "Hembra",
    gender_4: "Hembra Castrada",
    specie_1: "Canino",
    specie_2: "Felino",
    specie_3: "Equino",
    specie_4: "Exótico",
    btn_dictate: "🎤 DICTAR",
    btn_stop: "DETENER",
  },
};

export type AnalyzeData = {
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

type AnalyzeProps = {
  data: AnalyzeData;
  onChange: (d: AnalyzeData) => void;
  images: string[];
  onUpdateImages: (imgs: string[]) => void;
  onFinish: () => void;
  onBack: () => void;
  userProfile: { fullName?: string; email?: string; title?: string };
  clinicData: { clinicName?: string };
};

export function AnalyzePage({
  data,
  onChange,
  images,
  onUpdateImages,
  onFinish,
  onBack,
  userProfile,
  clinicData,
}: AnalyzeProps) {
  const { lang } = useLanguage();
  const t = analyzeTranslations[lang];
  const s = SELECT_OPTIONS[lang];

  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateField = (field: keyof AnalyzeData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid =
    data.animalName?.trim() &&
    data.studyType?.trim() &&
    data.gender?.trim() &&
    data.tutorName?.trim() &&
    images.length > 0;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
  ) => {
    let filesArray: File[] = [];

    if ("dataTransfer" in e) {
      e.preventDefault();
      setIsDragging(false);
      filesArray = Array.from(e.dataTransfer.files);
    } else if (
      "target" in e &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      filesArray = Array.from(e.target.files);
    }

    if (filesArray.length > 0) {
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      onUpdateImages([...images, ...newImages]);
    }
  };

  const toggleSpeech = () => {
    const SpeechComp =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechComp)
      return alert(
        lang === "es" ? "Navegador no compatible." : "Browser not supported.",
      );

    const recognition = new SpeechComp();
    recognition.lang = lang === "es" ? "es-ES" : "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript || "";
      updateField("reason", (data.reason || "") + " " + transcript);
    };

    recognition.start();
  };

  const inputFocusClass =
    "focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5";
  const inputBaseClass =
    "w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none transition-all shadow-sm";

  return (
    <div className="h-screen bg-[#FDFDFD] flex flex-col overflow-hidden font-sans">
      <AppHeader
        title={t.header_title}
        onBack={onBack}
        showLanguageSelector={false}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* COLUMNA FORMULARIO */}
        <div className="w-full lg:w-[55%] p-4 md:p-8 overflow-y-auto lg:border-r border-slate-100 text-slate-700">
          <section className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                🐾 {t.main_title}
              </h2>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.date_label}
                </p>
                <p className="font-bold text-slate-600">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_animal_name} *
                </label>
                <input
                  type="text"
                  value={data.animalName || ""}
                  onChange={(e) => updateField("animalName", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass}`}
                  placeholder={t.placeholder_animal}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_tutor_name} *
                </label>
                <input
                  type="text"
                  value={data.tutorName || ""}
                  onChange={(e) => updateField("tutorName", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass}`}
                  placeholder={t.placeholder_tutor}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_study_type} *
                </label>
                <select
                  value={data.studyType || ""}
                  onChange={(e) => updateField("studyType", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}
                >
                  <option value="">{s.study_default}</option>
                  <option value="Ecografía">{s.study_1}</option>
                  <option value="Ecocardiografía">{s.study_2}</option>
                  <option value="Radiografía">{s.study_3}</option>
                  <option value="Doppler">{s.study_4}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_gender} *
                </label>
                <select
                  value={data.gender || ""}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}
                >
                  <option value="">{s.gender_default}</option>
                  <option value="Macho">{s.gender_1}</option>
                  <option value="Macho Castrado">{s.gender_2}</option>
                  <option value="Hembra">{s.gender_3}</option>
                  <option value="Hembra Castrada">{s.gender_4}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_species}
                </label>
                <select
                  value={data.species || "Canino"}
                  onChange={(e) => updateField("species", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}
                >
                  <option value="Canino">{s.specie_1}</option>
                  <option value="Felino">{s.specie_2}</option>
                  <option value="Equino">{s.specie_3}</option>
                  <option value="Exótico">{s.specie_4}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_age}
                </label>
                <input
                  type="text"
                  value={data.age || ""}
                  onChange={(e) => updateField("age", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass}`}
                  placeholder={t.placeholder_age}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  {t.label_weight}
                </label>
                <input
                  type="text"
                  value={data.weight || ""}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className={`${inputBaseClass} ${inputFocusClass}`}
                  placeholder={t.placeholder_weight}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.label_observations}
                </label>
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}
                >
                  {isListening ? s.btn_stop : s.btn_dictate}
                </button>
              </div>
              <textarea
                value={data.reason || ""}
                onChange={(e) => updateField("reason", e.target.value)}
                rows={4}
                className={`${inputBaseClass} ${inputFocusClass} resize-none !rounded-[2rem]`}
                placeholder={t.placeholder_observations}
              />
            </div>

            <div className="hidden sm:flex p-6 md:p-8 bg-slate-900 rounded-[2rem] text-white items-center shadow-xl border border-white/5">
              <div className="flex-1">
                <p className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] mb-1">
                  {t.doctor_responsible}
                </p>
                <h3 className="text-xl font-bold uppercase tracking-tight leading-none">
                  {userProfile.fullName || "---"}
                </h3>
                <p className="text-[11px] opacity-50 font-medium mt-1">
                  {userProfile.title || "Vet"}
                </p>
              </div>
              <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8"></div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] mb-1">
                  {t.clinic_center}
                </p>
                <h3 className="text-lg font-bold uppercase tracking-tight leading-none">
                  {clinicData.clinicName || "---"}
                </h3>
                <p className="text-[11px] opacity-50 font-medium mt-1">
                  {t.hq_label}
                </p>
              </div>
            </div>

            <button
              onClick={onFinish}
              disabled={!isValid}
              className="w-full bg-[#2FB8B3] text-white h-16 rounded-2xl font-black text-xl hover:bg-[#25918d] transition-all shadow-xl shadow-[#2FB8B3]/20 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none flex items-center justify-center gap-4"
            >
              {t.btn_continue} <span className="text-2xl">→</span>
            </button>
          </section>
        </div>

        {/* COLUMNA IMÁGENES */}
        <div className="w-full lg:w-[45%] bg-[#F8FAFC] p-4 md:p-8 flex flex-col overflow-y-auto order-first lg:order-last min-h-[400px]">
          <div className="mb-6 px-2">
            <h3 className="font-black text-slate-800 text-2xl tracking-tight">
              {t.images_title} ({images.length})
            </h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              {t.images_min_req}
            </p>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleImageUpload}
            className={`
              flex-none mb-6 rounded-[2.5rem] p-8 transition-all border-2 border-dashed relative min-h-[280px] flex flex-col items-center justify-center
              ${isDragging ? "bg-[#2FB8B3]/5 border-[#2FB8B3] scale-[0.98]" : "bg-white border-slate-200 shadow-sm"}
            `}
          >
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              onChange={handleImageUpload}
            />
            <div className="flex flex-col items-center text-center pointer-events-none">
              <div className="w-16 h-16 bg-[#FDFDFD] rounded-2xl shadow-md flex items-center justify-center text-[#2FB8B3] mb-4 border border-slate-50 transition-transform">
                <span className="text-3xl font-light">+</span>
              </div>
              <p className="text-sm font-black text-slate-700 uppercase tracking-widest">
                {t.btn_upload}
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                Click o arrastra tus archivos aquí
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-10">
            {images.map((src: string, i: number) => (
              <div
                key={i}
                className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300 group"
              >
                <img
                  src={src}
                  className="w-full h-full object-cover"
                  alt="clinical evidence"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-lg z-30 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs font-black">✕</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
