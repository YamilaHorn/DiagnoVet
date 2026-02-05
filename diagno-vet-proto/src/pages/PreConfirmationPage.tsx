import { AppHeader } from "../components/AppHeader";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useLanguage } from "../context/LanguageContext";
import { preConfirmationTranslations } from "../utils/translations/preConfirmation";

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
  const { lang } = useLanguage();
  const t = preConfirmationTranslations[lang];
  const { clinicName, address, phone } = data;

  const isValid =
    clinicName.trim().length > 0 &&
    address.trim().length > 0 &&
    phone &&
    phone.trim().length > 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onContinue();
  };

  const inputClass =
    "w-full mt-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5 outline-none transition-all text-slate-700 shadow-sm";

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader title={t.header_title} onBack={onBack} />

      <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit px-4 py-1 bg-[#2FB8B3]/10 text-[#2FB8B3] rounded-full text-[12px] font-bold uppercase tracking-wider mb-6">
              {t.step}
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              {t.title_main} <br />
              <span className="text-[#2FB8B3] font-black">
                {t.title_highlight}
              </span>
            </h1>

            <p className="text-slate-500 mb-10 text-lg leading-relaxed">
              {t.description}
            </p>

            <div className="space-y-6">
              {[
                { t: t.feature_1_title, d: t.feature_1_desc },
                { t: t.feature_2_title, d: t.feature_2_desc },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2FB8B3]/10 rounded-2xl flex items-center justify-center text-[#2FB8B3]">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
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

          <form
            onSubmit={handleSubmit}
            className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center space-y-6"
          >
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t.label_clinic_name}
              </label>
              <input
                value={clinicName}
                onChange={(e) =>
                  onChange({ ...data, clinicName: e.target.value })
                }
                placeholder={t.placeholder_clinic}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t.label_address}
              </label>
              <input
                value={address}
                onChange={(e) => onChange({ ...data, address: e.target.value })}
                placeholder={t.placeholder_address}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t.label_phone}
              </label>
              <div className="mt-1 custom-phone-input">
                <PhoneInput
                  defaultCountry="CA"
                  value={phone}
                  onChange={(val) => onChange({ ...data, phone: val || "" })}
                  placeholder={t.placeholder_phone}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center uppercase tracking-tight">
              {t.footer_note}
            </p>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-[#2FB8B3] hover:bg-[#25918d] text-white h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-[#2FB8B3]/20 disabled:shadow-none active:scale-[0.98]"
              >
                {t.btn_next}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
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
        }
        .custom-phone-input .PhoneInputInput:focus {
          border-color: #2FB8B3;
          box-shadow: 0 0 0 4px rgba(47, 184, 179, 0.05);
        }
      `}</style>
    </div>
  );
}
