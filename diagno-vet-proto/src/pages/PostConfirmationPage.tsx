import PhoneInput from "react-phone-number-input";
import { AppHeader } from "../components/AppHeader";
import "react-phone-number-input/style.css";

type Props = {
  data: {
    phone: string;
    title: string;
    fullName: string;
    license: string;
  };
  onChange: (data: Props["data"]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function PostConfirmationPage({
  data,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const { phone, title, fullName, license } = data;

  const isValid = phone && title.trim() && fullName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onContinue();
  };

  const inputClass = "w-full mt-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all text-slate-700 shadow-sm";

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader title="Account setup" onBack={onBack} />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">

          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6">
              Step 2 of 2
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Personaliza tu <br /> 
              <span className="text-blue-600 font-black">Perfil Profesional</span>
            </h1>

            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
              Estos datos aparecerán en los encabezados de tus reportes generados por la IA.
            </p>

            <div className="space-y-6">
              {[
                { t: "Reportes Profesionales", d: "Tu nombre y matrícula aparecerán en cada diagnóstico." },
                { t: "Configuración Rápida", d: "Solo toma un minuto y puedes editarlo después." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.t}</h4>
                    <p className="text-sm text-slate-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Número de Teléfono *
              </label>
              <div className="mt-1 custom-phone-input">
                <PhoneInput
                  international
                  defaultCountry="AR"
                  value={phone}
                  onChange={(value) => onChange({ ...data, phone: value || "" })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Título Profesional *
              </label>
              <select
                value={title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                className={inputClass}
              >
                <option value="">Selecciona tu título</option>
                <option value="Veterinarian">Médico Veterinario</option>
                <option value="Veterinary Technician">Técnico Veterinario</option>
                <option value="Clinic Manager">Director de Clínica</option>
                <option value="Other">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nombre Completo *
              </label>
              <input
                value={fullName}
                onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                placeholder="Ej: Dr. Nicolás Alborno"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Matrícula Profesional <span className="text-slate-300 font-normal">(Opcional)</span>
              </label>
              <input
                value={license}
                onChange={(e) => onChange({ ...data, license: e.target.value })}
                placeholder="Ej: MP 12345"
                className={inputClass}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-blue-600/10"
              >
                Completar Registro
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}