import { AppHeader } from "../components/AppHeader";

type Props = {
  onCreateReport?: () => void;
};

export function DashboardPage({ onCreateReport }: Props) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader
        right={
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <button className="hover:text-blue-600 transition-colors">My Studies</button>
              <button className="hover:text-blue-600 transition-colors">Analytics</button>
            </nav>

            <button
              onClick={onCreateReport}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              New Report
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">Fernanda Barbero</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Veterinarian</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white shadow-sm flex items-center justify-center text-white font-black">
                FB
              </div>
            </div>
          </div>
        }
      />

      <main className="flex-1 px-6 py-12 max-w-7xl mx-auto w-full">
        <section className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Welcome, <span className="text-blue-600">Dr. Barbero</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Everything is ready. Create diagnostic reports by uploading patient data 
            and medical images to receive AI-assisted insights.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MetricCard title="Reports created" value="24" icon="file" />
          <MetricCard title="Patients" value="18" icon="users" />
          <MetricCard title="AI Accuracy" value="98%" icon="bolt" />
        </section>

        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-16 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-3">
              No reports yet
            </h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
              Start by creating your first diagnostic report. Upload images 
              and patient info to begin the analysis.
            </p>

            <button
              onClick={onCreateReport}
              className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 flex items-center gap-4 mx-auto group"
            >
              Create first report
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
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
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {icon === 'file' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
          {icon === 'users' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
          {icon === 'bolt' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
        </div>
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}