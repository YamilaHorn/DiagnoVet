import { useState, useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { Loader } from "../components/Loader";

type Props = {
  images: string[];
  onBack: () => void;
};

export function AnalysisCasePage({ images, onBack }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Seleccionamos la primera imagen cargada como principal
  const mainImage = images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1579154235602-33d5f74e44c5?q=80&w=2070";

  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // FUNCIÓN PARA COPIAR AL PORTAPAPELES
  const handleCopySummary = () => {
    const summaryText = `DIAGNOVET AI REPORT - PACIENTE: Rocky\n` +
      `Hallazgos: Pared vesical engrosada (4.2mm), sedimento presente.\n` +
      `Conclusión: Signos compatibles con cistitis crónica agudizada.`;
    
    navigator.clipboard.writeText(summaryText);
    alert("Resumen copiado para tu historial clínico");
  };

  // FUNCIÓN PARA IMPRIMIR / GENERAR PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900">
      {/* Ocultamos el header al imprimir */}
      <div className="no-print">
        <AppHeader 
          title={isAnalyzing ? "Analizando Ecografía..." : "Reporte Médico Generado"} 
          onBack={onBack} 
        />
      </div>

      <main className="flex-1 px-6 py-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:p-0">
        
        {/* LADO IZQUIERDO: EVIDENCIA VISUAL */}
        <div className="lg:col-span-7 space-y-6 print:w-full">
          <div className="bg-black rounded-[2.5rem] aspect-video flex items-center justify-center overflow-hidden shadow-2xl relative border-4 border-slate-900 print:rounded-2xl print:shadow-none print:border-slate-200">
            <img 
              src={mainImage} 
              className={`w-full h-full object-contain transition-opacity duration-1000 ${isAnalyzing ? 'opacity-30' : 'opacity-100'}`}
              alt="Análisis ecográfico"
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center no-print">
                <Loader />
                <p className="mt-4 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
                  Escaneando estructuras...
                </p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex justify-between items-center print:border-none print:px-0">
            <div className="flex gap-8">
              <InfoItem label="Paciente" value="Rocky" />
              <InfoItem label="Especie" value="Canino" />
              <InfoItem label="Peso" value="32kg" />
            </div>
            <div className="px-5 py-2.5 bg-blue-50 rounded-2xl border border-blue-100 print:bg-white">
              <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mb-0.5">Hallazgo Principal</p>
              <p className="font-bold text-blue-900 text-sm">Cistitis Crónica</p>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: REPORTE */}
        <div className="lg:col-span-5 space-y-6 print:w-full print:mt-10">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col min-h-[600px] print:border-none print:p-0">
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center no-print">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <span className="text-2xl animate-bounce">🧠</span>
                </div>
                <h3 className="font-black text-slate-800 tracking-tight">Procesando hallazgos...</h3>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 print:slide-none">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Insights</h2>
                  <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase no-print">Análisis Completo</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 print:bg-white">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pared Vesical</p>
                    <p className="text-xl font-black text-red-600">4.2 mm</p>
                    <p className="text-[10px] text-slate-500 italic mt-1">Ref: máx 3.0mm</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 print:bg-white">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sedimento</p>
                    <p className="text-xl font-black text-slate-800">Positivo</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Diferenciales</p>
                  <div className="space-y-4">
                    <ProbabilityBar label="Cistitis Inflamatoria" prob={85} color="bg-blue-600" />
                    <ProbabilityBar label="Urolitiasis" prob={12} color="bg-slate-300" />
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-10 relative print:bg-white print:text-black print:border-2 print:border-slate-100">
                  <div className="absolute -top-3 left-8 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest print:bg-slate-200 print:text-black">
                    Conclusión Médica
                  </div>
                  <p className="text-sm leading-relaxed italic">
                    "Signos ecográficos altamente compatibles con cistitis crónica. Se observa engrosamiento parietal difuso. Se recomienda urianálisis y cultivo."
                  </p>
                </div>

                {/* FIRMA (Solo aparece al imprimir) */}
                <div className="hidden print:block mt-20 border-t border-slate-300 pt-4 w-64 text-center">
                  <p className="text-sm font-bold">Firma del Veterinario</p>
                  <p className="text-[10px] text-slate-500">M.P. Clinica DiagnoVET</p>
                </div>

                {/* ACCIONES FINALES - Se ocultan al imprimir */}
                <div className="mt-auto space-y-4 no-print">
                  <button 
                    onClick={() => window.print()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                  >
                    Generar Reporte PDF
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleCopySummary}
                      className="h-14 bg-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all uppercase tracking-widest"
                    >
                      Copiar Resumen
                    </button>
                    <button 
                      onClick={onBack} 
                      className="h-14 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:border-slate-200 transition-all uppercase tracking-widest"
                    >
                      Cerrar Caso
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ESTILOS DE IMPRESIÓN ADICIONALES */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { display: block !important; }
          .lg\\:col-span-7, .lg\\:col-span-5 { width: 100% !important; }
          * { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}

// COMPONENTES AUXILIARES
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-0.5">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ProbabilityBar({ label, prob, color }: { label: string; prob: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="font-black text-slate-700 uppercase tracking-tighter">{label}</span>
        <span className="font-bold text-slate-400">{prob}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${prob}%` }} />
      </div>
    </div>
  );
}