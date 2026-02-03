import React, { useCallback, useState } from "react";

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  preview?: string | null;
};

const MAX_FILE_MB = 20;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

function readableBytes(bytes: number) {
  if (!bytes) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

export const FileDropzone: React.FC = () => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const startUpload = useCallback((item: UploadItem) => {
    // Simula upload
    setItems((prev) => prev.map(p => p.id === item.id ? { ...p, status: "uploading", progress: 0 } : p));
    let progress = 0;
    const id = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(id);
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "done", progress: 100 } : p));
        setMessage("Archivo(s) cargado(s) correctamente.");
        setTimeout(() => setMessage(null), 3500);
      } else {
        setItems(prev => prev.map(p => p.id === item.id ? { ...p, progress: Math.round(progress) } : p));
      }
    }, 300);
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const valid: UploadItem[] = [];
    for (const f of arr) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setMessage(`Tipo de archivo no permitido: ${f.name}`);
        setTimeout(() => setMessage(null), 3000);
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setMessage(`${f.name} excede el peso máximo de ${MAX_FILE_MB} MB.`);
        setTimeout(() => setMessage(null), 4000);
        continue;
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const item: UploadItem = { id, file: f, progress: 0, status: "queued", preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null };
      valid.push(item);
    }
    if (valid.length) {
      setItems(prev => [...prev, ...valid]);
      // lanzar uploads automáticos en demo
      setTimeout(() => valid.forEach(it => startUpload(it)), 500);
    }
  }, [startUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-300 rounded p-6 text-center bg-white"
      >
        <p className="text-sm text-slate-600">Arrastrá archivos aquí o</p>
        <label className="inline-block mt-3 cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept={ALLOWED_TYPES.join(",")}
          />
          <span className="px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200 text-sm">Seleccionar archivos</span>
        </label>
        <p className="text-xs text-slate-400 mt-2">Soportado: jpg, png, pdf — Máx {MAX_FILE_MB} MB c/u</p>
      </div>

      {message && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{message}</div>}

      <div className="space-y-2">
        {items.map(it => (
          <div key={it.id} className="flex items-center bg-white p-2 rounded shadow-sm">
            {it.preview ? (
              <img src={it.preview} alt={it.file.name} className="w-14 h-10 object-cover rounded mr-3" />
            ) : (
              <div className="w-14 h-10 flex items-center justify-center bg-slate-100 rounded mr-3 text-xs">{it.file.type.split("/").pop()}</div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{it.file.name}</div>
                  <div className="text-xs text-slate-500">{readableBytes(it.file.size)}</div>
                </div>
                <div className="text-xs text-slate-500 ml-4">{it.status === "uploading" ? `${it.progress}%` : it.status === "done" ? "Listo" : "En cola"}</div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-slate-100 h-2 rounded">
                  <div style={{ width: `${it.progress}%` }} className="h-2 rounded bg-slate-600 transition-all" />
                </div>
              </div>
            </div>
            <div className="ml-3 flex gap-2">
              {it.status === "done" ? (
                <button className="text-xs px-2 py-1 border rounded">Ver</button>
              ) : (
                <button className="text-xs px-2 py-1 border rounded">Cancelar</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
