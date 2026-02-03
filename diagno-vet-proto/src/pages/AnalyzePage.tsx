import { useState } from "react";
import { FileDropzone } from "../components/FileDropzone";
import { AppHeader } from "../components/AppHeader";

type Props = {
  onFinish: () => void;
  onBack: () => void;
};

export function AnalyzePage({ onFinish, onBack }: Props) {
  const [animalName, setAnimalName] = useState("");
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState("");
  const [imagesUploaded, setImagesUploaded] = useState(false);

  const canContinue =
    animalName.trim() &&
    species.trim() &&
    age.trim() &&
    imagesUploaded;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader
  title="New Diagnostic Report"
  onBack={onBack}
  logoLink="/"
/>


      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Patient information
          </h2>

          <div className="space-y-4">
            <input
              placeholder="Animal name *"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />

            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Species *</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Age *"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Diagnostic images
          </h2>

          <FileDropzone
            onUploadComplete={() => setImagesUploaded(true)}
          />
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
        <button
          disabled={!canContinue}
          onClick={onFinish}
          className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:bg-blue-300"
        >
          Continue to analysis →
        </button>
      </footer>
    </div>
  );
}
