import { AppHeader } from "../components/AppHeader";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Props = {
  data: {
    clinicName: string;
    address: string;
    phone: string;
  };
  onChange: (data: Props["data"]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function PreConfirmationPage({
  data,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const { clinicName, address, phone } = data;

  const isValid = clinicName.trim() && address.trim() && phone.trim();

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
        <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6">
              Step 1 of 2
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Información de <br /> 
              <span className="text-blue-600 font-black">la Veterinaria</span>
            </h1>

            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
              Necesitamos los datos básicos de tu clínica para configurar el entorno de trabajo y los reportes.
            </p>

            <div className="space-y-6">
              {[
                { t: "Identidad del Centro", d: "El nombre de tu clínica aparecerá en los diagnósticos compartidos." },
                { t: "Cumplimiento Legal", d: "Aseguramos que la información cumpla con los estándares requeridos." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                Nombre Legal de la Clínica *
              </label>
              <input
                value={clinicName}
                onChange={(e) => onChange({ ...data, clinicName: e.target.value })}
                placeholder="Ej: Clínica Veterinaria San Juan"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Dirección Física *
              </label>
              <input
                value={address}
                onChange={(e) => onChange({ ...data, address: e.target.value })}
                placeholder="Ej: Av. Principal 123, Ciudad"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Teléfono de Contacto *
              </label>
              <div className="mt-1 custom-phone-input">
                <PhoneInput
                  defaultCountry="AR"
                  value={phone}
                  onChange={(value) =>
                    onChange({ ...data, phone: value || "" })
                  }
                  placeholder="Ej: 555 123 4567"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center uppercase tracking-tight">
              Podrás editar esta información luego en ajustes.
            </p>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-blue-600/10"
              >
                Siguiente Paso
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