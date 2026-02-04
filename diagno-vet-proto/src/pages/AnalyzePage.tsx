import { useState } from "react";
import { AppHeader } from "../components/AppHeader";

// Agregamos userProfile y clinicData a las props
export function AnalyzePage({ 
  data, 
  onChange, 
  images, 
  onUpdateImages, 
  onFinish, 
  onBack,
  userProfile, // <--- Nuevo
  clinicData   // <--- Nuevo
}: any) {
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = 
    data.animalName?.trim() && 
    data.studyType?.trim() && 
    data.gender?.trim() && 
    data.tutorName?.trim() && 
    images.length > 0;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      onUpdateImages([...images, ...newImages]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      onUpdateImages([...images, ...newImages]);
    }
  };

  const toggleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Navegador no compatible con voz.");

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      updateField("reason", (data.reason || "") + " " + transcript);
    };
    recognition.start();
  };

  const inputFocusClass = "focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5";
  const inputBaseClass = "w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none transition-all shadow-sm";

  return (
    <div className="h-screen bg-[#FDFDFD] flex flex-col overflow-hidden font-sans">
      <AppHeader title="Nuevo Análisis Clínico" onBack={onBack} />

      <main className="flex-1 flex overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div className="w-full lg:w-[55%] p-8 overflow-y-auto border-r border-slate-100 text-slate-700">
          <section className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">🐾 Analizar Paciente</h2>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha del Estudio</p>
                  <p className="font-bold text-slate-600">{new Date().toLocaleDateString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre del Animal *</label>
                <input type="text" value={data.animalName || ""} onChange={(e) => updateField("animalName", e.target.value)} className={`${inputBaseClass} ${inputFocusClass}`} placeholder="Ej: Pony" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombre del Tutor *</label>
                <input type="text" value={data.tutorName || ""} onChange={(e) => updateField("tutorName", e.target.value)} className={`${inputBaseClass} ${inputFocusClass}`} placeholder="Ej: Juan Pérez" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tipo de Estudio *</label>
                <select value={data.studyType || ""} onChange={(e) => updateField("studyType", e.target.value)} className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}>
                    <option value="">Seleccionar estudio</option>
                    <option value="Ecografía">Ecografía Abdominal</option>
                    <option value="Ecocardiografía">Ecocardiografía</option>
                    <option value="Radiografía">Radiografía Digital</option>
                    <option value="Doppler">Doppler Vascular</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Género *</label>
                <select value={data.gender || ""} onChange={(e) => updateField("gender", e.target.value)} className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}>
                    <option value="">Seleccionar género</option>
                    <option value="Macho">Macho</option>
                    <option value="Macho Castrado">Macho Castrado</option>
                    <option value="Hembra">Hembra</option>
                    <option value="Hembra Castrada">Hembra Castrada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Especie</label>
                <select value={data.species || "Canino"} onChange={(e) => updateField("species", e.target.value)} className={`${inputBaseClass} ${inputFocusClass} cursor-pointer`}>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                  <option value="Equino">Equino</option>
                  <option value="Exótico">Exótico</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Edad</label>
                <input type="text" value={data.age || ""} onChange={(e) => updateField("age", e.target.value)} className={`${inputBaseClass} ${inputFocusClass}`} placeholder="Ej: 5 años" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Peso (kg)</label>
                <input type="text" value={data.weight || ""} onChange={(e) => updateField("weight", e.target.value)} className={`${inputBaseClass} ${inputFocusClass}`} placeholder="Ej: 12" />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observaciones Clínicas</label>
                <button onClick={toggleSpeech} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-[#2FB8B3]/10 text-[#2FB8B3] hover:bg-[#2FB8B3]/20"}`}>
                  {isListening ? "DETENER" : "🎤 DICTAR"}
                </button>
              </div>
              <textarea value={data.reason || ""} onChange={(e) => updateField("reason", e.target.value)} rows={4} className={`${inputBaseClass} ${inputFocusClass} resize-none !rounded-[2rem]`} placeholder="Escriba o dicte los motivos de consulta..." />
            </div>

            {/* SECCIÓN DINÁMICA DE MÉDICO Y CLÍNICA */}
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex items-center shadow-xl border border-white/5">
   
   {/* Bloque Médico */}
   <div className="flex-1">
      <p className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] mb-1">
        Médico Responsable
      </p>
      <h3 className="text-xl font-bold uppercase tracking-tight leading-none">
        {userProfile.fullName || "Nombre no configurado"}
      </h3>
      <p className="text-[11px] opacity-50 font-medium mt-1">
        {userProfile.title || "Especialidad"}
      </p>
   </div>

   {/* Separador Vertical Estilizado */}
   <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-8"></div>

   {/* Bloque Clínica */}
   <div className="flex-1">
      <p className="text-[9px] font-black text-[#2FB8B3] uppercase tracking-[0.2em] mb-1">
        Centro Clínico
      </p>
      <h3 className="text-lg font-bold uppercase tracking-tight leading-none">
        {clinicData.clinicName || "Clínica no configurada"}
      </h3>
      <p className="text-[11px] opacity-50 font-medium mt-1">
        Sede Central
      </p>
   </div>

</div>

            <button 
              onClick={onFinish} 
              disabled={!isValid} 
              className="w-full bg-[#2FB8B3] text-white h-16 rounded-2xl font-black text-xl hover:bg-[#25918d] transition-all shadow-xl shadow-[#2FB8B3]/20 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none flex items-center justify-center gap-4"
            >
              CONTINUAR AL ANÁLISIS <span className="text-2xl">→</span>
            </button>
          </section>
        </div>

        {/* COLUMNA DERECHA: Galería */}
        <div className="w-full lg:w-[45%] bg-[#F8FAFC] p-8 flex flex-col overflow-hidden">
          <div className="flex justify-between items-end mb-6 px-2">
            <div>
              <h3 className="font-black text-slate-800 text-xl tracking-tight">Imágenes ({images.length})</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mínimo 1 imagen requerida *</p>
            </div>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex-1 overflow-y-auto rounded-[2.5rem] p-6 transition-all border-2 border-dashed ${isDragging ? "bg-[#2FB8B3]/5 border-[#2FB8B3] scale-[0.99]" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <div className="grid grid-cols-2 gap-4">
              {images.map((src: any, i: number) => (
                <div key={i} className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-sm group border border-slate-100">
                  <img src={src} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <button 
                    onClick={() => onUpdateImages(images.filter((_: any, idx: number) => idx !== i))} 
                    className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-10"
                  >
                    <span className="text-xs font-black">✕</span>
                  </button>
                </div>
              ))}
              
              <label className="aspect-square bg-slate-50 border border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#2FB8B3]/5 hover:border-[#2FB8B3] transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2FB8B3] text-2xl group-hover:scale-110 transition-transform font-bold">+</div>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Subir Imagen</p>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}