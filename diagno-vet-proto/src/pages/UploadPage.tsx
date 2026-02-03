import { FileDropzone } from "../components/FileDropzone";

export function UploadPage() {  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-semibold mb-4">Carga de Archivos - Prototipo</h1>
        <FileDropzone />
      </div>
    </div>
  );
}
