import { useState } from "react";
import { FileDropzone } from "../components/FileDropzone";
import { AppHeader } from "../components/AppHeader";

type Props = {
  onFinish: (images: string[]) => void;
  onBack: () => void;
};

export function AnalyzePage({ onFinish, onBack }: Props) {
  const [animalName, setAnimalName] = useState("");
  const [species, setSpecies] = useState(""); 
  const [gender, setGender] = useState(""); 
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [reportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleAnalyzeClick = () => {
    const imageUrls = uploadedFiles.map(file => URL.createObjectURL(file));
    onFinish(imageUrls);
  };

  const canContinue = animalName.trim() && species && uploadedFiles.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AppHeader title="New Ultrasound Case" onBack={onBack} />

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5">
          <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Patient Details
              </h2>
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                {reportDate.split('-').reverse().join('/')}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient Name *</label>
                <input
                  placeholder="e.g. Luna"
                  value={animalName}
                  onChange={(e) => setAnimalName(e.target.value)}
                  className="w-full mt-2 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Species</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['Dog', 'Cat', 'Other'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpecies(s.toLowerCase())}
                      className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                        species === s.toLowerCase() 
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100" 
                        : "border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full mt-2 px-3 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
                  >
                    <option value="">-</option>
                    <option value="male">M</option>
                    <option value="female">F</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                  <input type="number" placeholder="Yrs" value={age} onChange={(e) => setAge(e.target.value)} className="w-full mt-2 px-3 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Weight</label>
                  <input type="number" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full mt-2 px-3 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Ultrasound</label>
                <textarea
                  placeholder="Describe clinical signs..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full mt-2 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-32 resize-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-7">
          <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Scan Images</h2>
                <p className="text-sm text-slate-400 mt-1">DICOM, JPG, PNG supported</p>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-green-100">
                  <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {uploadedFiles.length} Files Ready
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <FileDropzone onUploadComplete={handleUpload} />
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-100 px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Step 1 of 2</span>
        </div>
        
        <button
          disabled={!canContinue}
          onClick={handleAnalyzeClick}
          className="bg-slate-900 hover:bg-black text-white px-12 py-4 rounded-2xl font-bold disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center gap-4 group"
        >
          Analyze Case
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </footer>
    </div>
  );
}