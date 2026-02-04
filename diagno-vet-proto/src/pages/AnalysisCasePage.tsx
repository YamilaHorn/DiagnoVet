import { useState, useEffect, useRef } from "react";
import { AppHeader } from "../components/AppHeader";

type Props = {
  images: string[];
  patientData: any;
  doctorName: string;
  doctorEmail: string;
  clinicName: string;
  onBack: () => void;
  onFinish: () => void;
  userProfile?: any;
  onLogout?: () => void;
};

export function AnalysisCasePage({ 
  images, 
  patientData, 
  doctorName, 
  doctorEmail, 
  clinicName, 
  onBack, 
  onFinish,
  userProfile,
  onLogout
}: Props) {
  const [isListening, setIsListening] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false); 
  const [showVisualFeedback, setShowVisualFeedback] = useState(false); 
  const [showExitAlert, setShowExitAlert] = useState(false); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  
  const aiGeneratedText = `Se observa en el paciente ${patientData.animalName || "N/A"} una pared vesical de 4.2mm con pérdida de la diferenciación de capas. Los hallazgos ecográficos son compatibles con un cuadro de cistitis crónica activa.`;

  const [report, setReport] = useState({
    id: patientData.id || null, 
    patient: patientData.animalName || "", 
    tutor: patientData.tutorName || "",
    species: patientData.species || "Canino",
    gender: patientData.gender || "",
    age: patientData.age || "",
    weight: patientData.weight || "",
    study: patientData.studyType || "Ecografía Abdominal",
    diagnostico: patientData.diagnostico || "", 
    observaciones: patientData.reason || ""
  });

  useEffect(() => {
    if (!report.diagnostico) {
      const timer = setTimeout(() => {
        setReport(prev => ({ ...prev, diagnostico: aiGeneratedText }));
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    const existingReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const currentId = report.id || Date.now();
    const finalReport = {
      ...report,
      id: currentId,
      creatorEmail: doctorEmail,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Finalizado",
      images: images 
    };
    let updatedReports;
    const exists = existingReports.some((r: any) => r.id === currentId);
    if (exists) {
      updatedReports = existingReports.map((r: any) => r.id === currentId ? finalReport : r);
    } else {
      updatedReports = [finalReport, ...existingReports];
      setReport(prev => ({ ...prev, id: currentId }));
    }
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setIsSaved(true);
    setShowVisualFeedback(true);
    setTimeout(() => setShowVisualFeedback(false), 2000);
  };

  const handleFieldChange = (field: string, value: string) => {
    setReport(prev => ({ ...prev, [field]: value }));
    setIsSaved(false); 
  };

  const toggleSpeech = (field: "diagnostico" | "observaciones") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening === field) { recognitionRef.current?.stop(); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.onstart = () => setIsListening(field);
    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) text += event.results[i][0].transcript + " ";
      }
      setReport((prev: any) => ({ ...prev, [field]: prev[field] + text }));
      setIsSaved(false);
    };
    recognition.onend = () => setIsListening(null);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans relative text-slate-900">
      
      {showExitAlert && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Cambios sin guardar</h3>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={onFinish} className="w-full bg-slate-100 text-slate-600 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-50 hover:text-red-500">Continuar sin guardar</button>
              <button onClick={() => setShowExitAlert(false)} className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Seguir Editando</button>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
      {isZoomed && (
        <div className="fixed inset-0 z-[300] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsZoomed(false)}>
          <img src={images[currentImageIndex]} alt="Zoom" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300" />
        </div>
      )}

      <div className="no-print">
        <AppHeader title="Editor de Informe" onBack={onBack} userProfile={userProfile} onLogout={onLogout} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 print:p-0 print:max-w-none">
        <section className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 print:shadow-none print:border-none print:p-0 flex flex-col min-h-[1050px]">
          
          {/* 1. ENCABEZADO */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-[#2FB8B3] rounded-lg flex items-center justify-center text-white text-[10px] font-black italic shadow-sm">DR</div>
                <p className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em]">Médico Responsable</p>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tight">{doctorName}</h3>
              <p className="text-[11px] text-slate-500 font-bold mt-2 italic leading-none">Médico Veterinario Especialista</p>
            </div>
            <div className="px-8 hidden md:block opacity-10">
               <img src="/logo.png" alt="Logo" className="h-10 w-auto grayscale" />
            </div>
            <div className="flex-1 text-right">
              <div className="mb-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fecha del Informe</p>
                <p className="text-sm font-black text-slate-700 leading-none">{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Centro Veterinario</p>
                <h3 className="text-xl font-extrabold text-[#2FB8B3] leading-none uppercase tracking-tight">{clinicName}</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-wider leading-none uppercase">Diagnóstico por Imagen IA</p>
              </div>
            </div>
          </div>

          {/* 2. CARRUSEL (SOLO PANTALLA) */}
          {images && images.length > 0 && (
            <div className="mb-10 no-print">
              <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
                <img src={images[currentImageIndex]} alt="Estudio" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setIsZoomed(true)} />
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={prevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">←</button>
                  <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all">→</button>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white">
                   {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)} className={`shrink-0 w-20 h-14 rounded-xl border-2 transition-all ${currentImageIndex === i ? "border-[#2FB8B3] scale-105" : "border-transparent opacity-50"}`}>
                    <img src={img} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. TÍTULO */}
          <h2 className="text-2xl font-black text-slate-800 uppercase mb-8 text-center tracking-tighter underline decoration-[#2FB8B3] decoration-4 underline-offset-8">
            {report.study}
          </h2>

          {/* DATOS DEL PACIENTE (OCULTA VACÍOS EN IMPRESIÓN) */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-10 bg-[#F8FAFC] p-8 rounded-[2rem] border border-slate-100 print:bg-transparent print:border-t-2 print:border-b-2 print:border-slate-900 print:rounded-none">
            <EditableInfo label="Paciente" value={report.patient} onChange={(v) => handleFieldChange('patient', v)} />
            <EditableInfo label="Tutor" value={report.tutor} onChange={(v) => handleFieldChange('tutor', v)} />
            <EditableInfo label="Especie" value={report.species} onChange={(v) => handleFieldChange('species', v)} />
            <EditableInfo label="Género" value={report.gender} onChange={(v) => handleFieldChange('gender', v)} />
            <EditableInfo label="Edad" value={report.age} onChange={(v) => handleFieldChange('age', v)} />
            <EditableInfo label="Peso" value={report.weight} onChange={(v) => handleFieldChange('weight', v)} />
          </div>

          {/* TEXT AREAS */}
          <div className="flex-1 space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center no-print px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interpretación Clínica</label>
                <button onClick={() => toggleSpeech("diagnostico")} className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${isListening === "diagnostico" ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}>
                  {isListening === "diagnostico" ? "DETENER" : "🎤 DICTAR"}
                </button>
              </div>
              <textarea rows={10} value={report.diagnostico} onChange={e => handleFieldChange('diagnostico', e.target.value)} className="w-full text-[15px] leading-relaxed p-6 rounded-[2rem] bg-white border border-slate-200 focus:border-[#2FB8B3] outline-none resize-none font-medium shadow-sm" />
            </div>
            {report.observaciones && (
              <div className="space-y-3">
                <div className="flex justify-between items-center no-print px-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Observaciones Adicionales</label>
                  <button onClick={() => toggleSpeech("observaciones")} className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${isListening === "observaciones" ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}>
                      {isListening === "observaciones" ? "DETENER" : "🎤 DICTAR"}
                  </button>
                </div>
                <textarea rows={3} value={report.observaciones} onChange={e => handleFieldChange('observaciones', e.target.value)} className="w-full text-sm p-6 rounded-[2rem] bg-slate-50 border border-slate-100 outline-none resize-none italic text-slate-500 shadow-inner" />
              </div>
            )}
          </div>

          {/* FIRMA */}
          <div className="mt-16 flex flex-col items-end px-12 pb-10">
            <div className="w-64 text-center">
              <div className="h-24 flex items-end justify-center mb-2">
                {localStorage.getItem("doctorSignature") ? (
                  <img src={localStorage.getItem("doctorSignature") || ""} alt="Firma" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                ) : (
                  <div className="text-[9px] text-slate-300 font-bold uppercase tracking-widest pb-4 italic">Firma Manual</div>
                )}
              </div>
              <div className="h-[2px] bg-slate-900 w-full mb-3"></div>
              <p className="text-[12px] font-black text-slate-900 uppercase leading-none">Dr. {doctorName}</p>
              <p className="text-[9px] font-bold text-[#2FB8B3] uppercase mt-2 tracking-wider">Médico Veterinario Especialista</p>
            </div>
          </div>

          {/* 4. GALERÍA FINAL (SOLO PARA IMPRESIÓN) */}
          <div className="hidden print:block border-t-2 border-slate-100 pt-10 mt-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Anexo: Capturas del Estudio</p>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES */}
          <div className="no-print flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-slate-100">
            <button onClick={handleSave} disabled={showVisualFeedback} className={`flex-1 h-16 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${showVisualFeedback ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-black"}`}>
              {showVisualFeedback ? "✔ REPORTE GUARDADO" : "GUARDAR CAMBIOS"}
            </button>
            <div className="flex gap-4 flex-1">
              <button onClick={() => window.print()} className="flex-1 bg-[#2FB8B3]/10 text-[#2FB8B3] h-16 rounded-2xl font-black text-sm hover:bg-[#2FB8B3]/20 transition-all flex items-center justify-center gap-2">PDF / IMPRIMIR</button>
              <button onClick={() => isSaved ? onFinish() : setShowExitAlert(true)} className="px-8 bg-white border-2 border-slate-200 text-slate-500 h-16 rounded-2xl font-black text-sm hover:border-slate-900 hover:text-slate-900 transition-all uppercase">Finalizar</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function EditableInfo({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  // Si no hay valor, ocultamos el bloque entero en la impresión
  if (!value && typeof window !== 'undefined' && window.matchMedia('print').matches) return null;

  return (
    <div className={`flex flex-col border-b border-slate-200 focus-within:border-[#2FB8B3] transition-colors ${!value ? 'print:hidden' : 'print:border-none'}`}>
      <span className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] leading-none mb-2">{label}</span>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="..."
        className="font-bold text-slate-800 outline-none bg-transparent text-sm pb-2 placeholder:text-slate-200 print:pb-0" 
      />
    </div>
  );
}