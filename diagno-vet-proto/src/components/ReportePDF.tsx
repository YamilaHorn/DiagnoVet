import React from "react";
import { useLanguage } from "../context/LanguageContext";

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
  signature: string | null;
}

// Diccionario local para el PDF
const PDF_LABELS: Record<"en" | "es", Record<string, string>> = {
  en: {
    specialist: "Veterinary Specialist",
    patient: "Patient",
    tutor: "Owner",
    species: "Species",
    gender: "Gender",
    age: "Age",
    weight: "Weight",
    interpretation: "Clinical Interpretation:",
    observations: "Observations:",
    pending_sig: "Pending Signature",
    auth_sig: "Authorized Signature & Stamp",
    annex_title: "Annex: Reference Image Captures of the Study",
  },
  es: {
    specialist: "Médico Veterinario Especialista",
    patient: "Paciente",
    tutor: "Tutor",
    species: "Especie",
    gender: "Género",
    age: "Edad",
    weight: "Peso",
    interpretation: "Interpretación Clínica:",
    observations: "Observaciones:",
    pending_sig: "Firma Pendiente",
    auth_sig: "Firma y Sello Autorizado",
    annex_title: "Anexo: Capturas de Imagen de Referencia del Estudio",
  },
};

export const ReportePDF = React.forwardRef<HTMLDivElement, ReportePDFProps>(
  ({ data, images, doctor, clinic, signature }, ref) => {
    const { lang } = useLanguage();
    const t = PDF_LABELS[lang];

    return (
      <div
        ref={ref}
        className="bg-white text-black p-6 md:p-12 font-serif"
        style={{
          width: "100%",
          maxWidth: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
        }}
      >
        {/* ENCABEZADO MÉDICO */}
        <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold uppercase leading-none">
              {doctor}
            </h1>
            <p className="text-xs italic font-sans mt-1 text-gray-600">
              {t.specialist}
            </p>
          </div>
          <div className="text-right font-sans">
            <h2 className="text-lg font-bold text-gray-800 uppercase leading-none">
              {clinic}
            </h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              {new Date().toLocaleDateString(
                lang === "es" ? "es-ES" : "en-US",
                { day: "2-digit", month: "long", year: "numeric" },
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-10 py-6 border-y border-gray-100 font-sans">
          <DataRow label={t.patient} value={data.patient} />
          <DataRow label={t.tutor} value={data.tutor} />
          <DataRow label={t.species} value={data.species} />
          <DataRow label={t.gender} value={data.gender} />
          <DataRow label={t.age} value={data.age} />
          <DataRow label={t.weight} value={data.weight} />
        </div>

        {/* CUERPO DEL INFORME */}
        <div className="mb-12 min-h-[350px]">
          <h4 className="font-bold text-xs uppercase mb-4 text-gray-500 font-sans tracking-widest">
            {t.interpretation}
          </h4>
          <p className="text-[15px] leading-relaxed text-justify whitespace-pre-wrap">
            {data.diagnostico}
          </p>

          {data.observaciones && (
            <div className="mt-8 pt-6 border-t border-gray-50">
              <h4 className="font-bold text-xs uppercase mb-2 text-gray-500 font-sans tracking-widest">
                {t.observations}
              </h4>
              <p className="text-sm italic text-gray-700">
                {data.observaciones}
              </p>
            </div>
          )}
        </div>

        {/* SECCIÓN DE FIRMA DINÁMICA */}
        <div className="flex justify-end mb-16 px-4 md:px-8">
          <div className="w-full md:w-64 text-center">
            <div className="h-20 md:h-24 flex items-end justify-center mb-2">
              {signature ? (
                <img
                  src={signature}
                  alt="Firma"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-[10px] text-gray-300 italic mb-4">
                  {t.pending_sig}
                </div>
              )}
            </div>
            <div className="border-t border-black pt-3">
              <p className="text-sm font-bold uppercase">Dr. {doctor}</p>
              <p className="text-[10px] text-gray-500 font-sans uppercase tracking-tighter">
                {t.auth_sig}
              </p>
            </div>
          </div>
        </div>

        {/* ANEXO DE IMÁGENES */}
        {images && images.length > 0 && (
          <div
            className="mt-10 pt-10 border-t border-gray-100"
            style={{ pageBreakBefore: "always" }}
          >
            <p className="text-[9px] font-bold uppercase text-gray-400 mb-6 tracking-widest text-center">
              {t.annex_title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-video rounded border border-gray-200 overflow-hidden shadow-sm bg-gray-50"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt={`Capture ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

ReportePDF.displayName = "ReportePDF";

function DataRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-50 pb-1">
      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
        {label}:
      </span>
      <span className="text-sm font-bold text-gray-900 uppercase">{value}</span>
    </div>
  );
}
