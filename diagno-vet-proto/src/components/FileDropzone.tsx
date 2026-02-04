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

type Props = {
  onUploadComplete?: (files: File[]) => void;
};

export const FileDropzone: React.FC<Props> = ({ onUploadComplete }) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  // --- FUNCIÓN PARA ELIMINAR ---
  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      // Notificamos al componente padre (AnalyzePage) para actualizar el contador
      if (onUploadComplete) {
        const completedFiles = next
          .filter((p) => p.status === "done")
          .map((p) => p.file);
        onUploadComplete(completedFiles);
      }
      return next;
    });
  };

  const startUpload = useCallback(
    (item: UploadItem) => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "uploading", progress: 0 } : p
        )
      );

      let progress = 0;
      const id = setInterval(() => {
        progress += Math.random() * 20;

        if (progress >= 100) {
          clearInterval(id);

          setItems((prev) => {
            const next = prev.map((p) =>
              p.id === item.id
                ? { ...p, status: "done" as const, progress: 100 }
                : p
            );

            if (onUploadComplete) {
              const completedFiles = next
                .filter((p) => p.status === "done")
                .map((p) => p.file);
              onUploadComplete(completedFiles);
            }

            return next;
          });

          setMessage("Archivo/s cargado/s correctamente.");
          setTimeout(() => setMessage(null), 3500);
        } else {
          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, progress: Math.round(progress) }
                : p
            )
          );
        }
      }, 300);
    },
    [onUploadComplete]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const arr = Array.from(files);
      const valid: UploadItem[] = [];

      for (const f of arr) {
        if (!ALLOWED_TYPES.includes(f.type)) {
          setMessage(`Tipo no permitido: ${f.name}`);
          setTimeout(() => setMessage(null), 3000);
          continue;
        }

        if (f.size > MAX_FILE_MB * 1024 * 1024) {
          setMessage(`${f.name} supera los ${MAX_FILE_MB} MB.`);
          setTimeout(() => setMessage(null), 4000);
          continue;
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        valid.push({
          id,
          file: f,
          progress: 0,
          status: "queued",
          preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
        });
      }

      if (valid.length) {
        setItems((prev) => [...prev, ...valid]);
        setTimeout(() => valid.forEach(startUpload), 500);
      }
    },
    [startUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-white hover:bg-slate-50 transition-colors"
      >
        <p className="text-sm text-slate-500 font-medium">Arrastrá archivos aquí o</p>
        <label className="inline-block mt-3 cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept={ALLOWED_TYPES.join(",")}
          />
          <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-bold transition-all">
            Seleccionar archivos
          </span>
        </label>
      </div>

      {message && (
        <div className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
          {message}
        </div>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
          >
            {it.preview ? (
              <img
                src={it.preview}
                alt={it.file.name}
                className="w-12 h-12 object-cover rounded-lg mr-4 border border-slate-100"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-lg mr-4 text-[10px] font-bold text-slate-400">
                {it.file.type.split("/").pop()?.toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-bold text-slate-700 truncate pr-2">
                  {it.file.name}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase">
                  {it.status === "uploading" ? `${it.progress}%` : it.status === "done" ? "Ready" : "Queued"}
                </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${it.progress}%` }}
                  className={`h-full transition-all duration-300 ${
                    it.status === "done" ? "bg-green-500" : "bg-blue-600"
                  }`}
                />
              </div>
            </div>

            {/* BOTÓN ELIMINAR (TACHITO) */}
            <div className="ml-4">
              <button 
                onClick={() => removeItem(it.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Eliminar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};