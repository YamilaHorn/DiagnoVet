import { useState, useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { useLanguage } from "../context/LanguageContext";
import { dashboardTranslations } from "../utils/translations/dashboard";

type Props = {
  onCreateReport?: () => void;
  onEditReport?: (study: any) => void;
  userProfile: any; 
  onLogout?: () => void;
};

export function DashboardPage({ onCreateReport, onEditReport, userProfile, onLogout }: Props) {
  const { lang } = useLanguage();
  const t = dashboardTranslations[lang];
  
  const [studies, setStudies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const allReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const myReports = allReports.filter((report: any) => 
      report.creatorEmail === userProfile.email
    );
    setStudies(myReports);
  }, [userProfile.email]);

  const handleDelete = (id: number) => {
    if (window.confirm(t.delete_confirm)) {
      const allReports = JSON.parse(localStorage.getItem("reports") || "[]");
      const updatedAll = allReports.filter((s: any) => s.id !== id);
      localStorage.setItem("reports", JSON.stringify(updatedAll));
      setStudies(updatedAll.filter((r: any) => r.creatorEmail === userProfile.email));
    }
  };

  const filteredStudies = studies.filter(study => 
    study.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.tutor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.study?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader
        userProfile={userProfile}
        onLogout={onLogout}
        right={
          <button
            onClick={onCreateReport}
            className="bg-[#2FB8B3] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#25918d] transition-all shadow-lg shadow-[#2FB8B3]/20 flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span>
            {t.btn_new_report}
          </button>
        }
      />

      <main className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
        <section className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {t.welcome} <span className="text-[#2FB8B3]">Dr. {userProfile?.fullName?.split(' ')[0] || t.vet_default}</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </section>

        {/* METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MetricCard title={t.metric_reports} value={studies.length.toString()} icon="file" />
          <MetricCard title={t.metric_patients} value={[...new Set(studies.map(s => s.patient))].length.toString()} icon="users" />
          <MetricCard title={t.metric_specialty} value={userProfile?.title?.split(' ')[0] || "Vet"} icon="bolt" />
        </section>

        {/* SEARCH BAR */}
        <section className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <div className="relative w-full md:w-96 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2FB8B3] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder={t.search_placeholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/5 transition-all shadow-sm text-sm font-bold text-slate-600 placeholder:text-slate-300 placeholder:font-medium"
            />
          </div>
          <h2 className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            {t.showing_prefix} {filteredStudies.length} {t.showing_suffix}
          </h2>
        </section>

        {/* LISTADO DE ESTUDIOS */}
        <section className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="hidden md:grid grid-cols-5 bg-slate-50/50 px-10 py-4 border-b border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.table_patient}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.table_tutor}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.table_study}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.table_status}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.table_actions}</p>
            </div>

            <div className="divide-y divide-slate-50">
              {filteredStudies.length > 0 ? (
                filteredStudies.map((study) => (
                  <div key={study.id} className="grid grid-cols-1 md:grid-cols-5 items-center px-10 py-6 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-[#2FB8B3]/10 group-hover:text-[#2FB8B3] transition-colors">
                        {(study.patient || "P")[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-none">{study.patient}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{study.species}</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-500">{study.tutor}</div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{study.study}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{study.date}</p>
                    </div>
                    <div className="flex justify-center">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                        study.status === 'Finalizado' || study.status === 'Finished' 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-[#2FB8B3]/10 text-[#2FB8B3]'
                      }`}>
                        {study.status === 'Finalizado' || study.status === 'Finished' ? t.status_finished : t.status_progress}
                      </span>
                    </div>
                    <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEditReport && onEditReport(study)} className="p-2 hover:bg-white rounded-xl shadow-sm text-slate-400 hover:text-[#2FB8B3] transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                      <button onClick={() => handleDelete(study.id)} className="p-2 hover:bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-400 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t.empty_title}</p>
                  <button onClick={onCreateReport} className="mt-4 text-[#2FB8B3] font-black text-xs uppercase tracking-tighter hover:underline">{t.empty_btn}</button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-[#2FB8B3]/10 group-hover:text-[#2FB8B3] transition-colors">
          {icon === 'file' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
          {icon === 'users' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
          {icon === 'bolt' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
        </div>
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}