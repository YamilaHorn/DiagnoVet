import { useState, useEffect, useRef } from "react";
import { AppHeader } from "../components/AppHeader";

export function AnalysisCasePage({ images, patientData, doctorName, onBack, onFinish }: any) {
  const [isListening, setIsListening] = useState<string | null>(null);
  
  // --- ESTADOS DE CONTROL ---
  const [isSaved, setIsSaved] = useState(false); 
  const [showVisualFeedback, setShowVisualFeedback] = useState(false); 
  const [showExitAlert, setShowExitAlert] = useState(false); 
  
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
    // Solo generamos texto IA si el diagnóstico está totalmente vacío (Caso Nuevo)
    if (!report.diagnostico) {
      const timer = setTimeout(() => {
        setReport(prev => ({ ...prev, diagnostico: aiGeneratedText }));
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // Si ya tiene diagnóstico (Edición), lo marcamos como guardado inicialmente
      setIsSaved(true);
    }
  }, []);

  // --- FUNCIÓN DE GUARDADO (SOBREESCRITURA INTELIGENTE) ---
  const handleSave = () => {
    const existingReports = JSON.parse(localStorage.getItem("reports") || "[]");
    
    // Si no tiene ID (es nuevo), generamos uno. Si tiene, conservamos el original.
    const currentId = report.id || Date.now();

    const finalReport = {
      ...report,
      id: currentId,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Finalizado",
      images: images // Mantenemos las imágenes vinculadas al reporte
    };

    let updatedReports;
    const exists = existingReports.some((r: any) => r.id === currentId);

    if (exists) {
      // MODO EDICIÓN: Sobreescribimos el elemento existente manteniendo el orden
      updatedReports = existingReports.map((r: any) => 
        r.id === currentId ? finalReport : r
      );
    } else {
      // MODO NUEVO: Lo agregamos al principio
      updatedReports = [finalReport, ...existingReports];
      // Actualizamos el estado local para que las siguientes pulsaciones de "Guardar" editen este mismo
      setReport(prev => ({ ...prev, id: currentId }));
    }

    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setIsSaved(true);
    setShowVisualFeedback(true);
    setTimeout(() => setShowVisualFeedback(false), 2000);
  };

  const handleAttemptFinish = () => {
    if (isSaved) {
      onFinish(); 
    } else {
      setShowExitAlert(true); 
    }
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
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(field);
    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript + " ";
          setReport((prev: any) => ({ ...prev, [field]: prev[field] + text }));
          setIsSaved(false); 
        }
      }
    };
    recognition.onend = () => setIsListening(null);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans relative text-slate-900">
      
      {/* MODAL DE EMERGENCIA */}
      {showExitAlert && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Cambios sin guardar</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              No has guardado los últimos cambios en el reporte. ¿Qué deseas hacer?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={onFinish} className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Continuar sin guardar</button>
              <button onClick={() => setShowExitAlert(false)} className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Seguir Editando</button>
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <AppHeader title="Editor de Informe" onBack={onBack} />
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 print:p-0 print:max-w-none">
        <section className="bg-white p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 print:shadow-none print:border-none print:p-0 flex flex-col min-h-[1100px]">
          
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
            <div className="flex flex-col gap-4">
              <img src="/logo.png" alt="Logo Diagnovet" className="h-16 w-auto object-contain self-start" />
              <div>
                <p className="text-xl font-black text-slate-900 uppercase leading-none">{doctorName || "Nicolas Alborno"}</p>
                <p className="text-[10px] font-bold text-[#2FB8B3] uppercase tracking-[0.2em] mt-2">Médico Veterinario Especialista</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 uppercase mb-8 text-center tracking-tight underline decoration-[#2FB8B3] decoration-4 underline-offset-8">{report.study}</h2>

          <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-10 bg-[#F8FAFC] p-8 rounded-[2rem] border border-slate-100 print:bg-transparent print:border-t-2 print:border-b-2 print:border-slate-900 print:rounded-none">
            <EditableInfo label="Paciente" value={report.patient} onChange={(v) => handleFieldChange('patient', v)} />
            <EditableInfo label="Tutor" value={report.tutor} onChange={(v) => handleFieldChange('tutor', v)} />
            <EditableInfo label="Especie" value={report.species} onChange={(v) => handleFieldChange('species', v)} />
            <EditableInfo label="Género" value={report.gender} onChange={(v) => handleFieldChange('gender', v)} />
            <EditableInfo label="Edad" value={report.age} onChange={(v) => handleFieldChange('age', v)} />
            <EditableInfo label="Peso" value={report.weight} onChange={(v) => handleFieldChange('weight', v)} />
          </div>

          <div className="flex-1 space-y-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center no-print">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Interpretación Clínica</label>
                <button onClick={() => toggleSpeech("diagnostico")} className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${isListening === "diagnostico" ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}>
                  {isListening === "diagnostico" ? "DETENER" : "🎤 DICTAR"}
                </button>
              </div>
              <textarea rows={10} value={report.diagnostico} onChange={e => handleFieldChange('diagnostico', e.target.value)} className="w-full text-[15px] leading-relaxed p-6 rounded-[2rem] bg-white border border-slate-200 focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5 outline-none resize-none font-medium shadow-sm" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center no-print">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Observaciones</label>
                <button onClick={() => toggleSpeech("observaciones")} className={`text-[9px] font-black px-4 py-1.5 rounded-full transition-all ${isListening === "observaciones" ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}>
                    {isListening === "observaciones" ? "DETENER" : "🎤 DICTAR"}
                </button>
              </div>
              <textarea rows={3} value={report.observaciones} onChange={e => handleFieldChange('observaciones', e.target.value)} className="w-full text-sm p-6 rounded-[2rem] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#2FB8B3] outline-none resize-none italic text-slate-500 shadow-inner" />
            </div>
          </div>

          <div className="no-print flex flex-col md:flex-row gap-4 mt-12 pt-8 border-t border-slate-100">
            <button 
              onClick={handleSave} 
              disabled={showVisualFeedback}
              className={`flex-1 h-16 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                showVisualFeedback 
                  ? "bg-green-500 text-white scale-[0.98]" 
                  : "bg-slate-900 text-white hover:bg-black"
              }`}
            >
              {showVisualFeedback ? "✔ GUARDADO" : "💾 GUARDAR CAMBIOS"}
            </button>

            <div className="flex gap-4 flex-1">
              <button onClick={() => window.print()} className="flex-1 bg-[#2FB8B3]/10 text-[#2FB8B3] h-16 rounded-2xl font-black text-sm hover:bg-[#2FB8B3]/20 transition-all flex items-center justify-center gap-2">
                🖨️ IMPRIMIR
              </button>
              <button 
                onClick={handleAttemptFinish} 
                className="px-8 bg-white border-2 border-slate-200 text-slate-500 h-16 rounded-2xl font-black text-sm hover:border-[#2FB8B3] hover:text-[#2FB8B3] transition-all uppercase"
              >
                Finalizar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function EditableInfo({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col border-b border-slate-200 focus-within:border-[#2FB8B3] transition-colors">
      <span className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] leading-none mb-2">{label}</span>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="font-bold text-slate-800 outline-none bg-transparent text-sm pb-2 placeholder:text-slate-300"
      />
    </div>
  );
}