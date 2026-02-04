import PhoneInput from "react-phone-number-input";
import { AppHeader } from "../components/AppHeader";
import "react-phone-number-input/style.css";

type Props = {
  data: {
    email: string;
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
  const { email, phone, title, fullName, license } = data;

  // Validación: Teléfono (mínimo de caracteres), Título y Nombre son obligatorios
  const isValid = 
    (phone && phone.trim().length > 5) && 
    title.trim().length > 0 && 
    fullName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Persistencia: Guardamos el perfil completo vinculado al email
    localStorage.setItem("userProfile", JSON.stringify(data));
    
    // Avanzar al Dashboard
    onContinue();
  };

  // Clase base para inputs con el color de marca #2FB8B3
  const inputClass = "w-full mt-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5 outline-none transition-all text-slate-700 shadow-sm";

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader title="Configuración de cuenta" onBack={onBack} />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* COLUMNA IZQUIERDA: Info y Branding */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit px-4 py-1 bg-[#2FB8B3]/10 text-[#2FB8B3] rounded-full text-[12px] font-bold uppercase tracking-wider mb-6">
              Paso 2 de 2
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Personaliza tu <br /> 
              <span className="text-[#2FB8B3] font-black">Perfil Profesional</span>
            </h1>

            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
              Hola <span className="text-slate-800 font-bold">{email}</span>. Estos datos aparecerán en los encabezados de tus reportes generados por la IA.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2FB8B3]/10 rounded-2xl flex items-center justify-center text-[#2FB8B3]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Reportes Profesionales</h4>
                  <p className="text-sm text-slate-500">Tu nombre y matrícula aparecerán en cada diagnóstico oficial.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2FB8B3]/10 rounded-2xl flex items-center justify-center text-[#2FB8B3]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Sincronización IA</h4>
                  <p className="text-sm text-slate-500">Configura tu perfil una vez y genera reportes en segundos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Formulario */}
          <form onSubmit={handleSubmit} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center space-y-6">
            
            {/* Teléfono */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Número de Teléfono *
              </label>
              <div className="mt-1 custom-phone-input">
                <PhoneInput
                  international
                  defaultCountry="CA"
                  value={phone}
                  onChange={(value) => onChange({ ...data, phone: value || "" })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Título Profesional *
              </label>
              <select
                value={title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%2364748b%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat`}
              >
                <option value="">Selecciona tu título</option>
                <option value="Médico Veterinario">Médico Veterinario</option>
                <option value="Técnico Veterinario">Técnico Veterinario</option>
                <option value="Director de Clínica">Director de Clínica</option>
                <option value="Especialista">Especialista</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Nombre Completo */}
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

            {/* Matrícula / Licencia */}
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
                className="w-full bg-[#2FB8B3] hover:bg-[#25918d] text-white h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-[#2FB8B3]/20 disabled:shadow-none active:scale-[0.98]"
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

      <style>{`
        .custom-phone-input .PhoneInputInput {
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.875rem 1.25rem;
          outline: none;
          font-family: inherit;
        }
        .custom-phone-input .PhoneInputInput:focus {
          border-color: #2FB8B3;
          box-shadow: 0 0 0 4px rgba(47, 184, 179, 0.05);
        }
        .custom-phone-input .PhoneInputCountry {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}