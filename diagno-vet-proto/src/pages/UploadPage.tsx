import { FileDropzone } from "../components/FileDropzone";

export function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-full sm:max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">
          Carga de Archivos - Prototipo
        </h1>
        <FileDropzone />
      </div>
    </div>
  );
}
