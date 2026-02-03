import { AppHeader } from "../components/AppHeader";

type Props = {
  onCreateReport?: () => void;
};

export function DashboardPage({ onCreateReport }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader
        right={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button className="hover:text-gray-900">My Studies</button>

            <button
              onClick={onCreateReport}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              + New Report
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="font-medium">Fernanda Barbero</span>
            </div>
          </div>
        }
      />

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to DiagnoVetAI
          </h1>
          <p className="text-gray-600 max-w-2xl">
            You’re all set. Create diagnostic reports by uploading patient data
            and medical images to receive AI-assisted insights.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard title="Reports created" value="0" />
          <MetricCard title="Patients" value="0" />
          <MetricCard title="Active reports" value="0" />
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No reports yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by creating your first diagnostic report. You’ll upload
            medical images and patient information to begin the analysis.
          </p>

          <button
            onClick={onCreateReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create your first diagnostic report
          </button>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
