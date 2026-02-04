import React from "react";

interface ReportePDFProps {
  data: {
    patient: string;
    tutor: string;
    species: string;
    gender: string;
    age: string;
    weight: string;
    study: string;
    diagnostico: string;
    observaciones?: string;
  };
  images: string[];
  doctor: string;
  clinic: string;
  signature: string | null; // Propiedad añadida para la firma
}

export const ReportePDF = React.forwardRef<HTMLDivElement, ReportePDFProps>(
  ({ data, images, doctor, clinic, signature }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white text-black p-12 font-serif" 
        style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}
      >
        {/* ENCABEZADO MÉDICO */}
        <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase leading-none">{doctor}</h1>
            <p className="text-xs italic font-sans mt-1 text-gray-600">Médico Veterinario Especialista</p>
          </div>
          <div className="text-right font-sans">
            <h2 className="text-lg font-bold text-gray-800 uppercase leading-none">{clinic}</h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* TÍTULO DEL ESTUDIO */}
        <div className="text-center mb-10">
          <h3 className="text-xl font-bold uppercase tracking-widest underline underline-offset-8">
            {data.study}
          </h3>
        </div>

        {/* GRILLA DE DATOS DEL PACIENTE */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-10 py-6 border-y border-gray-100 font-sans">
          <DataRow label="Paciente" value={data.patient} />
          <DataRow label="Tutor" value={data.tutor} />
          <DataRow label="Especie" value={data.species} />
          <DataRow label="Género" value={data.gender} />
          <DataRow label="Edad" value={data.age} />
          <DataRow label="Peso" value={data.weight} />
        </div>

        {/* CUERPO DEL INFORME */}
        <div className="mb-12 min-h-[350px]">
          <h4 className="font-bold text-xs uppercase mb-4 text-gray-500 font-sans tracking-widest">Interpretación Clínica:</h4>
          <p className="text-[15px] leading-relaxed text-justify whitespace-pre-wrap">
            {data.diagnostico}
          </p>
          
          {data.observaciones && (
            <div className="mt-8 pt-6 border-t border-gray-50">
               <h4 className="font-bold text-xs uppercase mb-2 text-gray-500 font-sans tracking-widest">Observaciones:</h4>
               <p className="text-sm italic text-gray-700">{data.observaciones}</p>
            </div>
          )}
        </div>

        {/* SECCIÓN DE FIRMA DINÁMICA */}
        <div className="flex justify-end mb-16 px-8">
          <div className="w-64 text-center">
            <div className="h-24 flex items-end justify-center mb-2">
              {signature ? (
                <img 
                  src={signature} 
                  alt="Firma" 
                  className="max-h-full max-w-full object-contain mix-blend-multiply" 
                />
              ) : (
                <div className="text-[10px] text-gray-300 italic mb-4">Firma Pendiente</div>
              )}
            </div>
            <div className="border-t border-black pt-3">
              <p className="text-sm font-bold uppercase">Dr. {doctor}</p>
              <p className="text-[10px] text-gray-500 font-sans uppercase tracking-tighter">Firma y Sello Autorizado</p>
            </div>
          </div>
        </div>

        {/* ANEXO DE IMÁGENES */}
        {images && images.length > 0 && (
          <div className="mt-10 pt-10 border-t border-gray-100" style={{ pageBreakBefore: 'always' }}>
            <p className="text-[9px] font-bold uppercase text-gray-400 mb-6 tracking-widest text-center">
              Anexo: Capturas de Imagen de Referencia del Estudio
            </p>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-video rounded border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
                  <img src={img} className="w-full h-full object-cover" alt={`Captura ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ReportePDF.displayName = "ReportePDF";

function DataRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-50 pb-1">
      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{label}:</span>
      <span className="text-sm font-bold text-gray-900 uppercase">{value}</span>
    </div>
  );
}